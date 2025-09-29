---
title: GC 停顿分析实战：定位 Young GC 与 Mixed GC 问题
date: 2018-03-26
tags: ['#JVM', '#GC']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 观察指标
- GC 停顿时间、频率、吞吐比 (`jstat -gcutil`, GC 日志)；
- 老年代占用、GC 后存活比例；
- 新生代晋升失败、To-space exhausted 等警告。

# 年轻代停顿排查
1. 分析 GC 日志 `Pause Young (Normal)` 耗时，关注 Root Scanning 与 Copy 时间；
2. 调整 Eden/Survivor 比例（`-XX:SurvivorRatio`、`-XX:NewRatio`）；
3. 减少短期大量对象分配（缓存池、对象复用）；
4. 检查应用是否开启逃逸分析优化（JIT）。

# 混合 GC 与老年代问题
1. 关注 `Pause Young (Mixed)`、`Concurrent Cycle` 阶段；
2. Humongous 对象导致回收效率低，可优化数据结构或调大 `G1HeapRegionSize`；
3. 调整 `-XX:InitiatingHeapOccupancyPercent`、`-XX:G1MixedGCLiveThresholdPercent` 控制并发周期；
4. 读取 `-Xlog:gc+ergo=trace` 日志了解 G1 策略决策。

# 工具链
- GCViewer、GCEasy 可视化停顿分布；
- JFR 事件 `Garbage Collection`、`Allocation` 分析分配热点；
- `jcmd <pid> GC.heap_info`、`VM.native_memory summary` 补充堆信息。

# 案例流程
1. 收集 GC 日志与 JFR；
2. 找到停顿高峰对应时间段；
3. 根据对象分配热点评估是否需要缓存、池化；
4. 调整 G1 参数并压测验证；
5. 形成文档记录，为下一次回溯提供资料。

# 自检清单
- 是否掌握 GC 日志字段含义并对照 KPI？
- 是否区分年轻代停顿与混合 GC 引起的问题？
- 是否结合 JFR/Profiling 找到分配热点？

# 参考资料
- G1 GC 调优指南：https://docs.oracle.com/en/java/javase/17/gctuning/garbage-first-garbage-collector.html
- GCViewer 项目：https://github.com/chewiebug/GCViewer
- Java Flight Recorder Documentation：https://docs.oracle.com/javacomponents/jmc-8/jfr-runtime-guide/jfr-runtime-guide.pdf
