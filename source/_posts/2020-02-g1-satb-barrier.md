---
title: G1 SATB 写屏障机制透视
date: 2020-02-12
tags: ['#JVM', '#GC', '#G1']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# SATB 的目的
G1 使用 SATB（Snapshot-At-The-Beginning）算法进行并发标记。为了在应用线程写入对象时保持“标记快照”的一致性，G1 通过写屏障记录即将被覆盖的引用，确保并发标记阶段不会遗漏可达对象。

# 写屏障工作流
1. 应用线程执行引用写操作；
2. 写屏障记录旧引用（pre-write barrier）到 Dirty Card Queue；
3. 后台线程处理队列，将引用放入 Remembered Set；
4. 标记器根据队列补充扫描，保证快照完整。

```c
void G1SATBBarrierSet::write_ref_field_pre(...) {
    oop obj = *field;
    if (obj != NULL) {
        enqueue(obj);
    }
}
```

# 调优要点
- `-XX:+G1TraceEagerReclaimHumongousObjects` 分析屏障对 Humongous 回收的影响；
- `-XX:G1ConcRefinementThreads` 控制后台处理线程数；
- `-XX:+PrintGCDetails` 查看 `Refine` 时间，必要时调高线程数或增大队列；
- 对大量写操作的场景，评估对象布局减少交叉引用。

# 监控指标
- `G1 Conc Refine` 时间；
- Dirty Card Queue 长度（JFR 事件 `G1HeapSummary`）；
- GC 日志中的 `Refinement`、`SATB` 信息；
- 应用写入速率、逃逸分析结果。

# 自检清单
- 是否监控 Dirty Card 队列堆积以避免停顿？
- 是否评估写屏障开销，对热点写操作进行优化？
- 是否合理设置 `G1ConcRefinementThreads` 与 `G1RedirtyCardsBufferSize`？

# 参考资料
- HotSpot G1 Barrier 源码：`g1BarrierSet.cpp`
- G1 GC Tuning Guide：https://docs.oracle.com/en/java/javase/17/gctuning/garbage-first-garbage-collector.html
- Azul 技术博客：Understanding G1 Write Barriers
