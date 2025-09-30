---
title: 偏向锁演进与调优策略
date: 2020-06-12
tags: ['#JVM', '#Lock', '#Performance']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 偏向锁的演进
偏向锁自 JDK 6 引入，旨在降低无竞争场景的同步开销。JDK 15 默认关闭偏向锁（JEP 374），JDK 18 起移除，使得调优策略发生变化。了解其演进可帮助我们在旧版本中合理配置，在新版本中关注替代机制。

# 旧版本调优
- 启动延迟：`-XX:BiasedLockingStartupDelay=0`；
- 禁用：`-XX:-UseBiasedLocking`；
- 统计：`-XX:+PrintBiasedLockingStatistics`；
- 手动撤销：`-XX:BiasedLockingBulkRebiasThreshold` 控制重偏向阈值。

# JDK 15+ 关注点
- 偏向锁被禁用，轻量级锁成为默认路径；
- 可通过 JFR 事件 `JavaMonitorEnter` 观察锁竞争；
- 在极端低竞争场景评估自旋/锁消除收益。

# 自检清单
- 是否评估目标 JDK 对偏向锁的默认行为？
- 是否在高竞争类上禁用偏向锁以减少批量撤销？
- 是否使用 JFR/Async-profiler 分析锁竞争热点？

# 参考资料
- JEP 374: Disable and Deprecate Biased Locking：https://openjdk.org/jeps/374
- HotSpot 锁实现文档：https://wiki.openjdk.org/display/HotSpot/Locking
- Java Performance, 2nd Edition（锁优化章节）
