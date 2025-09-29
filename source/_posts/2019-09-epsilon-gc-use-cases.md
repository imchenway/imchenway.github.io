---
title: Epsilon GC 零垃圾收集器的应用场景
date: 2019-09-12
tags: ['#JVM', '#GC', '#Epsilon']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# Epsilon GC 是什么
Epsilon（JEP 318）是 HotSpot 的零垃圾收集器。它只负责内存分配，不回收内存，适用于短生命周期应用、性能测试、GC 研究。

# 启用方式
- `-XX:+UnlockExperimentalVMOptions -XX:+UseEpsilonGC`；
- 适配堆大小：`-Xms=-Xmx`；
- 可结合 `-XX:+AlwaysPreTouch` 预热内存。

# 适用场景
- **性能基准**：测量最大吞吐，避免 GC 干扰；
- **短命工具/函数**：命令行工具、编译器前端；
- **GC 调试**：模拟 GC 失效场景，验证内存监控与报警；
- **托管运行时**：由外部进程负责回收（少见）。

# 风险与监控
- 堆耗尽即退出：`java.lang.OutOfMemoryError: Java heap space`；
- 需要监控内存使用趋势，提前终止；
- 不适合生产长期服务。

# 自检清单
- 是否明确应用生命周期短且可接受 OOM 退出？
- 是否配置充分的堆大小与退出策略？
- 是否记录 OOM 事件并自动重启？

# 参考资料
- JEP 318: Epsilon: A No-Op Garbage Collector：https://openjdk.org/jeps/318
- HotSpot GC Overview：https://docs.oracle.com/en/java/javase/17/gctuning/garbage-collectors.html
- Aleksey Shipilev 博客：Epsilon use-cases
