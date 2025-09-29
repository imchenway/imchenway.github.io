---
title: G1 垃圾回收参数深度解析
date: 2017-12-12
tags: ['#JVM', '#GC']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# Region 与堆结构
G1 将堆划分为大小均等的 Region（1~32MB）。新生代与老年代不再物理分离，而是逻辑映射在多个 Region 上。G1 根据 Region 预测回收收益，按需进行年轻代或混合回收。

# 关键参数
- `-XX:MaxGCPauseMillis`：目标停顿时间（默认 200ms）。值越小，吞吐越低。
- `-XX:G1HeapRegionSize`：Region 大小，1MB~32MB，可根据堆大小自动调整。
- `-XX:InitiatingHeapOccupancyPercent`：达到该占比后触发并发标记周期（默认 45%）。
- `-XX:G1MixedGCLiveThresholdPercent`：混合 GC 回收的老年代 Region 的存活率阈值。
- `-XX:G1OldCSetRegionThresholdPercent`：混合 GC 每次回收的老年代 Region 数量上限。
- `-XX:ConcGCThreads`、`-XX:ParallelGCThreads`：并发与并行 GC 线程数。
- `-XX:+UseStringDeduplication`：启用字符串去重，减少重复 `char[]`。

# 日志监控
- `-Xlog:gc*`（JDK 9+）输出 `Pause Young (Normal)`、`Pause Mixed`、`Concurrent Mark` 等事件；
- 关注 `To-space exhaustion`、`Humongous allocation` 警告；
- `-Xlog:gc+heap=info` 追踪区域分配与回收。

# 调优建议
1. **设定停顿目标**：从 200ms 起步，逐步微调；结合 SLA 与监控指标评估。
2. **堆布局**：增大堆可降低混合 GC 频率，平衡内存成本与延迟。
3. **大对象处理**：避免频繁产生超出 Region 大小的巨大对象；必要时调整 `G1HeapRegionSize`。
4. **String Dedup**：在日志中观察 `GC String Deduplication` 统计，评估收益。

# 自检清单
- 是否分析 GC 日志并调整合适的停顿目标？
- 是否监控混合 GC 的周期与老年代回收效率？
- 是否对大对象、字符串重复等问题进行了优化？

# 参考资料
- G1 调优指南：https://docs.oracle.com/en/java/javase/17/gctuning/garbage-first-garbage-collector.html
- JEP 307 Parallel Full GC for G1：https://openjdk.org/jeps/307
- Unified GC Logging 手册：https://docs.oracle.com/en/java/javase/17/gctuning/garbage-collector-logging.html
