---
title: JVM Stop-The-World延迟排查案例
date: 2022-01-15
lang: zh-CN
tags: ['#JVM']
---

### 本文目录
<!-- toc -->

# 引言
> Stop-The-World (STW) 暂停会中断所有 Java 线程，对实时系统影响巨大。本文以真实案例展示如何定位 STW 延迟并优化。

# STW 的触发场景
- GC 暂停（Young、Remark、Cleanup、Full）
- 类加载、偏向锁撤销、安全点操作
- `jstack`、`jmap` 等诊断操作
- 代码中调用 `System.gc()`

# 案例：支付系统延迟波动
## 现象
- 交易延迟偶发 200ms 峰值；
- 观察 `gc.log`，发现 `Pause Remark` 约 180ms。

## 分析
- `-Xlog:gc*` 显示 `Mixed GC` 频繁；
- JFR 显示 `ThreadPark` 与 `GC Pause` 时间重叠；
- `jcmd Thread.print` 在暂停时阻塞。

## 解决
- 调整 G1：`-XX:InitiatingHeapOccupancyPercent=35`，提前标记；
- 增加 `-XX:G1NewSizePercent`；
- 使用 `-XX:+UnlockExperimentalVMOptions -XX:G1MixedGCCountTarget=8` 平滑混合 GC；
- 结果：Pause Remark 降到 40ms。

# 案例：CMS concurrent mode failure
- `gc.log` 出现 `concurrent mode failure`；
- 原因：老年代空间不足，Full GC 停顿 800ms；
- 方案：提高堆大小或迁移 G1；
- 同时优化对象分配，减少大对象。

# 监控策略
- Prometheus 采集 `jvm_gc_pause_seconds`；
- 99.9 分位或最大暂停超阈值警报；
- 引入 `GC Safepoint` QoS 指标。

# 总结
STW 排查需要结合 GC 日志、JFR、线程 dump 等数据，逐层分析暂停来源。通过调整 GC 参数、优化对象分配、升级 GC 算法，可以将暂停控制在可接受范围内。

# 参考资料
- [1] G1 GC Tuning Guide. https://docs.oracle.com/javase/8/docs/technotes/guides/vm/gctuning/g1_gc_tuning.html
- [2] Oracle, "Java Mission Control" Guide. https://docs.oracle.com/javacomponents/jmc/
- [3] Netflix Tech Blog, "Reducing GC pauses" 系列文章.
