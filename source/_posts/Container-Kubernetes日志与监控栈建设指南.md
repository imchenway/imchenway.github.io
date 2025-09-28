---
title: Kubernetes 日志与监控栈建设指南
date: 2024-11-20
tags: ['#Container']
---

### 本文目录
<!-- toc -->

# 引言
> 统一的可观测平台是运维基石。本文整理 Kubernetes 监控栈（Prometheus、Grafana、Alertmanager）与日志栈（EFK、Loki）的建设指导。

# 指标监控
- Prometheus Operator 部署 Prometheus/Alertmanager；
- kube-state-metrics、node-exporter、cAdvisor；
- ServiceMonitor/PodMonitor 自定义采集；
- Grafana Dashboard 展示控制面、节点、应用指标。

# 日志采集
- EFK（Elasticsearch + Fluentd + Kibana）或 Loki + Promtail；
- 定义日志格式（JSON）；
- Multi-tenant 按 namespace、标签索引；
- 日志保留策略与冷热数据分层。

# Trace 集成
- OpenTelemetry Collector 收集 Trace；
- Jaeger/Tempo 展示调用链；
- 统一 TraceID 注入（Envoy/Sidecar）。

# 告警与自动化
- Alertmanager 路由规则与静默；
- Ops 平台（PagerDuty、Feishu）通知；
- 使用 Runbook 自动化处理常见问题。

# 安全与合规
- 控制日志访问权限，敏感数据脱敏；
- 审计日志采集（API Server Audit）；
- 监控平台备份与灾备。

# 总结
完整的 Kubernetes 可观测体系包含指标、日志、追踪。通过 Operator、统一标准与自动化响应，可以在复杂集群中保持透明度。

# 参考资料
- [1] Prometheus Operator Doc. https://github.com/prometheus-operator/kube-prometheus
- [2] Loki Documentation. https://grafana.com/docs/loki/latest/
