---
title: 混沌工程演练手册：设计、执行与复盘
date: 2018-11-26
tags: ['#SRE', '#ChaosEngineering']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 为什么需要混沌工程
混沌工程用于验证系统在真实故障场景下的韧性，通过可控实验暴露薄弱环节，降低生产事故风险。Netflix 的 Chaos Monkey 是早期实践代表。

# 演练流程
1. **设定目标**：明确要验证的假设（例如：数据库故障时服务是否降级）。
2. **选择指标**：SLI/SLO、报警阈值、业务 KPI。
3. **设计实验**：选择故障注入方式（网络延迟、节点宕机、依赖超时）。
4. **安全控制**：灰度范围、自动止损条件、实验持续时间。
5. **执行实验**：借助 Chaos Toolkit、LitmusChaos、Gremlin 等工具。
6. **监控与记录**：实时观察指标、事件日志。
7. **复盘与改进**：分析结果，制定改进措施并跟踪落实。

# 常见场景
- 网络异常：延迟、丢包、断连；
- 基础设施：节点宕机、磁盘 IO 限制；
- 应用层：线程池饱和、缓存击穿、依赖超时；
- 数据层：主从切换、只读模式。

# 工具生态
- **Chaos Toolkit**（开源）：声明式实验定义；
- **LitmusChaos**：Kubernetes 原生；
- **Gremlin**：商用平台；
- **AWS Fault Injection Simulator**：云平台注入。

# 自检清单
- 是否在演练前与业务团队沟通影响范围？
- 是否设置自动停止条件，避免长时间影响生产？
- 是否将实验结果纳入知识库并安排后续改进？

# 参考资料
- Chaos Engineering 原则：https://principlesofchaos.org/
- Netflix Chaos Automation Platform：https://netflixtechblog.com/chaos-engineering-upgraded-878d341f15fa
- Chaos Toolkit 文档：https://docs.chaostoolkit.org/
