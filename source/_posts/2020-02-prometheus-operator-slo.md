---
title: Prometheus Operator SLO 落地指南
date: 2020-02-26
tags: ['#Observability', '#SLO', '#Prometheus']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 架构概览
Prometheus Operator 通过 CRD 管理 Prometheus/Alertmanager/ServiceMonitor。结合 SLO Recording Rules 与告警策略，可实现错误预算自动告警、Grafana 看板与发布节奏联动。

# 实施步骤
1. **定义 SLI**：例如 HTTP 成功率、P95 延迟；
2. **RecordingRule**：
```yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: slo-rules
spec:
  groups:
    - name: http-slo
      rules:
        - record: slo:http_request:success_ratio
          expr: sum(rate(http_server_requests_seconds_count{status!~"5.."}[5m]))
                /
                sum(rate(http_server_requests_seconds_count[5m]))
```
3. **错误预算计算**：使用 4 周窗口 `1 - success_ratio`。
4. **告警**：设置 `ErrorBudgetBurn` 告警（多窗口策略 5m/1h/6h）。
5. **Grafana 看板**：结合 `slo:burn_rate` 展示预算剩余。 

# 自动化与治理
- 将 SLO 配置放入 GitOps 仓库，使用 Argo CD/Flux 发布；
- 与 Slack/Teams 集成，告警携带 runbook 链接；
- 在发布流水线中检查预算剩余量；
- 复盘时收集 burn rate 曲线，为架构优化提供依据。

# 自检清单
- 是否为每个关键服务定义 SLI/SLO？
- 是否实现多窗口 burn rate 告警避免误报？
- 是否在 Grafana 中展示预算趋势并与发布流程耦合？

# 参考资料
- Prometheus Operator 文档：https://github.com/prometheus-operator/prometheus-operator
- Google SRE Workbook - Alerting on SLOs：https://sre.google/workbook/alerting-on-slos/
- Grafana SLO Dashboard 示例：https://grafana.com/grafana/dashboards/11378
