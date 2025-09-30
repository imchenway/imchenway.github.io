---
title: SRE 错误预算与发布节奏管理
date: 2018-10-26
tags: ['#SRE', '#Reliability']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 错误预算概念
错误预算 = 1 - SLO。允许一定的失败，以换取迭代速度。SRE 团队通过监控 SLO 消耗来决定发布节奏、变更审核与应急策略。

# 实施步骤
1. **定义 SLO/SLI**：与业务共同确定核心指标（如成功率、延迟 P95、可用时长）。
2. **计算错误预算**：按月/季度计算可接受故障时间。示例：99.9% 可用性 -> 每月 43.2 分钟。
3. **监控与告警**：Grafana/Prometheus 监控错误预算消耗，设置告警阈值（50%、75%、90%）。
4. **发布策略**：
   - 错误预算充足：正常发布节奏；
   - 即将耗尽：收紧发布、开展改进；
   - 耗尽：暂停非必要发布，优先修复可靠性问题。
5. **复盘**：每个周期回顾预算使用情况，调整 SLO 或改进措施。

# 工具与实现
- **Prometheus Recording Rules** 计算错误预算消耗；
- **Grafana Dashboard** 可视化预算剩余；
- **Alertmanager** 配置告警；
- 与 CI/CD 集成，根据预算状态动态调整部署策略。

# 自检清单
- 是否定义清晰的 SLI/SLO 并达成共识？
- 是否有实时监控与告警支持错误预算跟踪？
- 是否建立了预算耗尽时的行动准则？

# 参考资料
- Google SRE Workbook：https://sre.google/workbook/alerting-on-slos/
- Prometheus SLO 模板：https://github.com/cloudprober/cloudprober/tree/master/examples/prometheus-slo
- Grafana SLO Dashboard 参考：https://grafana.com/grafana/dashboards/11378
