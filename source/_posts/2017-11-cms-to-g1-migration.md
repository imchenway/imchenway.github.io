---
title: 从 CMS 迁移到 G1 的步骤与监控指标
date: 2017-11-12
tags: ['#JVM', '#GC']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 为什么迁移
CMS 在高并发、大堆环境下容易出现浮动垃圾与 Concurrent Mode Failure。JDK 9 以后 CMS 已被标记为过时，G1 作为默认回收器提供可配置停顿目标与全堆分区管理，更适合延迟敏感服务。

# 迁移步骤
1. **升级 JDK**：建议至少 JDK 11，获取 G1 最新优化。
2. **基础配置**：移除 CMS 参数，使用 `-XX:+UseG1GC`；保留常用堆参数（`-Xms/-Xmx`）。
3. **停顿目标**：`-XX:MaxGCPauseMillis=200`（示例），根据 SLA 调整。
4. **并发线程**：G1 自动配置 GC 线程，可通过 `-XX:ParallelGCThreads`、`-XX:ConcGCThreads` 微调。
5. **晋升阈值**：观察 `Humongous` 对象比例，必要时优化对象大小或使用 `-XX:G1HeapRegionSize`。

# 监控指标
- **GC 停顿时间**：从 GC 日志或 JFR 中获取 `Pause Young (Normal)`、`Pause Mixed` 的耗时。
- **堆使用**：关注 Eden/Survivor/Old 区域占比，避免 Old 区持续增长。
- **晋升失败/混合 GC 比例**：`-Xlog:gc+ergo=trace` 观察混合回收策略。

# 问题排查
- **Humongous Allocation**：大对象跨越多个 Region，必要时分片或序列化。
- **并发周期过长**：检查后台任务与 I/O 开销，适当降低 `InitiatingHeapOccupancyPercent`。
- **频繁 Full GC**：可能由元空间或 System.gc() 导致，需要进一步定位。

# 自检清单
- 是否记录迁移前后的停顿、吞吐、堆占用指标？
- 是否分析 G1 日志，确认混合 GC 与并发周期健康？
- 是否在压测环境验证配置，再逐步推广至生产？

# 参考资料
- G1 官方调优指南：https://docs.oracle.com/en/java/javase/17/gctuning/garbage-first-garbage-collector.html
- JEP 248: Make G1 the Default Garbage Collector：https://openjdk.org/jeps/248
- HotSpot GC Tuning 文档中的 G1 参数说明：https://docs.oracle.com/en/java/javase/17/gctuning/tuning-garbage-first-garbage-collector.html
