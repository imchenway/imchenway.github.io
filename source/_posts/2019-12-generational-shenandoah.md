---
title: Generational Shenandoah：低延迟回收器的代际演进
date: 2019-12-12
tags: ['#JVM', '#GC', '#Shenandoah']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 背景
Shenandoah 初版为单代回收，JDK 21 引入代际 Shenandoah（JEP 404）以提升吞吐。通过将堆分为年轻代和老年代，减少全堆并发标记成本。

# 特性
- 新生代采用并发复制；
- 老年代继续使用并发标记 + 压缩；
- 支持动态晋升、Remembered Set；
- 与 ZGC 相比仍保留 Brookes Pointer 机制。

# 启用与参数
- `-XX:+UseShenandoahGC -XX:+UnlockExperimentalVMOptions -XX:+UseShenandoahGC`（JDK 21 及以上）；
- `-XX:+UnlockExperimentalVMOptions -XX:+UseShenandoahGC -XX:ShenandoahGCMode=generational`；
- 调整 `-XX:ShenandoahGenerationalGCInterval` 控制代际周期。

# 监控指标
- `ShenandoahGenerationalCycles`；
- 新生代停顿 `Pause Young`；
- 老年代并发时间 `Concurrent Mark`；
- Humongous Region 使用率。

# 调优建议
- 适合中大型堆并希望兼顾吞吐与延迟；
- 配合 `-Xlog:gc*,gc+heap=info` 分析代际占比；
- 关注 `Degenerated GC`，优化对象分配速率；
- 根据业务场景选择 G1/ZGC/Shenandoah 的取舍。

# 自检清单
- 是否使用支持代际 Shenandoah 的 JDK 版本？
- 是否评估与单代 Shenandoah 或 ZGC 的指标差异？
- 是否在监控平台上新增相关指标与告警？

# 参考资料
- JEP 404: Generational Shenandoah：https://openjdk.org/jeps/404
- Red Hat 博客：Generational Shenandoah 深度解析
- HotSpot GC Tuning 指南：https://docs.oracle.com/en/java/javase/17/gctuning/
