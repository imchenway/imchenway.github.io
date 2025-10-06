---
title: Shenandoah GC 概览：并发压缩与实现原理
date: 2018-07-12
lang: zh-CN
tags: ['#JVM', '#GC']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# Shenandoah 简介
Shenandoah 是 Red Hat 贡献的低停顿垃圾回收器，在 OpenJDK 12 成为实验特性。其核心特性是并发压缩，停顿时间与堆大小近乎无关，依赖 Brooks Pointer 与读屏障实现对象移动。

# 工作流程
1. **Initial Mark (STW)**：标记 GC Roots；
2. **Concurrent Mark**：与应用线程并发标记存活对象；
3. **Final Mark (STW)**：修正标记结果；
4. **Concurrent Evacuation**：并发移动对象，使用 Brooks Pointer 更新引用；
5. **Update References (STW)**：短暂停顿，修正少量遗留引用；
6. **Concurrent Cleanup**：回收空 Region。

# 启用与参数
- 启用：`-XX:+UnlockExperimentalVMOptions -XX:+UseShenandoahGC`；
- 配置停顿目标：`-XX:ShenandoahGCHeuristics=aggressive/balanced`；
- `-XX:+UseShenandoahRegionSampling`：查看 Region 统计；
- `-Xlog:gc*,gc+ergo=trace` 分析日志。

# 与 ZGC 对比
| 特点 | Shenandoah | ZGC |
|---|---|---|
| 并发压缩 | 是 | 是 |
| 屏障类型 | Brooks Pointer + 读/写屏障 | 着色指针 + 读屏障 |
| 支持平台 | 早期主要 Linux/x86_64 | JDK 17 起跨平台 |
| 最佳场景 | 大内存、低延迟 | 超大堆、亚毫秒停顿 |

# 调优建议
- 确保足够的空闲 Region，避免触发 Degenerated GC；
- 监控 `ShenandoahPauses`、`ShenandoahCycles` 指标；
- 优化对象分配速率，结合 async-profiler/JFR 分析热点；
- 持续关注 JDK 版本，因为 Shenandoah 在 JDK 15+ 才进入生产状态。

# 自检清单
- 是否评估 Shenandoah 支持的平台与 JDK 版本？
- 是否开启 GC 日志并分析并发周期长度？
- 是否监控 Degenerated/Full GC，避免退化回传统 GC？

# 参考资料
- Shenandoah GC 官方文档：https://wiki.openjdk.org/display/shenandoah/Main
- JEP 189: Shenandoah Garbage Collector (Experiment)：https://openjdk.org/jeps/189
- Red Hat Shenandoah 白皮书：https://developers.redhat.com/blog/2018/04/24/shenandoah-gc
