---
title: JVM GC 日志快速入门与分析工具
date: 2017-09-26
tags: ['#JVM', '#GC']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 为什么要收集 GC 日志
GC 日志记录了垃圾回收的触发时间、停顿时长、内存占用与回收结果，是分析应用吞吐与延迟的基础数据。没有 GC 日志，很难定位内存泄漏或停顿指标异常。

# 启用方式
- **JDK 8 及之前**：`-XX:+PrintGCDetails -XX:+PrintGCDateStamps -Xloggc:/path/gc.log`
- **JDK 9+**：统一日志框架 `-Xlog:gc*,safepoint:file=/path/gc.log:time,uptime,level,tags`
- 配合 `-XX:+PrintHeapAtGC`、`-XX:+PrintTenuringDistribution` 获取更详细信息。

# 样例解读
```
2025-09-29T10:15:12.345+0800: 10.123: [GC pause (G1 Evacuation Pause) (young), 0.0123456 secs]
   [Parallel Time: 11.7 ms, GC Workers: 8]
   [Eden: 128M(256M)->0B(256M) Survivors: 32M->32M Heap: 1G(4G)->912M(4G)]
```
- `Pause` 类型：年轻代/混合或 Full GC。
- 耗时：停顿总时间，需对照 SLA。
- 堆占用变化：观察晋升、回收效率。

# 工具链
- **JDK 自带**：`jstat -gcutil <pid> 1s` 实时查看；`jcmd <pid> GC.heap_info`。
- **可视化**：GCViewer、GCEasy、JClarity Censum。
- **JFR**：JDK 11+ 可记录 GC Pause、Allocation 等事件，配合 Mission Control 分析。

# 优化建议
1. **定位高频 GC**：查看日志中 GC 触发间隔，判断是否因分配速率高或堆过小。
2. **关注 Full GC**：频繁 Full GC 说明老年代压力或晋升失败，需要增大堆或优化对象生命周期。
3. **停顿目标**：使用 `-XX:MaxGCPauseMillis`（G1）或 `-XX:PauseTimeInterval`（ZGC）调节回收策略。

# 自检清单
- 是否在测试/生产环境开启 GC 日志并安全保留？
- 是否定期分析日志趋势，形成停顿与吞吐指标基线？
- 是否配合监控告警，在 Full GC 或停顿超阈值时通知？

# 参考资料
- HotSpot GC 日志格式官方文档：https://docs.oracle.com/en/java/javase/17/gctuning/garbage-collector-logging.html
- JDK Unified Logging 介绍：https://openjdk.org/jeps/158
- G1 GC 调优指南：https://docs.oracle.com/en/java/javase/17/gctuning/garbage-first-garbage-collector.html
