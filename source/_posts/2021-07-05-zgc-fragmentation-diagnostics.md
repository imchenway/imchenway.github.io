---
title: ZGC 内存碎片诊断手册
date: 2021-07-05
lang: zh-CN
tags: ['#JVM', '#ZGC', '#Troubleshooting']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 背景
长时间运行的 ZGC 服务在高并发与大对象场景下，可能出现内存碎片导致分配失败，需要系统化诊断步骤。

# 诊断思路
- 监控 `zgc_regions_active`, `zgc_allocation_rate` 等指标，识别碎片化趋势；
- 使用 `jcmd VM.native_memory` 分析堆与元空间的分配情况；
- 启用 JFR `ZAllocationStall` 事件，定位无法满足分配的瞬间；
- 对大对象采用分代缓存或对象池，降低直接分配压力。

# 缓解策略
- 调整 `-XX:ZFragmentationLimit` 与 `-XX:ZCollectionInterval`；
- 对大对象开启分区存储或序列化压缩；
- 在自动化发布中执行 Warmup，稳定对象形态。

# 自检清单
- 是否保留碎片事件的 JFR Trace 供复盘？
- 是否评估大对象逃逸与池化策略的收益？
- 是否结合压测验证碎片率改善？

# 参考资料
- ZGC 官方调优指南：https://docs.oracle.com/en/java/javase/16/gctuning/z-garbage-collector.html
- OpenJDK ZGC Wiki：https://wiki.openjdk.org/display/zgc/Main
- JFR 官方文档：https://docs.oracle.com/javacomponents/jmc-8-0/jfr-runtime-guide/toc.htm
