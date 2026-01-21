---
title: "Agent 可观测性（AgentOps）①：把 Prompt / Tool / Memory 变成可追踪的 Trace"
date: 2026-01-21
lang: zh-CN
lang_ref: agentops-observability-1
tags: ['#Observability', '#OpenTelemetry', '#AIInfrastructure', '#SRE', '#Tracing']
categories:
  - Architecture
---

### 本文目录
<!-- toc -->

# 1. 系列导读：为什么 Agent 需要“可观测性”
当你把一个应用从“单体服务”演进到“分布式系统”，最大的变化往往不是代码量，而是**系统变成了黑箱**：一次请求跨越多个服务、多个队列、多个数据库，靠直觉排查很快失效，于是你需要日志、指标、追踪，来回答三个最朴素的问题：

- **发生了什么**（What）：这次请求到底走了哪些步骤？  
- **为什么发生**（Why）：是模型、检索、工具调用、还是上下文拼装出了问题？  
- **该怎么修**（How）：修复后是否回归？成本与延迟是否仍受控？

Agent（编排 + 工具调用 + 记忆 + 检索 + 模型推理）把黑箱进一步放大：同样是“生成一段回复”，背后可能发生了多轮规划、检索、调用、重试、回退、降级。没有可观测性，你会在以下场景反复踩坑：

- 线上出现“偶发性胡说/错调用/死循环重试”，但你只能看到最终输出，无法定位中间决策链路；
- 成本突然飙升（token、检索、外部 API 调用），但你不知道是哪类任务、哪条路径、哪个工具导致；
- 你改了 Prompt、路由策略或 Guardrail，感觉“应该更好”，却缺少可量化的回归验证和风险闸门。

因此，AgentOps 的第一性原理是：**把一次 Agent 任务还原成“可追踪的流水线”**，让每一次 Prompt、每一次检索、每一次工具调用、每一次模型推理，都能像分布式链路一样被观测、聚合、告警、复盘。

本系列计划三篇：
1) **基础篇（本文）**：观测对象清单 + Trace/Metric/Log 的统一模型  
2) **落地篇**：最小可行方案（MVP）怎么埋点、怎么建看板、怎么做回放  
3) **复盘篇**：把可观测性接入 SLO/错误预算/安全审计，形成组织级闭环

# 2. 观测对象清单：Agent 系统到底要看什么
传统服务最常见的观测对象是：HTTP 请求、数据库查询、缓存命中、队列积压。Agent 系统需要把“推理相关”的对象显式建模，否则你会永远停留在“看结果猜过程”的状态。

建议把 Agent 任务拆成 6 类观测对象（从用户视角到平台视角逐层展开）：

1) **入口请求（Task / Session）**
   - 谁在什么时候发起？（user/tenant/channel）
   - 目标是什么？（intent / task_type）
   - 输出质量如何？（用户反馈/点赞/人工验收结果）

2) **上下文构建（Context Assembly）**
   - Prompt 模板版本、变量填充结果、裁剪/压缩策略是否触发
   - 安全净化（PII 脱敏、注入过滤）是否触发

3) **检索与知识（Retrieval / RAG）**
   - query 生成、向量检索/关键词检索、重排（rerank）
   - 命中文档列表、分数分布、权限过滤是否生效
   - 新鲜度与一致性：索引版本、数据更新时间

4) **工具调用（Tools / Actions）**
   - 调了哪个工具？参数是什么（需脱敏）？调用耗时/失败率/重试次数
   - 外部依赖（支付、CRM、工单等）返回的错误类型与频率

5) **模型推理（Model Inference）**
   - 使用的模型/版本、输入/输出 token、延迟、拒答/安全拦截
   - 采样参数（temperature 等）或路由策略（为什么选这个模型）

6) **策略与护栏（Policy / Guardrails）**
   - 是否触发：内容安全、工具权限、预算阈值、降级路径
   - 触发后做了什么动作：改写 Prompt、重试、切小模型、转人工

把这 6 类对象完整串起来，你才能真正回答：“一次任务的成本、延迟、质量、风险，分别由哪个环节贡献”。

# 3. Trace 模型：把一次 Agent 任务拆成 Span 树
最实用的做法是把 Agent 任务视作一次分布式调用链：**一个 root span + 多个子 span**。你不需要追求一开始就“完全标准化”，但要保证三件事：

1) **能串起来**：同一次任务的所有步骤可关联（trace_id + session_id）  
2) **能聚合**：关键字段可用于分组统计（模型名、工具名、tenant、task_type）  
3) **能回放**：必要上下文可在脱敏后重建（Prompt 版本、检索结果引用、工具调用摘要）

下面是一个典型的 Trace 结构（纯文本示意）：

```text
agent.run (root)
├── prompt.render
├── guardrail.input_sanitize
├── retrieval.query_generate
├── retrieval.search
├── retrieval.rerank
├── model.infer (planner)
├── tool.call (jira.createTicket)
├── tool.call (payments.refund)
├── model.infer (final)
└── guardrail.output_filter
```

## 3.1 建议的 Span 属性（示例）
为了后续能统计“谁最慢、谁最贵、谁最不稳定”，每类 span 至少要有一组可聚合字段。示例（仅示意，字段名可按你团队规范调整）：

