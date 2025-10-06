---
title: 消息系统的性能压测与容量规划
date: 2023-11-06
lang: zh-CN
tags: ['#MQ']
---

### 本文目录
<!-- toc -->

# 引言
> 性能压测与容量规划是消息系统上线前的必备环节。本文介绍压测指标、方法和容量规划模型。

# 压测指标
- 吞吐量（TPS / MBps）；
- 延迟（P50/P95/P99）；
- 消息大小、批量；
- Broker 资源使用（CPU、IO、内存）。

# 压测方法
- 使用 `kafka-producer-perf-test.sh`、`kafka-consumer-perf-test.sh`；
- RabbitMQ `perf-test`；
- RocketMQ `benchmark` 工具；
- 结合自定义工具模拟业务。

# 容量规划
- 基于峰值流量 + 冗余系数；
- 计算存储需求：消息大小×保留时间；
- 网络带宽评估；
- 扩展方案：分区/Topic 拆分、Broker 扩容。

# 监控与复盘
- 压测时记录指标，生成报告；
- 对瓶颈进行调优（批量、压缩、线程）；
- 建立基线，后续版本对比；
- 发布后持续监控验证。

# 总结
通过系统化的压测与容量规划，可以为消息系统的稳定运行提供保障。

# 参考资料
- [1] Kafka Performance Tuning Guide.
- [2] RabbitMQ Benchmark Tools.
