---
title: G1 堆 dump 分析工作流
date: 2021-02-05
lang: zh-CN
tags: ['#JVM', '#GC', '#Heap']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 为什么要针对 G1 设计专属流程
G1 堆结构复杂，需要结合 Region 分布、Humongous 对象、Remembered Set 才能找到问题根源。标准化堆 dump 工作流有助于快速定位内存泄漏与异常占用。

# 工作流
1. 触发 dump：`jmap -dump:live,format=b,file=heap.hprof <pid>`；
2. 使用 MAT `Dominator Tree`、`Top Consumers` 分析；
3. 结合 GC 日志与 JFR 评估晋升失败、HRegion 占用；
4. 对比多次 dump 找出增量对象。

# 自检清单
- 是否在 dump 前收集 GC 日志、JFR、线程 dump？
- 是否将分析结果记录在知识库？
- 是否为常见泄漏模式（ThreadLocal、缓存）建立检测脚本？

# 参考资料
- Eclipse MAT：https://www.eclipse.org/mat/
- G1 GC 调优指南：https://docs.oracle.com/en/java/javase/17/gctuning/
- Netflix Heap dump 分析经验
