---
title: Sidecar资源治理与调优策略
date: 2023-01-20
tags: ['#ServiceMesh']
---

### 本文目录
<!-- toc -->

# 引言
> Sidecar 是 Service Mesh 数据面的核心，资源消耗直接影响集群成本。本文总结 Sidecar（以 Envoy 为例）的 CPU/内存调优、连接管理与监控策略。

# 资源模型
- Envoy 需要 CPU 处理请求、TLS、过滤器；
- 内存用于连接、缓冲、统计；
- 与业务容器共享资源，需设定合理 Requests/Limits。

# 调优手段
- 调整 `concurrency`（线程数，一般与 vCPU 相等）；
- 控制连接池大小、超时时间；
- 启用 `SO_REUSEPORT` 提升吞吐；
- 使用 `envoy.filters.http.router` 与轻量过滤器，避免复杂逻辑；
- 关闭不必要的 Telemetry；
- 使用 `proxy.istio.io/config` 注入自定义参数。

# 监控指标
- Envoy `/stats`：`server.memory_allocated`, `http.ingress_downstream_rq_active`; 
- Prometheus: `istio_proxy_process_virtual_memory`; 
- 观察 P99 延迟、连接数；
- 使用 Kiali/Prometheus Dashboard 可视化。

# 成本优化
- 对低流量服务使用 `Sidecar` 资源配置压缩；
- 对高流量服务使用 HBONE/ambient mesh；
- 利用 HPA 根据 Envoy 指标伸缩；
- 定期审计 Sidecar 配置。

# 总结
Sidecar 资源治理需要结合指标监控、配置调优与架构演进。合理分配资源可以降低成本并保持性能稳定。

# 参考资料
- [1] Istio Proxy Config. https://istio.io/latest/docs/ops/configuration/mesh/app-health-check/
- [2] Envoy Admin Interface. https://www.envoyproxy.io/docs/envoy/latest/operations/admin
