---
title: Dapr组件化微服务实践
date: 2022-12-21
tags: ['#ServiceMesh']
---

### 本文目录
<!-- toc -->

# 引言
> Dapr 提供通用的微服务运行时，封装状态存储、消息发布、服务调用等能力，可视作 Service Mesh 的组件化补充。本文介绍 Dapr 的构建块与 Spring/Dubbo 集成。

# 核心构建块
- Service Invocation：基于 gRPC/HTTP；
- State Store：Redis、Azure Cosmos DB 等；
- Pub/Sub：Kafka、RabbitMQ；
- Bindings：连接外部事件源；
- Secret Store：Vault、KMS。

# 与 Spring 整合
- 使用 Dapr Java SDK `DaprClient` 调用；
- Spring Cloud Stream 与 Dapr Pub/Sub 集成；
- 使用 `dapr.io/app-port` 注解，开启 Sidecar；
- 配合 Spring Boot Actuator 监控。

# Dubbo 与 Dapr
- Dubbo Triple 支持 gRPC，Dapr Sidecar 可转发；
- 通过注册中心 gRPC Proxy 实现互联；
- 在混合架构中，Dubbo 提供 RPC，Dapr 提供 Pub/Sub、State。

# 可观测性
- Dapr 内置 OpenTelemetry；
- 将指标发送至 Prometheus；
- 结合 Zipkin/Jaeger 查看调用链；
- Dapr Dashboard 展示组件状态。

# 实战经验
- 在多云环境中使用 Dapr 将不同云服务封装，保持应用一致；
- 对跨语言通信引入 Dapr，减少 SDK 维护；
- 对高频操作仍需评估额外延迟。

# 总结
Dapr 通过组件化抽象简化了微服务开发。在 Service Mesh 架构中，可作为补充，为应用提供统一运行时能力。

# 参考资料
- [1] Dapr Documentation. https://docs.dapr.io
- [2] Dapr Java SDK. https://github.com/dapr/java-sdk
- [3] Microsoft, "Architecting Cloud-Native Applications with Dapr".
