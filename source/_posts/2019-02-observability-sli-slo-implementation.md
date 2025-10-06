---
title: SLI/SLO 落地实践：指标、告警与反馈循环
date: 2019-02-26
lang: zh-CN
tags: ['#SRE', '#Observability', '#SLO']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 实施步骤
1. **定义服务分类**：核心 API、后台任务等；
2. **确定 SLI 指标**：成功率、延迟、可用性、吞吐；
3. **设定 SLO**：与业务协商目标（例如 99.95% 可用性）；
4. **错误预算**：计算容许失败时间，驱动发布策略；
5. **监控与告警**：Prometheus Recording Rule + Alertmanager；
6. **反馈循环**：每月/季度评审 SLO，调整架构与流程。

# 指标采集
- Micrometer + Prometheus：`http_server_requests_seconds`, `jvm_gc_pause_seconds`；
- 合成监控：黑盒探测外部可用性；
- 分布式追踪：Jaeger/Zipkin 评估端到端延迟；
- 日志分析：ELK/Opensearch 提取错误率。

# 告警策略
- 短期窗口：快速识别突发故障；
- 长期预算：错误预算消耗告警；
- 双层告警：即时通知 + 工程任务（Tech Debt 修复）。

# 自动化
- Dashboard：Grafana SLO 面板展示预算剩余；
- CI/CD：发布前检查预算状态；
- ChatOps：在 Slack/Teams 中展示指标与预算消费。

# 自检清单
- 是否与业务方明确 SLO 定义及责任范围？
- 是否为每个 SLO 设置错误预算图表和告警？
- 是否建立回滚/降级策略与事后总结流程？

# 参考资料
- Google SRE Workbook - Alerting on SLOs：https://sre.google/workbook/alerting-on-slos/
- Prometheus SLO Recording Rules：https://github.com/cloudprober/cloudprober/tree/master/examples/prometheus-slo
- Grafana SLO Dashboard 模板：https://grafana.com/grafana/dashboards/11378
