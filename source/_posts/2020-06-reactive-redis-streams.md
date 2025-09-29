---
title: Reactive Redis Streams 实战指南
date: 2020-06-05
tags: ['#Java', '#Reactive', '#Redis']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 为什么选择 Reactive Redis Streams
Redis Streams 结合响应式编程可以在高并发场景下减少阻塞等待。Spring Data Redis 提供 `ReactiveStringCommands`、`ReactiveStreamCommands`，配合 Project Reactor 构建背压友好的消息处理流水线。

# 基础示例
```java
Flux<StreamMessage<String, String>> stream = reactiveStreamCommands.read(
    Consumer.from("group", "consumer-1"),
    StreamReadOptions.empty().block(10),
    StreamOffset.create("order-stream", ReadOffset.lastConsumed()));

stream.flatMap(msg -> process(msg).then(ack(msg)))
      .onErrorContinue((ex, msg) -> log.warn("fail", ex))
      .subscribe();
```

# 核心要点
- 使用消费组保证水平扩展与手动 ACK；
- 利用 `onBackpressureBuffer` 控制积压；
- 结合 `retryWhen` 与死信流处理异常消息；
- 对长时间未确认的消息使用 `XPending` 与 `claim` 恢复。

# 监控指标
- 队列长度：`XLEN`、`XPENDING`；
- 告警：待处理消息超过阈值；
- Micrometer：记录处理耗时与失败率。

# 自检清单
- 是否设置消费组并管理 ACK/claim？
- 是否限制缓冲区大小避免 OOM？
- 是否将 Stream 指标纳入 Prometheus/Grafana 监控？

# 参考资料
- Redis Streams 文档：https://redis.io/docs/data-types/streams/
- Spring Data Redis Reactive API：https://docs.spring.io/spring-data/redis/docs/current/reference/html/#redis.reactive
- Reactor 参考手册：https://projectreactor.io/docs/core/release/reference/
