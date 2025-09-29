---
title: Flink CDC 与 Exactly-Once 事务保障
date: 2021-04-19
tags: ['#Flink', '#CDC', '#ExactlyOnce']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 场景
Flink CDC 捕获数据库变更，需要保证下游（Kafka、Hudi、数据库）的 Exactly-Once 。通过 Source 端增量快照 + TwoPhaseCommitSink 可实现端到端事务语义。

# 实施
- Debezium Source + `incremental.snapshot.enabled=true`；
- Sink 使用 `TwoPhaseCommitSinkFunction` 写入 Kafka/Hudi；
- 配置 Checkpoint，确保 Source 与 Sink 的状态一致；
- 在恢复时使用 Savepoint 恢复偏移。

# 自检清单
- 是否配置 Checkpoint 间隔与超时？
- 是否在 sink 中实现幂等写入或两阶段提交？
- 是否在恢复流程中验证 offset 正确？

# 参考资料
- Flink CDC 文档：https://ververica.github.io/flink-cdc-connectors/master/content/about.html
- Flink TwoPhaseCommit Sink：https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/connectors/datastream/two-phase-commit/
- Hudi/Flink 集成指南
