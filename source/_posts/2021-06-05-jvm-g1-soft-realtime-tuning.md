---
title: JVM G1 软实时调优案例
date: 2021-06-05
lang: zh-CN
tags: ['#JVM', '#G1GC', '#Performance']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 背景
对订单撮合类应用，需要将 99% 延迟控制在 100ms 内，同时避免 Full GC 造成的突发停顿。

# 调优步骤
- 设置 `-XX:MaxGCPauseMillis=80` 并监控 G1 调度器的自适应反馈；
- 使用 `-XX:+UseStringDeduplication` 与 Region 压缩，降低 Old 区压力；
- 调整 `-XX:InitiatingHeapOccupancyPercent` 触发并发标记提前启动；
- 开启 `-XX:+G1SummarizeConcMark` 分析混合回收阶段耗时。

# 观测指标
- 采集 `gc_pause_seconds`, `young/mixed` 比例与记忆集大小；
- 借助 JFR GC 配置事件，观察 SATB Buffer 占用；
- 结合压测工具记录 TPS 与尾延迟的变化趋势。

# 自检清单
- 是否确认 GC 配置与容器内存限制一致？
- 是否验证 STW 时长与业务 SLA 匹配？
- 是否在回归环境复现调优效果并保留报告？

# 参考资料
- Oracle G1 GC 官方文档：https://docs.oracle.com/javase/8/docs/technotes/guides/vm/gctuning/g1_gc.html
- OpenJDK HotSpot GC 调优说明：https://openjdk.org/groups/hotspot/docs/HotSpotGCTuning.html
- JFR 官方指南：https://docs.oracle.com/javacomponents/jmc-5-5/jfr-runtime-guide.pdf
