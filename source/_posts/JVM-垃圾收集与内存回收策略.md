---
title: JVM垃圾收集与内存回收策略
date: 2021-07-09
tags: ['#JVM']
---

### 本文目录
<!-- toc -->

# 引言
> 在[JVM内存模型](https://imchenway.com/2021/07/07/JVM-JVM内存模型/)中，我们弄清了堆、方法区以及线程私有区域的职责，也留下了“JVM是如何完成垃圾收集的？”这个问题。
> 本文就沿着这条线索，整理HotSpot虚拟机的垃圾收集核心概念与常见收集器的运行策略，帮助你在阅读GC日志或定位内存问题时做到心中有数。

# 垃圾收集的基本概念
## 为什么必须要有GC？
在Java里，对象大多分配在堆中，若不自动回收，将很快耗尽内存并引发`OutOfMemoryError`。因此HotSpot在后台维护垃圾收集器，周期性回收不再被使用的对象，维持堆空间的健康状态。

## 如何判断对象“死了”？
HotSpot使用**可达性分析（Reachability Analysis）**来判断对象是否存活：以GC Roots（如栈帧本地变量、方法区中常量引用、JNI引用等）作为起点，沿引用关系向下遍历，走不到的对象即视为垃圾。[Oracle GC Tuning Guide 明确指出 HotSpot 通过遍历对象图完成可达性判定][1]。

## GC Roots 包括哪些？
- 各线程栈帧中的局部变量表、操作数栈中的对象引用
- 方法区中静态字段、常量池引用
- JNI（本地方法）引用
- 即时编译器产生的本地引用、字节码解释器持有的引用

当这些根集合发生变化时需要暂停线程建立一致快照，因此会涉及“安全点”和“安全区域”的概念。

# HotSpot 的分代内存布局
## 新生代与老年代
HotSpot的堆默认采用分代设计：新对象先进入新生代（Eden + 两块Survivor）；当对象“熬过”多次垃圾回收或体积较大时晋升到老年代。Oracle GC 文档指出分代能利用“绝大多数对象朝生暮死”的统计特性来提升吞吐量[1]。

- **Minor GC**：只回收新生代，触发条件通常是Eden满。
- **Major/Full GC**：需要遍历老年代甚至整个堆，触发条件包括老年代空间不足、`System.gc()` 调用、元空间膨胀等。

## 晋升与分配担保
对象在Survivor之间复制并调整年龄，达到阈值（默认15）后晋升老年代。当老年代剩余空间不足时，HotSpot会做“晋升担保”检查：若预计无法容纳晋升对象，则提前触发Full GC或直接进入“应急分配”，避免内存溢出。

# 常见垃圾收集器
## Serial 与 Parallel
- **Serial GC**：单线程收集，适合单核或小堆，适用于低延迟要求不高的Client模式。[HotSpot 手册将其标记为 Client VM 默认选择][2]。
- **Parallel GC**：又称吞吐量优先收集器（`-XX:+UseParallelGC`），在新生代和老年代都使用多线程并行收集，适合追求吞吐的批处理场景。

## CMS（Concurrent Mark Sweep）
CMS 以“标记-清除”算法为主，减少老年代停顿时间，但会产生内存碎片并在“并发模式失败”时退化为Serial Old。自JDK9起被标记为过时但仍在部分线上系统中使用。

## G1（Garbage-First）
G1 将堆划分为多个Region，混合并行、并发阶段，能够按暂停时间目标（`-XX:MaxGCPauseMillis`）做预测规划，是JDK9+的服务器端默认收集器[3]。其“整堆标记-复制”策略有效降低碎片，同时保留可控的暂停时间。

# 安全点与安全区域
为了让并发或增量式GC安全执行，HotSpot在特定字节码位置设置**安全点（Safepoint）**。当收集器需要停顿时，各线程必须跑到最近的安全点进入暂停状态。对于阻塞在外部调用的线程，则依赖**安全区域（Safe Region）**机制在离开时做安全检查。[HotSpot JVM 规范在2.5节说明了线程必须在安全点上暂停以保持对象图一致性][4]。

# 调优与排错思路
1. **明确指标**：吞吐量、最大暂停时间、堆大小。先根据SLA选择收集器，再按需调整参数。
2. **开启GC日志**：使用`-Xlog:gc*`（JDK9+）或`-XX:+PrintGCDetails`分析回收频率、停顿原因。
3. **关注晋升失败与元空间**：频繁Full GC常由老年代空间不足或类元数据爆炸导致。
4. **配合监控工具**：如JDK自带的 `jstat`、`jmap`、`jcmd`，或更高级的Java Flight Recorder，对堆使用、停顿时间做持续观察。

# 本文总结
- HotSpot通过可达性分析判定对象是否存活，GC Roots定义了遍历起点。
- 分代设计让大部分垃圾在新生代就被回收，减少整堆扫描的压力。
- 不同收集器在吞吐量、暂停时间之间做权衡：G1已成为主流默认选择，但Serial、Parallel、CMS仍各有用武之地。
- 安全点与安全区域确保并发标记过程中对象图一致，GC日志与监控工具则是排查内存问题的利器。

# 相关问题
- 如何阅读并分析 GC 日志？
- G1 的暂停预测模型如何工作？
- ZGC、Shenandoah 等低延迟收集器与 G1 有何差异？

---
#### 参考资料
- [1] Oracle, *Java Platform, Standard Edition HotSpot Virtual Machine Garbage Collection Tuning Guide*（JDK 8）: https://docs.oracle.com/javase/8/docs/technotes/guides/vm/gctuning/overview.html
- [2] Oracle, *Java SE HotSpot Virtual Machine Options*: https://docs.oracle.com/javase/8/docs/technotes/tools/unix/java.html#BABHDABI
- [3] Oracle, *JEP 248: Make G1 the Default Garbage Collector*: https://openjdk.org/jeps/248
- [4] Oracle, *Java Virtual Machine Specification, Java SE 17 Edition* §2.5: https://docs.oracle.com/javase/specs/jvms/se17/html/jvms-2.html
