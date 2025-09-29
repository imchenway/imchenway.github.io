---
title: Spring Cloud Stream Kafka 压力治理
date: 2021-10-26
tags: ['#Spring', '#Kafka', '#Resilience']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 背景
面对峰值流量，需要优化 Spring Cloud Stream 在 Kafka 场景下的背压、批量发送与重试策略，确保消息不丢失。

# 优化手段
- 配置 `max.poll.records` 与 `concurrency`，保持消费速率平衡；
- 利用 `ErrorMessage` 通道与 Dead Letter Topic 承接异常消息；
- 引入 `BackOff` 策略，避免重试风暴。

# 观测与测试
- 暴露 `Binder` 指标，监控吞吐、延迟与重试次数；
- 使用 Testcontainers 搭建 Kafka 集群进行压测；
- 结合 Chaos 实验模拟 Broker 故障。

# 自检清单
- 是否配置消息幂等与重复消费保障？
- 是否验证批量提交对延迟的影响？
- 是否模拟网络抖动场景并制定降级策略？

# 参考资料
- Spring Cloud Stream Kafka Binder 文档：https://docs.spring.io/spring-cloud-stream/docs/current/reference/html/spring-cloud-stream-binder-kafka.html
- Apache Kafka 官方文档：https://kafka.apache.org/documentation/
- Testcontainers Kafka 模块文档：https://www.testcontainers.org/modules/kafka/
