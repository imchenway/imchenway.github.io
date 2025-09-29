---
title: G1 年轻代与混合回收预测模型
date: 2021-01-12
tags: ['#JVM', '#GC', '#G1']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 为什么需要回收预测
G1 通过停顿预测模型决定每次回收的 Region 数量。理解预测参数有助于优化 `MaxGCPauseMillis`、混合回收次数，从而减少停顿并维持吞吐。

# 控制参数
- `-XX:MaxGCPauseMillis`：目标停顿；
- `-XX:G1HeapRegionSize`：Region 大小；
- `-XX:G1MixedGCCountTarget`：并发周期后混合回收次数；
- `-XX:G1NewSizePercent`、`-XX:G1MaxNewSizePercent`：控制年轻代比例。

# 监控方式
- GC 日志字段 `Predicted pause time`, `Eden regions`, `Mixed pause`; 
- JFR 事件 `GarbageCollection`, `G1HeapSummary`; 
- Prometheus Exporter 统计 `jvm_gc_pause_seconds`。

# 调优步骤
1. 收集 GC 日志并在 GCViewer 绘制停顿曲线；
2. 若预测偏差大，调整 Region 大小或混合次数；
3. 对短命对象占比高的应用增大年轻代；
4. 对 Humongous 对象特多的应用调大 Region 或优化数据结构。

# 自检清单
- 是否记录预测值与实际停顿的差距？
- 是否在改动后运行压力测试验证停顿目标？
- 是否监控混合 GC 的回收收益与堆碎片？

# 参考资料
- G1 GC 调优指南：https://docs.oracle.com/en/java/javase/17/gctuning/garbage-first-garbage-collector.html
- GCViewer：https://github.com/chewiebug/GCViewer
- Netflix G1 GC 调优案例
