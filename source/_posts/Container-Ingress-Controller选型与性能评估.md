---
title: Ingress Controller 选型与性能评估
date: 2024-12-20
lang: zh-CN
tags: ['#Container']
---

### 本文目录
<!-- toc -->

# 引言
> Ingress Controller 决定了集群对外暴露的能力。不同实现（NGINX、HAProxy、Traefik、Envoy、Kong）在性能、特性、可扩展性上差异明显。本文提供选型框架与性能评估方法。

# 选型维度
- 协议支持：HTTP/2、gRPC、WebSocket；
- 扩展能力：自定义插件、Lua、WASM；
- 性能与延迟；
- 可观测性与可维护性；
- 社区活跃度与商业支持。

# 测试方法
- 使用 Fortio、wrk2、hey 进行压测；
- 测试场景：静态资源、动态路由、TLS；
- 观察指标：RPS、P99 延迟、CPU/内存；
- 配置自动扩容（HPA）。

# 常见方案总结
- **NGINX Ingress**：成熟稳定，支持 Lua、多功能；
- **HAProxy Ingress**：性能强，配置灵活；
- **Traefik**：动态配置、Let's Encrypt；
- **Contour/Envoy**：xDS 配置、与服务网格兼容；
- **Kong**：API Gateway 能力丰富。

# 实践建议
- 按环境拆分 Ingress Controller（生产/测试）；
- 使用 CRD（IngressClass, Gateway API）管理；
- 配置 WAF、限流、身份认证；
- 监控 `ingress_request_duration_seconds` 等指标。

# 总结
Ingress Controller 选型需结合功能、性能与生态。通过标准化测试与运维实践，可选择最适合业务的入口方案。

# 参考资料
- [1] Kubernetes Ingress Controller List. https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/
- [2] CNCF Ingress Benchmark Reports.
