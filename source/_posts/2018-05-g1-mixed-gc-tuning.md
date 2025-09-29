---
title: 调优 G1 混合 GC：Region 策略与回收效率
date: 2018-05-12
tags: ['#JVM', '#GC']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 混合 GC 概述
Mixed GC 在并发标记完成后，G1 会同时回收年轻代与部分老年代 Region。回收效率取决于 Region 选择策略、存活率与堆布局。

# 关键参数
- `-XX:InitiatingHeapOccupancyPercent`：触发并发标记的堆占比。
- `-XX:G1MixedGCLiveThresholdPercent`：老年代 Region 存活率阈值，超过则不参与混合回收。
- `-XX:G1HeapWastePercent`：允许的堆碎片比例。
- `-XX:G1OldCSetRegionThresholdPercent`：每次混合 GC 选择的老年代 Region 数量上限。
- `-XX:G1MixedGCCountTarget`：完成一次并发标记后期望的混合 GC 次数。

# 调优流程
1. **收集数据**：开启 `-Xlog:gc*,gc+ergo=trace`，观察混合 GC 日志。
2. **分析存活率**：查看 `Desired survivor`、`Live` 数据，确定老年代 Region 是否适合回收。
3. **调整阈值**：降低 `G1MixedGCLiveThresholdPercent` 或增大 `G1OldCSetRegionThresholdPercent`，提升回收力度。
4. **控制次数**：通过 `G1MixedGCCountTarget` 防止过多混合 GC 消耗吞吐。
5. **大对象优化**：避免大量 Humongous 对象，必要时调大 Region 尺寸。

# 工具与监控
- GCViewer/GCEasy 分析混合 GC 停顿与回收比；
- JFR 事件 `Garbage Collection` 中的 `Mixed GC` 指标；
- `jcmd <pid> GC.heap_info` 查看堆 Region 分布。

# 自检清单
- 是否评估混合 GC 的回收收益与停顿时长？
- 是否避免过度回收导致吞吐下降？
- 是否结合堆 dump 评估老年代对象构成？

# 参考资料
- G1 Mixed GC 官方说明：https://docs.oracle.com/en/java/javase/17/gctuning/garbage-first-garbage-collector.html#GUID-ACD0E521-8C2F-4F3C-9739-18D3F013E4D3
- GC 日志分析工具 GCViewer：https://github.com/chewiebug/GCViewer
- JFR Garbage Collection 事件文档：https://docs.oracle.com/javacomponents/jmc-8/jfr-runtime-guide/jfr-runtime-guide.pdf
