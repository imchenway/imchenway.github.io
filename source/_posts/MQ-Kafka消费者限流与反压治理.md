---
title: Kafka消费者限流与反压治理
date: 2023-07-19
tags: ['#MQ']
---

### 本文目录
<!-- toc -->

# 引言
> 高吞吐消费场景下，消费者容易因为下游压力而积压。本文介绍 Kafka 消费者限流、反压策略与监控实践。

# 限流策略
- 控制 `max.poll.records`、`fetch.max.bytes`；
- `max.partition.fetch.bytes` 限制每分区数据；
- 使用 `pause`/`resume` API 对特定分区暂停；
- 应用层实现令牌桶限流。

# 反压机制
- 在流处理框架（Flink、Spark）中开启反压链路；
- 使用 Reactor/Kafka Streams 的背压；
- 当下游变慢时延迟提交 offset，避免过快拉取。

# 监控指标
- `consumer_lag`（Prometheus、Burrow）；
- 消费延迟、处理耗时；
- `poll` 周期、`rebalance` 次数；
- 错误率、重试次数。

# 调优案例
- 通过 `pause` 分区保护下游缓存；
- 结合 `RateLimiter` 动态调整消费速度；
- 在峰值场景采用多消费者组分担；
- 监控 `lag` 指标触发扩容。

# 总结
Kafka 消费者限流与反压需要结合客户端参数、业务逻辑与监控，才能在高峰时保持系统稳定。

# 参考资料
- [1] Kafka Consumer Configs. https://kafka.apache.org/documentation/#consumerconfigs
- [2] Confluent: Controlling consumer throughput.
