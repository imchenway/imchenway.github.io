---
title: 故障演练 Runbook 标准化流程
date: 2020-01-26
tags: ['#SRE', '#ChaosEngineering', '#Runbook']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 建立 Runbook 的目标
标准化的 Runbook 帮助团队在混沌实验或真实事故中迅速执行操作、减少认知负担。好的 Runbook 应覆盖目标、前置条件、操作步骤、回滚方案与验证指标，并保持持续更新。

# 模板结构
1. **概述**：说明演练目标、相关系统、责任人；
2. **前置检查**：依赖是否健康、告警是否开启、通知对象；
3. **执行步骤**：以编号列出具体命令和预期结果；
4. **监控验证**：列出 Grafana Dashboard、Prometheus 查询、日志索引；
5. **回退方案**：条件、触发方式、预计恢复时间；
6. **实验记录**：时间线、指标截图、异常情况；
7. **改进项**：演练结束后填入待办。

# 最佳实践
- 将 Runbook 存储在版本库，采用 PR 审核；
- 在混沌工程平台（Chaos Mesh、Gremlin）中引用；
- 引入自动化脚本减少人工操作；
- 保持与错误预算、SLO 面板联动。

# 自检清单
- 是否每个步骤都提供了命令/脚本与预期结果？
- 是否明确回滚条件和责任人？
- 是否在演练后更新 Runbook、关闭遗留风险？

# 参考资料
- Google SRE Workbook - Incident Response：https://sre.google/workbook/incident-response/
- Chaos Mesh 文档：https://chaos-mesh.org/docs
- PagerDuty Runbook 模板：https://response.pagerduty.com/runbooks/
