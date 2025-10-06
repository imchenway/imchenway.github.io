---
title: Spring WebFlux与响应式系统设计
date: 2022-07-24
lang: zh-CN
tags: ['#Spring']
---

### 本文目录
<!-- toc -->

# 引言
> WebFlux 基于 Reactor 提供非阻塞编程模型，适用于高并发、I/O 密集系统。本文介绍响应式设计原则、背压处理与与生态组件的协同。

# 核心概念
- Reactor 类型：`Mono<T>`、`Flux<T>`；
- Backpressure：`request(n)` 控制速率；
- Scheduler：控制线程模型；
- `WebClient`：非阻塞 HTTP 客户端。

# 设计原则
1. **非阻塞**：避免阻塞调用，必要时使用 `publishOn`、`subscribeOn` 切换线程；
2. **事件驱动**：以数据流为中心；
3. **弹性**：通过背压、超时、重试保证稳定；
4. **可观测**：结合 Micrometer、Sleuth 收集指标。

# WebFlux 架构
- Netty 作为默认服务器；
- HandlerFunction vs. 注解模型；
- RouterFunction DSL：`RouterFunctions.route(GET("/orders"), handler::getOrders)`；
- 集成 R2DBC、Reactive MongoDB、Redis Stream。

# 背压实践
- 使用 `Flux.limitRate`、`Flux.onBackpressureBuffer` 控制缓冲；
- 对下游服务设置 `timeout`、`retryBackoff`；
- 与 Kafka、RabbitMQ 等消息系统结合时，配置消费者背压。

# 监控与调优
- Micrometer Reactor Metrics：订阅数、延迟；
- 使用 `BlockHound` 检查阻塞调用；
- 在 `WebClient` 上启用连接池、超时；
- 对 Netty 调整 `EventLoop` 数量。

# 实战经验
- 在短信网关中，使用 WebFlux 处理高并发发送，结合 Redis Stream 限流；
- 在 API Gateway 中，通过 WebClient + CircuitBreaker 调用下游服务，保持低延迟；
- 将 Reactor Context 与租户信息绑定，实现安全控制。

# 总结
Spring WebFlux 提供了响应式编程的基础设施。通过非阻塞设计、背压治理与观测，实现高可用、高吞吐的服务端系统。

# 参考资料
- [1] Spring WebFlux Reference. https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html
- [2] Project Reactor Reference. https://projectreactor.io/docs/core/release/reference/
- [3] R2DBC Specification. https://r2dbc.io
