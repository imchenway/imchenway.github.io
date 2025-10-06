---
title: Apache Flink 状态备份与恢复策略
date: 2020-10-19
lang: zh-CN
tags: ['#Flink', '#Streaming', '#State']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 状态一致性要求
Flink 通过 Checkpoint 与 Savepoint 保障状态一致性。线上运行需明确检查点频率、存储位置、恢复策略，以及 Savepoint 作为版本升级手段。

# 配置建议
- Checkpoint：`state.backend: rocksdb`, `state.checkpoints.dir: hdfs://...`, `execution.checkpointing.interval: 60s`；
- Savepoint：`bin/flink savepoint <jobId> hdfs://savepoints`；
- 监控：`TaskManager` 指标 `checkpoint_duration`, `alignment_time`；
- 对大状态使用增量 Checkpoint。

# 升级流程
1. Savepoint 备份；
2. `cancel-with-savepoint`；
3. 部署新版本，从 Savepoint 恢复；
4. 验证 job 状态与延迟。

# 自检清单
- 是否开启 Checkpoint 并设置合理超时？
- 是否定期清理过期 Savepoint/Checkpoint 目录？
- 是否对 RocksDB 状态后端进行压缩与内存调优？

# 参考资料
- Flink State & Fault Tolerance：https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/learn-flink/fault_tolerance/
- RocksDB State Backend Tuning：https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/deployment/config/#state-backends
- 阿里云 Flink 最佳实践
