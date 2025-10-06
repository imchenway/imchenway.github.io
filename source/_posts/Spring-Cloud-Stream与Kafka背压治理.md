---
title: Spring Cloud Stream与Kafka的背压治理
date: 2022-06-04
lang: zh-CN
tags: ['#Spring']
---

### 本文目录
<!-- toc -->

# 引言
> Spring Cloud Stream 基于 Binder 抽象连接消息系统，Kafka 是主要实现之一。在高吞吐场景，需要控制背压、避免消费者堆积。本文介绍背压治理策略与监控手段。

# 架构要点
- Binder：`spring-cloud-stream-binder-kafka`；
- 消费者配置：`spring.cloud.stream.kafka.bindings.*`；
- 与 Reactor 集成：函数式编程模型 `Supplier/Function/Consumer`；
- 背压：通过并发、批量、流量控制实现。

# 背压策略
## 1. 消费速率控制
- `max.poll.interval.ms`、`max.poll.records`；
- `spring.cloud.stream.kafka.bindings.input.consumer.concurrency`；
- 配合 `ackMode=MANUAL` 手动确认。

## 2. 批量与缓冲
- 使用 `BatchMode: true`，一次拉取多条；
- Reactor 模式下使用 `Flux` 缓冲 `bufferTimeout`；
- 结合 `RetryTemplate`，避免失败重放风暴。

## 3. 动态扩容
- 使用 `Kafka Streams` binder 实现弹性；
- 在 Kubernetes 中横向扩容，确保 groupId 唯一；
- 管理 Consumer Lag，使用 Burrow/Prometheus exporter。

## 4. 熔断与限流
- 结合 `Spring Cloud CircuitBreaker`，对下游服务慢响应进行熔断保护；
- 使用 `RateLimiter` 控制生产者速度。

# 监控与告警
- Micrometer `spring.cloud.stream.binder.kafka` 指标；
- Kafka Lag Exporter 监控 `consumer_lag`；
- JFR 事件：`KafkaConsumerRecord`；
- 告警阈值：Lag 超阈值、poll 超时、重试次数。

# 实战经验
- 在日志采集系统中，通过批量确认 + 并发消费者，将背压控制在 5s 内；
- 在金融记账服务中，配合 Dead Letter Topic 处理失败消息，避免重复消费；
- 多租户场景采用动态 groupId（`tenantId-app`），实现隔离。

# 总结
Spring Cloud Stream 通过配置化提供背压控制。结合 Kafka 参数调优、监控与自动扩容，可以构建稳定的事件处理链路。

# 参考资料
- [1] Spring Cloud Stream Reference. https://docs.spring.io/spring-cloud-stream/docs/current/reference/html/spring-cloud-stream.html
- [2] Kafka Consumer Configs. https://kafka.apache.org/documentation/#consumerconfigs
- [3] Micrometer Kafka Metrics. https://micrometer.io/docs/ref/kafka
