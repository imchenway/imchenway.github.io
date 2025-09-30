---
title: JVM 垃圾回收器全景速览与选择指南
date: 2017-09-12
tags: ['#JVM', '#GC']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 分代收集基础
HotSpot 将堆分为年轻代与老年代：新生对象大多在 Eden 分配，通过 Minor GC 回收；长期存活或大对象晋升老年代。分代假设“绝大部分对象朝生暮死”，可降低全堆扫描成本。

# 主流垃圾回收器
| 回收器 | 代际 | 特点 | 适用场景 |
|---|---|---|---|
| Serial | 新生代/老年代 | 单线程 Stop-The-World，简单可靠 | Client 模式、小堆内存 |
| Parallel Scavenge/Old | 新生代/老年代 | 吞吐优先，控制 GC 比例 | 批处理、后台任务 |
| CMS | 老年代 | 并发标记清除，降低停顿 | 延迟敏感但容忍浮动垃圾 |
| G1 | 全堆 | 基于 Region，预测停顿时间 | 大堆、延迟敏感的服务端应用 |
| ZGC | 全堆 | 并发标记整理，低停顿 | 需要亚毫秒停顿的大堆服务 |
| Shenandoah | 全堆 | 并发压缩，停顿与堆大小无关 | 低延迟，自 JDK 11 开始提供 |

# 调优思路
1. **明确目标**：吞吐最大化 vs 秒级以下延迟；不同目标选择不同回收器。
2. **堆大小规划**：使用 `-Xmx/-Xms` 固定堆，避免动态伸缩；监控老年代占比。
3. **对象分配**：避免大对象直接晋升，可通过压缩数据结构或复用缓冲区。
4. **日志与指标**：开启 `-Xlog:gc*`（JDK 9+）或 `-XX:+PrintGCDetails`（JDK 8），采集停顿时间、吞吐率。

# 迁移建议
- 从 Parallel/ CMS 迁移到 G1：先以默认参数运行，利用 `-XX:MaxGCPauseMillis` 指定目标停顿。
- 评估 ZGC/Shenandoah：需 JDK 11+ 并考虑硬件 NUMA、内核版本。

# 自检清单
- 是否有明确的 GC 目标指标（停顿/吞吐/堆使用率）？
- 是否收集了 GC 日志并结合 `jstat`、JFR 进行分析？
- 是否评估应用对象生命周期，减少不必要的短命对象？

# 参考资料
- Java HotSpot VM 垃圾回收调优指南：https://docs.oracle.com/en/java/javase/17/gctuning/
- HotSpot GC 日志官方说明（JEP 271 Unified Logging）：https://openjdk.org/jeps/271
- ZGC 官方介绍：https://docs.oracle.com/en/java/javase/17/gctuning/z-garbage-collector.html
