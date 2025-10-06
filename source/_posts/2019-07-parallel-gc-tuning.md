---
title: Parallel GC 调优与吞吐型服务实践
date: 2019-07-12
lang: zh-CN
tags: ['#JVM', '#GC']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# Parallel GC 简述
Parallel GC（Throughput Collector）是 HotSpot 默认的吞吐型垃圾回收器（JDK 8 之前）。通过多线程并行执行 Minor/Full GC，适合批处理、后台任务、延迟不敏感场景。

# 关键参数
- `-XX:+UseParallelGC`：启用；
- `-XX:ParallelGCThreads`：GC 工作线程数，默认与 CPU 核数相关；
- `-XX:MaxGCPauseMillis`：软目标停顿时间，影响新生代大小；
- `-XX:GCTimeRatio`：吞吐目标；
- `-XX:ParallelOldGCThread`：老年代线程数（JDK 8u40+）。

# 调优步骤
1. **收集基线**：启用 `-Xlog:gc*`（JDK 9+）或 `-XX:+PrintGCDetails`（JDK 8）；
2. **调整新生代**：增大新生代降低 Minor GC 次数，但需要足够晋升空间；
3. **吞吐 vs 停顿**：调整 `GCTimeRatio` 或 `MaxGCPauseMillis` 平衡；
4. **对象寿命分析**：通过 JFR/Profiler 评估分配速率；
5. **老年代碎片**：必要时启用 Full GC 压缩，或升级至 G1/ZGC。

# 容器与批处理场景
- 批处理任务：可将 `GCTimeRatio` 设置较低（如 4），追求吞吐；
- 容器：确保 `MaxRAMPercentage`、`InitialRAMPercentage`；
- Observability：记录 `jvm_gc_pause_seconds_sum` 与 `process_cpu_usage`。

# 自检清单
- 是否评估服务对延迟的容忍度，确认 Parallel GC 合适？
- 是否根据 CPU 核数设置 `ParallelGCThreads`？
- 是否结合 GC 日志与业务指标验证效果？

# 参考资料
- Parallel Collector 官方指南：https://docs.oracle.com/en/java/javase/17/gctuning/parallel-collector1.html
- Java Performance, 2nd Edition（GC 章节）
- GCViewer 项目：https://github.com/chewiebug/GCViewer
