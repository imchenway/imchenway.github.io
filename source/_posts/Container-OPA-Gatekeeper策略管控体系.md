---
title: OPA/Gatekeeper 策略管控体系
date: 2024-11-30
tags: ['#Container']
---

### 本文目录
<!-- toc -->

# 引言
> Open Policy Agent (OPA) 与 Gatekeeper 提供 Kubernetes 准入控制策略。本文介绍策略编写、模板复用与治理流程。

# 架构
- Gatekeeper 作为准入控制器拦截请求；
- ConstraintTemplate 定义 Rego 策略；
- Constraint 指定作用范围；
- Audit 功能扫描现有资源。

# 策略示例
```rego
package k8srequiredlabels
violation[{
  "msg": msg,
  "details": {"missing_labels": missing}
}] {
  required := {"app", "team"}
  provided := {label | input.review.object.metadata.labels[label] != ""}
  missing := required - provided
  count(missing) > 0
  msg := sprintf("Missing required labels: %v", [missing])
}
```

# 实践流程
1. 策略评审与测试（Conftest、OPA unit test）；
2. 在 Dev/Stage 环境灰度；
3. 通过 GitOps 管理模板与约束；
4. 使用 Audit 报告现有违规资源；
5. 对违规资源设置补救流程。

# 可观测性
- Gatekeeper Metrics（violations, audit duration）；
- Integrate with Prometheus/Grafana；
- 日志记录拒绝原因；
- 与 Slack/Feishu 通知集成。

# 总结
OPA/Gatekeeper 帮助构建云原生合规体系。通过标准化策略、自动测试与灰度发布，可以在保障安全的同时保持敏捷。

# 参考资料
- [1] Gatekeeper Docs. https://open-policy-agent.github.io/gatekeeper/website/
- [2] OPA Rego Policy Language.
