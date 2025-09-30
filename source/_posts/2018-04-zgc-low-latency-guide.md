---
title: ZGC 低延迟垃圾回收器实践
date: 2018-04-12
tags: ['#JVM', '#GC']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# ZGC 特性
Z Garbage Collector (ZGC) 是 JDK 11 引入的可扩展、低延迟 GC，目标停顿时间低于 10ms，堆大小可达数 TB。它利用着色指针与读屏障实现并发标记与重定位。

# 启用与基础参数
- 启用：`-XX:+UseZGC`；在 JDK 15 之后可生产使用。
- ZGC 需要 Linux x86_64、macOS、Windows (JDK 15+) 等支持。
- 常用参数：
  - `-Xmx/-Xms`：建议设置为相同值。
  - `-XX:ConcGCThreads`：并发 GC 线程数。
  - `-XX:ZUncommitDelay=300s`：未使用内存回收延迟。
  - `-Xlog:gc*`：日志输出。

# 着色指针与重定位
- 对象引用携带标志位（颜色），指示标记状态；
- ZGC 在读屏障中修正指针指向的新地址；
- 并发重定位无需长时间 Stop-The-World。

# 调优重点
1. **堆分配**：保证足够空闲空间，避免频繁重定位；
2. **Page Cache 与 NUMA**：建议启用 Transparent Huge Pages 与 NUMA 感知；
3. **监控指标**：`ZAllocationStall`、`ZCollectionCycle`、`ZHeap`。
4. **日志解析**：`-Xlog:gc*,safepoint` 查看停顿、周期耗时。

# 适用场景
- 延迟敏感应用（交易、广告）；
- 超大堆场景（数百 GB~TB）；
- 与 GraalVM 结合可进一步提升吞吐。

# 自检清单
- 是否评估 ZGC 支持的 JDK 版本与平台？
- 是否设置合适的堆大小与并发线程数？
- 是否收集 ZGC 日志并监控收集周期？

# 参考资料
- ZGC 官方文档：https://docs.oracle.com/en/java/javase/17/gctuning/z-garbage-collector.html
- JEP 333: ZGC (Experimental)：https://openjdk.org/jeps/333
- Azul/ZGC 实战分享：https://hg.openjdk.org/jdk/jdk/file/tip/src/hotspot/share/gc/z
