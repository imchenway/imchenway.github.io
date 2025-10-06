---
title: JVM 类卸载策略与元空间治理
date: 2020-05-12
lang: zh-CN
tags: ['#JVM', '#Metaspace', '#ClassLoader']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 类卸载的重要性
动态类加载（框架增强、脚本执行）若未释放 ClassLoader，会导致元空间持续增长并触发 `OutOfMemoryError: Metaspace`。理解 HotSpot 的类卸载机制可以指导我们设计可回收的 ClassLoader 与元空间监控。

# 卸载条件
- ClassLoader 实例不可达；
- 该 ClassLoader 加载的类没有存活对象引用；
- 满足 GC 周期：Full GC 或并发周期会尝试卸载（G1/Parallel 默认禁用类卸载，需要 `-XX:+CMSClassUnloadingEnabled` 或 `-XX:+ClassUnloadingWithConcurrentMark`）。

# 元空间治理策略
- 使用自定义 ClassLoader 时调用 `close()` 或在 ThreadLocal 中清理引用；
- 对 OSGi/Spring 热部署模块，避免静态缓存 ClassLoader；
- 开启 `-XX:MaxMetaspaceSize` 并监控 `Metaspace` 占用；
- 结合 NMT (`jcmd VM.native_memory detail`) 定期审计。

# 自检清单
- 是否确保使用完的 ClassLoader 没有被静态字段或线程缓存引用？
- 是否启用类卸载日志 `-Xlog:class+unload=debug` 并分析频率？
- 是否设置元空间上限与告警策略？

# 参考资料
- HotSpot Class Unloading 文档：https://wiki.openjdk.org/display/HotSpot/Class+Unloading
- G1 Class Unloading 指南：https://docs.oracle.com/en/java/javase/17/gctuning/garbage-first-garbage-collector.html#GUID-085A53FE-7BBE-4147-9B7D-CE57744FDF28
- Java Performance, 2nd Edition（ClassLoader 章节）