```json
{
  "trace_id": "…",
  "session_id": "…",
  "tenant_id": "acme",
  "task_type": "support_ticket",
  "span.kind": "INTERNAL",
  "component": "agent",
  "step": "model.infer",
  "model.name": "…",
  "model.version": "…",
  "tokens.input": 1234,
  "tokens.output": 456,
  "cost.usd": 0.0123,
  "latency.ms": 850,
  "retry.count": 1,
  "policy.downgraded": false
}
```

关键点：**把“成本与质量”也当作一等公民**。Agent 不是纯计算服务，它是“质量/成本/风险”的权衡机器；只看延迟会误导你。

## 3.2 追踪什么，不追踪什么
可观测性不是“把一切都记录下来”。建议给出明确的分级策略：

- 必追踪：span 时间线、模型/工具/检索的聚合字段、错误码与重试  
- 可采样：Prompt 渲染结果、检索命中文档片段、工具入参/出参摘要  
- 禁止落盘：原始 PII、密钥、完整业务数据、未经授权的用户输入原文（或需严格脱敏/加密/访问控制）

这类策略建议与安全团队对齐，并结合风险框架执行（可参考 NIST AI RMF 与 OWASP LLM Top 10 的治理思路）。

# 4. 指标（Metrics）：把 SLO、成本、质量联到同一张表
追踪解决“单次请求的因果链”，指标解决“整体趋势与告警”。对 Agent 系统来说，建议至少落地四组核心指标：

1) **延迟与可靠性**
   - 端到端延迟 P50/P95/P99
   - 任务成功率（含“输出合格”与“动作执行成功”的区分）
   - 工具调用失败率/重试率

2) **成本与资源**
   - token 输入/输出分布、单位任务成本
   - 检索成本（向量检索 QPS、重排开销）、外部 API 成本
   - 缓存命中率与节省量

3) **质量（可以从“弱监督”开始）**
   - 用户反馈（👍/👎）、人工抽检通过率
   - 事实性错误率（基于抽样审核或 Evals）
   - 引用覆盖率（有多少回答带引用/证据链）

4) **风险与护栏**
   - 安全拦截率（输入/输出）
   - 越权工具调用拦截次数
   - 触发降级/转人工的比例与恢复时间

把这些指标和 trace 的维度字段打通，你就能回答：“某租户的成本上升，是因为工具失败重试，还是因为 RAG 命中变差导致多轮推理？”

# 5. 日志与审计（Logs）：可回放、可追责、可脱敏
Agent 系统的日志最好分成两层：

1) **运行日志（运维视角）**：错误栈、超时、依赖故障、重试、配额触发  
2) **决策日志（产品/治理视角）**：为什么选这个工具/模型？为什么拒答/降级？为什么触发某条策略？

强烈建议给“决策日志”一个结构化格式，并与 trace_id 绑定。一个可落地的最小字段集合：

- trace_id / session_id / tenant_id / task_type
- planner 输出摘要（脱敏后）
- 工具选择理由（规则命中 / 模型判断 / 人工输入）
- Guardrail 命中项（哪条规则、证据是什么、采取了什么动作）
- 重要版本号：prompt_version / policy_version / tool_schema_version

有了这些字段，你的复盘会从“讨论观点”变成“对齐事实”。

# 6. 最小落地方案（MVP）：一周内把黑箱打开
如果你要从 0 到 1 落地，建议先做 MVP，而不是一口气建“全功能 Agent 平台”。一周内可以完成的 MVP 目标是：

1) **每次任务都有 trace_id**，并能看到基本的 span 树  
2) **模型/工具/检索三类 span 可聚合统计**（谁最慢、谁最贵、谁最常失败）  
3) **能回放关键路径**（至少能复现“用了哪些 Prompt 版本 + 命中了哪些文档 + 调了哪些工具”）

Checklist（像测试一样可验收）：
- [ ] 每次 agent.run 都记录：tenant_id、task_type、最终状态（success/failed/downgraded/handoff）
- [ ] 每个 tool.call 都有：tool.name、latency、status_code、retry.count（入参/出参按策略脱敏）
- [ ] 每个 model.infer 都有：model.name、tokens.input/output、latency、cost（若可得）
- [ ] retrieval.search 有：index_version、top_k、命中数量、过滤数量（权限）
- [ ] guardrail 命中可追踪：rule_id、action、severity

# 7. 结语：下一篇会写什么
本文把 Agent 可观测性拆成了“对象清单 + Trace/Metric/Log 的统一模型”，核心目标只有一个：**让 Agent 任务从黑箱变成可解释的流水线**。

下一篇（落地篇）我会把这套模型进一步具体化：如何在不引入过多平台复杂度的前提下，用 OpenTelemetry 的思路把埋点、看板、告警、回放跑起来，并给出一套“从 0 到可用”的工程步骤与常见坑清单。

# 参考资料
- OpenTelemetry 官方文档：https://opentelemetry.io/docs/  
- OWASP Top 10 for LLM Applications：https://owasp.org/www-project-top-10-for-large-language-model-applications/  
- NIST AI Risk Management Framework：https://www.nist.gov/itl/ai-risk-management-framework  
- Kubernetes 文档（用于理解分布式链路与可观测实践背景）：https://kubernetes.io/docs/

