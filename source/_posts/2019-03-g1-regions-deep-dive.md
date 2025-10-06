---
title: G1 Region 内部机制深度解析
date: 2019-03-12
lang: zh-CN
tags: ['#JVM', '#GC']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# Region 概念回顾
G1 将堆划分为大小均等的 Region（1~32MB）。Region 类型可动态变化（Eden、Survivor、Old、Humongous）。理解 Region 内部结构有助于调优回收效率。

# Region 内部布局
- TLAB 与 Allocation Buffer：对象分配自 TLAB，TLAB 新生代在 Eden Region；
- Remembered Sets：记录跨 Region 引用，用于避免全堆扫描；
- Card Table：每个 Region 对应 Card 区块，改变时加入 RSet。

# Humongous 对象
- 超过 Region 大小一半的对象直接占用一个或多个 Region；
- 通过 Humongous List 管理；
- 调优：减少大对象、使用分片或序列化优化，调大 `-XX:G1HeapRegionSize`。

# RSet 与降噪
- RSet 可能成为性能瓶颈（大量写操作）；
- `-XX:G1RSetUpdatingPauseTimePercent` 控制更新时间；
- `-XX:+G1SummarizeRSetStats` 输出统计；
- 写屏障将 card 标记加入 Dirty Card Queue，后台线程处理。

# 分析工具
- `jcmd <pid> GC.heap_dump` + MAT 查看老年代分布；
- `-Xlog:gc+heap=info` 输出 Region 状态；
- `G1HeapRegions` JFR 事件分析 Region 活跃度。

# 自检清单
- 是否监控 Humongous Region 占比？
- 是否关注 RSet 更新时间与 Dirty Card Queue 深度？
- 是否评估 Region 大小与对象分布的匹配度？

# 参考资料
- G1 GC Implementation Guide：https://docs.oracle.com/en/java/javase/17/gctuning/garbage-first-garbage-collector.html
- HotSpot 源码 `g1HeapRegion.hpp`、`g1RemSet.cpp`
- JEP 307: Parallel Full GC for G1：https://openjdk.org/jeps/307
