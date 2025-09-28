---
title: Service Governance指标体系建设
date: 2023-02-09
tags: ['#ServiceMesh']
---

### 本文目录
<!-- toc -->

# 引言
> 服务治理需要可衡量的指标体系。本文总结 Service Mesh 与 RPC 场景下的关键指标、告警策略，以及如何构建统一监控面板。

# 指标分类
- **可用性**：成功率、失败率、SLA；
- **性能**: 延迟 P50/P95/P99、吞吐；
- **资源**: CPU、内存、连接数；
- **安全**: mTLS 握手失败、认证失败；
- **治理**: 重试次数、熔断触发、限流事件。

# 数据来源
- Envoy / Istio Telemetry；
- 应用指标（Micrometer、Prometheus）；
- 分布式追踪（Zipkin、Jaeger）；
- 日志（ELK、Loki）。

# 面板设计
- 使用 Grafana 构建“服务概览”Dashboard；
- 按服务、租户、区域分组；
- 重点关注 P99、错误率；
- 提供 Drill-down 链路分析入口。

# 告警策略
- 多级阈值：Warning/ Critical；
- 聚合报警，避免风暴；
- 提供自愈脚本，如自动扩容；
- 保留报警历史，做指标回溯。

# 总结
完善的指标体系是服务治理的基础。通过标准化指标、统一面板和自动化告警，可以实现精细化运营。

# 参考资料
- [1] Google SRE Workbook.
- [2] Istio Telemetry. https://istio.io/latest/docs/tasks/observability/
- [3] Prometheus Operator.
