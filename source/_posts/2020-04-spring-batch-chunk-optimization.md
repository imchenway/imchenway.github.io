---
title: Spring Batch Chunk 模式性能优化实战
date: 2020-04-19
tags: ['#Spring', '#Batch', '#Performance']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# Chunk 模式回顾
Spring Batch 的 Chunk 模式通过 `ItemReader`、`ItemProcessor`、`ItemWriter` 组合批处理任务。Chunk 大小、事务边界、并发配置直接影响吞吐与失败恢复能力。

# 性能优化要点
- **合理的 chunkSize**：
  - IO 密集型任务：20~100；
  - CPU 密集型任务：5~20；
  - 通过 JMeter/自定义压测寻找 Sweet Spot。
- **事务策略**：使用 `ResourcelessTransactionManager` 在无需数据库事务时降低开销；
- **分页读取**：对数据库 Reader 使用 `PagingItemReader` 或 `JdbcCursorItemReader`，并开启流式读取；
- **并行处理**：
  - `TaskExecutor` + `SimpleAsyncTaskExecutor` 实现多线程 Step；
  - `Partitioner` 将大任务拆分多个 Step 并行执行。
- **容错重试**：配置 `retryLimit`、`skipLimit`，结合死信队列处理失败记录。

# 监控与调试
- 利用 Spring Batch Actuator (`/actuator/batch`) 获取 Step 状态；
- Micrometer 指标 `spring.batch.job`、`spring.batch.step`；
- 通过 JFR/Async-profiler 分析 Processor 热点。

# 自检清单
- 是否为 Chunk 的 Reader/Writer 使用流式实现避免一次性加载？
- 是否根据失败场景设置重试/跳过策略并记录？
- 是否在生产中监控 Step 执行时间与吞吐趋势？

# 参考资料
- Spring Batch 官方文档：https://docs.spring.io/spring-batch/docs/current/reference/html/
- Spring Batch Actuator 指南：https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#actuator.endpoints.batch
- Micrometer 指标说明：https://docs.micrometer.io/micrometer/reference/index.html
