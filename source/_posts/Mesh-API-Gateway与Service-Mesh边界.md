---
title: API Gateway与Service Mesh的职责边界
date: 2023-01-30
tags: ['#ServiceMesh']
---

### 本文目录
<!-- toc -->

# 引言
> API Gateway 与 Service Mesh 都承担流量治理，但关注点不同。本文梳理两者职责边界、协同策略以及在微服务架构中的落地模式。

# 职责比较
| 能力 | API Gateway | Service Mesh |
| --- | --- | --- |
| 协议适配 | HTTP/REST、WebSocket | L4/L7，多协议 | 
| 认证授权 | 对外身份验证 | 内部 mTLS、RBAC |
| 路由 | 北向路由、聚合 | 东西向路由、服务发现 |
| 安全 | DDoS、防爬虫 | 流量加密、租户隔离 |
| 流量治理 | 限流、缓存、API版本 | 熔断、重试、负载均衡 |

# 协同模式
- Gateway 处理入站流量，Mesh 管理服务间通信；
- 通过 Ingress Gateway（例如 Istio Gateway）统一入口；
- API 文档、产品化由 Gateway 负责；
- 服务拓扑与观测由 Mesh 负责。

# 架构建议
- 使用 Spring Cloud Gateway + Istio，将外部请求进入 Gateway，再由 Mesh 管理内部调用；
- 对外暴露 API Portal、认证、计费；
- 内部使用 ServiceEntry、VirtualService 控制路由；
- 监控统一接入 Observability 平台。

# 总结
API Gateway 与 Service Mesh 各有优势，合理划分职责可以构建高可用、可运营的微服务体系。

# 参考资料
- [1] Istio Concepts. https://istio.io/latest/docs/concepts/what-is-istio/
- [2] Spring Cloud Gateway Reference. https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/
