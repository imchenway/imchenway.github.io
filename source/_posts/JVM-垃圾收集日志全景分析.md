---
title: JVM垃圾收集日志全景分析
date: 2021-11-16
lang: zh-CN
tags: ['#JVM']
---

### 本文目录
<!-- toc -->

# 引言
> GC 日志是定位内存问题的核心数据来源。从 JDK 9 的 Unified Logging 到 JDK 17 的事件日志体系，我们可以通过统一语法捕捉 GC 周期、暂停、堆使用趋势。

# GC 日志配置
- `-Xlog:gc*,safepoint:file=gc.log:time,uptimemillis`（JDK 9+）；
- `-XX:+PrintGCDetails -XX:+PrintGCDateStamps`（JDK 8）；
- `-XX:+PrintTenuringDistribution` 查看对象年龄；
- `-XX:+PrintAdaptiveSizePolicy` 分析 G1 调整策略。

# 关键字段解读
- **Pause Young**、**Pause Remark**、**Pause Cleanup**：G1 的阶段；
- **Concurrent Mark**、**Concurrent Cycle**：并发阶段；
- **Eden/Survivor/Old** 区域容量变化；
- **Humongous allocations**：大对象分配；
- **Metaspace**：类元数据使用；
- **User/Sys/Real**：时间分布。

# 分析工具
- GCViewer：支持 CMS、G1、Parallel；
- GCeasy：可视化报告，提供推荐；
- `jfr print --events gc*`：解析 JFR 中的 GC 事件；
- Elastic Stack：收集 GC 日志，做趋势分析。

# 实战案例
1. **G1 Humongous 疾增**：日志显示 `Humongous Reclaim` 占比高，定位为图片缓存的 ByteBuffer 未及时释放。改用分片存储；
2. **并发模式失败**：CMS 日志出现 `concurrent mode failure`，说明老年代不足，需调大 `-XX:CMSInitiatingOccupancyFraction` 或升级 G1；
3. **ZGC 周期过频**：日志中 `Pause Mark Start` 间隔过短，调整 `-XX:ZCollectionInterval`；
4. **容器溢出**：通过日志发现 Full GC 后堆回落到 0.9X，说明堆设置过小，调整 `MaxRAMPercentage`。

# 自动化与告警
- 使用 Logstash/Fluentd 解析 GC 日志指标；
- 配置 Prometheus exporter 将 pause time、GC 频率暴露；
- 设定告警：Full GC 次数、Pause P99 超阈值；
- 在发布流程中运行固定负载，比较 GC 指标基线。

# 总结
GC 日志是透明化 Java 内存行为的窗口。通过统一日志配置、分析工具与自动化告警，我们可以快速定位问题并持续优化内存表现。

# 参考资料
- [1] JEP 271: Unified Logging. https://openjdk.org/jeps/271
- [2] G1 GC Tuning Guide. https://docs.oracle.com/javase/8/docs/technotes/guides/vm/gctuning/g1_gc_tuning.html
- [3] GCeasy 文档. https://gceasy.io
- [4] Netflix, "Garbage Collection Monitoring at Scale" 经验分享.
