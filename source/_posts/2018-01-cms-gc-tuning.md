---
title: CMS 垃圾回收器调优手册
date: 2018-01-12
tags: ['#JVM', '#GC']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# CMS 简介
Concurrent Mark Sweep (CMS) 针对老年代回收，目标是缩短停顿时间。它通过并发标记与并发清除阶段减少 Stop-The-World，但会产生浮动垃圾并带来内存碎片。虽然在 JDK 9 起被标记为过时，历史项目仍大量使用。

# CMS 周期
1. **Initial Mark (STW)**：标记 GC Roots 可达对象，停顿短。
2. **Concurrent Mark**：与应用线程并发执行。
3. **Remark (STW)**：修正并发阶段遗漏，停顿较长。
4. **Concurrent Sweep**：回收可回收对象，产生碎片。
5. **Concurrent Reset**：重置数据结构。

# 关键参数
- `-XX:+UseConcMarkSweepGC`：启用 CMS。
- `-XX:CMSInitiatingOccupancyFraction=70`：老年代占用到 70% 触发回收（配合 `-XX:+UseCMSInitiatingOccupancyOnly`）。
- `-XX:+ExplicitGCInvokesConcurrent`：`System.gc()` 转为并发回收。
- `-XX:+CMSScavengeBeforeRemark`：在 Remark 前触发一次年轻代 GC，减少工作量。
- `-XX:ParallelCMSThreads`：并发标记线程数。
- `-XX:+CMSClassUnloadingEnabled`：允许卸载类元数据。

# 调优建议
1. **提升并发阶段效率**：调整 `ParallelCMSThreads`，避免 Remark 停顿过长。
2. **处理碎片**：启用 `-XX:+UseCMSCompactAtFullCollection` 与 `-XX:CMSFullGCsBeforeCompaction`，定期压缩。
3. **避免 Concurrent Mode Failure**：增大堆、降低触发阈值、优化对象生命周期。
4. **监控浮动垃圾**：通过 GC 日志观察 `promotion failed`、`concurrent mode failure` 等信息。

# 迁移策略
- 在 JDK 11+ 环境可评估切换 G1/ZGC；
- 保留 CMS 的系统需加强监控、预案，并评估长期维护成本。

# 自检清单
- 是否根据老年代占用触发回收，避免过晚导致失败？
- 是否启用类卸载、防止元空间增长？
- 是否记录 GC 日志并分析停顿时间与失败率？

# 参考资料
- CMS Garbage Collector 调优指南：https://docs.oracle.com/javase/8/docs/technotes/guides/vm/gctuning/cms.html
- JEP 291: Deprecate the Concurrent Mark Sweep (CMS) Collector：https://openjdk.org/jeps/291
- HotSpot GC 选项说明：https://docs.oracle.com/javase/8/docs/technotes/tools/unix/java.html#BABHDABI
