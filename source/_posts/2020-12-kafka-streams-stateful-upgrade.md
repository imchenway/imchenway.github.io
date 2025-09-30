---
title: Kafka Streams 有状态应用的平滑升级
date: 2020-12-19
tags: ['#Kafka', '#Streams', '#Upgrade']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 升级挑战
有状态 Kafka Streams 应用依赖内部状态存储（RocksDB）。升级时需避免状态损坏、再平衡风暴及处理延迟飙升。

# 步骤
- **兼容性检查**：确认 serde、拓扑（`TopologyTestDriver`) 未变化；
- **版本 Rolling 升级**：逐实例替换，利用 `application.id` 保持状态目录；
- **暂停再平衡**：使用 `KAFKA_STREAMS_STANDBY_TASKS`、`static membership` 减少任务迁移；
- **状态备份**：提前备份状态目录或触发 Savepoint；
- **监控**：Lag、`records-lag-max`, `commit-latency-avg`, RocksDB compaction 时间。

# 自检清单
- 是否验证拓扑兼容（`Topology#describe` 对比）？
- 是否配置 Standby Replica 以提升容错？
- 是否在升级窗口观察 Lag 曲线并可快速回退？

# 参考资料
- Kafka Streams 官方文档：https://kafka.apache.org/documentation/streams/
- Confluent Rolling Upgrade 指南
- RocksDB 调优手册
