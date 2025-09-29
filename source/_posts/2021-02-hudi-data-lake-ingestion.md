---
title: Apache Hudi 数据湖增量摄取实践
date: 2021-02-12
tags: ['#Hudi', '#DataLake', '#Streaming']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 增量数据湖需求
Hudi 提供 COW/MOR 两种存储模式，支持 Upsert、时间旅行，适合构建实时数据湖。实践中需要关注写入吞吐、查询延迟、元数据管理。

# 摄取流程
- 使用 Spark Streaming/Flink 写入 `HudiStreamer`；
- 设置 `hoodie.datasource.write.operation=upsert`；
- 配置 `hoodie.cleaner.policy` 保持历史版本；
- 结合 Kafka/Flink CDC 实现增量同步。

# 查询优化
- Presto/Trino 读取 MOR 时启用实时视图；
- 使用列裁剪与分区修剪；
- 定期 Compaction 与 Clustering 提升性能。

# 自检清单
- 是否监控 Hudi Timeline 与 Cleaner 任务状态？
- 是否根据查询模式选择 COW/MOR？
- 是否在湖仓层面做好数据治理（Schema Evolution、PK 约束）？

# 参考资料
- Apache Hudi 官方文档：https://hudi.apache.org/docs/
- Hudi on Flink 指南：https://hudi.apache.org/docs/flink-quick-start-guide
- Uber Hudi 实践分享
