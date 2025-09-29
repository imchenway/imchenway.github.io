---
title: 事故指挥（Incident Command）流程与角色分工
date: 2019-12-26
tags: ['#SRE', '#IncidentResponse']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 事故指挥角色
- **Incident Commander (IC)**：总体协调、决策、沟通；
- **Operations Lead**：执行技术操作；
- **Communications Lead**：对内对外通报；
- **Scribe**：记录事件与时间线；
- **Subject Matter Expert**：提供专业支持。

# 流程
1. **触发**：告警或人工报告；
2. **评估**：确认严重等级，召集团队；
3. **分配角色**：IC 指定各角色，建立沟通频道；
4. **缓解措施**：Ops Lead 实施回滚、降级、限流；
5. **沟通**：定期向利益相关者更新状态；
6. **结束标准**：指标恢复、业务确认；
7. **事后复盘**：输出报告、改进行动项。

# 工具与模板
- ChatOps（Slack、Teams）指定 war-room；
- PagerDuty、Opsgenie 值班调度；
- Runbook 模板（Google Docs/Confluence）；
- 时间线记录工具（Blameless、JupiterOne）。

# 最佳实践
- 单人负责决策，避免多人争夺；
- 定期训练（GameDay）；
- 建立错误预算、发布策略联动；
- 复盘时关注流程与系统改进，不归咎个人。

# 自检清单
- 是否定义清晰的角色与替补列表？
- 是否建立统一的事故通报模板与节奏？
- 是否追踪改进项并在后续验证？

# 参考资料
- Google SRE Workbook - Incident Response：https://sre.google/workbook/incident-response/
- PagerDuty Incident Response 文档：https://response.pagerduty.com/
- Atlassian Incident Handbook：https://www.atlassian.com/incident-management/handbook
