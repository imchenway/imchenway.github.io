---
title: Debezium CDC与实时数仓同步方案
date: 2024-04-14
lang: zh-CN
tags: ['#Database']
---

### 本文目录
<!-- toc -->

# 引言
> Debezium 基于 CDC 捕获数据库变更，是建设实时数仓的关键组件。本文介绍架构、配置与下游同步策略。

# 架构
- Connector 捕获 MySQL/PostgreSQL/Oracle 变更；
- Kafka Connect 传输至 Kafka；
- 下游 Sink（Flink、Kafka Streams、Spark）处理；
- Schema Registry 管理模式。

# 配置要点
- MySQL binlog：`log_bin`, `binlog_format=ROW`；
- Debezium MySQL Connector 配置 `database.include.list`, `table.include.list`；
- 事务一致性：`snapshot.mode=schema_only` 或 `initial`；
- 下游 Sink upsert 写入数据仓库（Snowflake、ClickHouse）。

# 实践策略
- 数据脱敏，避免敏感字段外泄；
- Schema 变更处理（`before`/`after`）；
- 多表 Join 在下游处理；
- 监控延迟 `source.lag.milli`; 
- 故障恢复：重置 offset 或使用快照。

# 总结
Debezium + Kafka 建立高可靠的实时数据链路。通过精细配置与监控，可实现近实时的数仓同步。

# 参考资料
- [1] Debezium Documentation. https://debezium.io/documentation
- [2] Confluent Platform CDC 参考架构.
