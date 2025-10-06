---
title: ZGC与Shenandoah延迟对比
date: 2021-08-18
lang: zh-CN
tags: ['#JVM']
---

### 本文目录
<!-- toc -->

# 引言
> ZGC 与 Shenandoah 均以极低的暂停时间为目标，但它们在指针压缩、并发阶段设计和内存布局上存在差异。理解两者的权衡，有助于我们在低延迟场景（如在线交易、广告投放）中做出正确的 GC 选择。

# GC 设计理念对比
## ZGC：Region 化 + 染色指针
- 将堆划分为固定大小的 Region（2MB~16GB），支持动态缩放；
- 通过带三位标记位的指针实现读屏障，允许并发转发；
- 所有 GC 阶段（标记、重定位、重映射）几乎全并发，暂停时间与堆大小无关；
- 需要 64 位平台，要求 `UseCompressedOops` 部分受限。[1]

## Shenandoah：Brooks Pointer + 并发压缩
- 采用 Brooks Pointer（转发表）实现并发移动；
- 依赖读/写屏障减少停顿；
- 支持多线程并发标记与压缩，默认使用 SATB + Brooks；
- 区域化堆，可与 G1 共存于同一代码库；
- 在 JDK 17 起成为正式特性。[2]

# 停顿特性与吞吐对比
| 指标 | ZGC | Shenandoah |
| --- | --- | --- |
| 目标暂停 | < 1ms | < 10ms |
| GC 周期结构 | Mark → Relocate → Remap（全并发） | Mark → Evacuation → Update refs |
| 指针机制 | 染色指针（Colored Pointers） | Brooks Pointer |
| 支持平台 | x86_64, ARM64, S390 | x86_64, AArch64 |
| 压缩开销 | 需要额外指针元数据 | Brooks 指针增加对象头 |

ZGC 对暂停时间控制更激进，但吞吐会受大量读屏障影响；Shenandoah 在吞吐上表现接近 G1，适合低延迟与吞吐平衡的场景。

# 选择策略
1. **超低延迟**：处理几十毫秒内必须响应的交易系统，ZGC 的 <1ms 暂停更稳；
2. **大堆场景**：ZGC 支持最大 16TB 堆，Shenandoah 默认 4TB；
3. **成本考量**：Shenandoah 在 OpenJDK 社区维护，迁移成本较低；
4. **观测能力**：两者均可通过 `jcmd GC.heap_info`、`-Xlog:gc*` 监控，但 ZGC 的日志结构更清晰。

# 调优建议
- ZGC：设置 `-XX:ZCollectionInterval=2` 控制周期；合理配置 `-XX:ZUncommitDelay`; 关注 `ZStatisticsCounter` 指标；
- Shenandoah：结合 `-XX:ShenandoahGCHeuristics=aggressive` 应对吞吐；使用 `-XX:+ShenandoahUnloadClasses` 释放类加载器；
- 统一开启 `-XX:+UnlockDiagnosticVMOptions -XX:+LogEvents` 获取事件流；
- 与容器资源限制结合，确保 `MaxRAMPercentage` 与 `ShenandoahMinFreeThreshold` 等参数匹配。

# 生产实战案例
- 在在线广告竞价系统中，从 G1 迁移到 ZGC 后，99.9 分位暂停时间从 35ms 降至 2.5ms，但 CPU 利用率提高 8%。需要配合 `perf` 观察屏障带来的额外开销。
- 某互联网支付公司在 JDK 17 使用 Shenandoah，发现长时间的并发标记阶段会与应用线程争抢 CPU，通过 `taskset` 绑定 GC 线程至独立核心后改善。

# 总结
ZGC、Shenandoah 虽然目标相同，但实现路径不同。选型时应结合延迟指标、硬件平台与生态支持情况，评估对吞吐的影响，再配合监控优化策略持续验证。

# 参考资料
- [1] JEP 333: ZGC. https://openjdk.org/jeps/333
- [2] JEP 379: Shenandoah. https://openjdk.org/jeps/379
- [3] Oracle, "Z Garbage Collector". https://docs.oracle.com/en/java/javase/17/gctuning/z-garbage-collector.html
- [4] Red Hat, "Shenandoah GC Handbook". https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/
