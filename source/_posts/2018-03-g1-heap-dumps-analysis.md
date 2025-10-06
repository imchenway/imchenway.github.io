---
title: 使用 heap dump 分析 G1 堆内存问题
date: 2018-03-12
lang: zh-CN
tags: ['#JVM', '#GC']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 何时需要堆 dump
当出现内存泄漏、GC 频繁或 OOM 时，通过堆 dump 分析对象分布、引用关系、类加载器状态。G1 因 Region 划分复杂，更需要可视化工具理解堆布局。

# 获取方式
- **命令行**：`jmap -dump:live,format=b,file=heap.hprof <pid>`（live 仅保留存活对象）。
- **JFR + Heap Dump**：在 JDK 11+ 使用 `jcmd <pid> JFR.start`, 事件捕获后 `JFR.dump` 包含内存快照。
- **OOM Hook**：`-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/path`。

# 分析工具
- **Eclipse MAT**：查找 Dominator Tree、Leak Suspects；
- **VisualVM**：快速查看对象、类、GC 信息；
- **JDK Mission Control**：与 JFR 结合分析。

# G1 特定关注点
- 查看老年代与 Humongous 对象分布：MAT 中分析对象大小与引用树；
- 关注 `G1 Humongous Regions`：若大量占用，需优化对象结构或堆布局；
- 分析类加载器：确认是否因重复加载导致元空间或堆增长；
- 结合 GC 日志判断晋升失败、To-space exhausted 等问题。

# 调优案例步骤
1. 收集 GC 日志 + heap dump；
2. 在 MAT 中按照 retained size 排序，定位占用最大的对象；
3. 检查 GC Roots → 引用链是否包含缓存、ThreadLocal；
4. 评估是否可以弱引用、软引用或显式清理；
5. 调整 G1 参数（Region 大小、停顿目标）并再次验证。

# 自检清单
- 是否记录 heap dump 生成时间与 GC 日志对应关系？
- 是否区分实际泄漏与缓存未过期情况？
- 是否确认大对象、类加载器、集合增长是否合理？

# 参考资料
- JDK HotSpot Heap Dump 指南：https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/tooldocs/jmap.html
- G1 GC 调优文档：https://docs.oracle.com/en/java/javase/17/gctuning/garbage-first-garbage-collector.html
- Eclipse MAT 官方文档：https://help.eclipse.org/latest/topic/org.eclipse.mat.ui.help/welcome/welcome.html
