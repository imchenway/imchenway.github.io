---
title: JVM偏向锁与轻量级锁演进史
date: 2021-10-17
lang: zh-CN
tags: ['#JVM']
---

### 本文目录
<!-- toc -->

# 引言
> HotSpot 的锁实现经历了偏向锁、轻量级锁、重量级锁等阶段，以减少无竞争同步的开销。了解锁的演进和 JDK 15 之后的调整，有助于我们在并发代码中做正确的锁选择。

# HotSpot 锁状态转换
1. **无锁**：对象头 mark word 记录 hash、年龄；
2. **偏向锁**：初次获取锁时将线程 ID 写入 mark word，以后同线程进入不需 CAS；
3. **轻量级锁**：通过 CAS 尝试获取锁，使用自旋等待；
4. **重量级锁**：多线程竞争失败后，进入 OS 互斥锁，线程阻塞。

# 偏向锁的激活条件
- 默认开启（JDK 6 起）；
- 可通过 `-XX:+UseBiasedLocking` 控制；
- 延迟激活：`-XX:BiasedLockingStartupDelay`；
- 仅适用于无竞争、单线程访问的锁。

# JDK 15 的变更
JEP 374 移除了偏向锁，JDK 17 彻底删除该特性。[1]
- 原因：JIT、C2 复杂度高；偏向锁撤销成本大；
- 替代：直接使用轻量级锁 + 自旋 + 自适应调度。

# 轻量级锁与自旋策略
- `-XX:+UseSpinWait` 在用户态自旋等待；
- `-XX:PreBlockSpin` 控制自旋次数；
- 自适应自旋：根据上次锁持有时间动态调整；
- 与 CPU 核心数、线程排队情况相关。

# 实践案例
- 高并发订单系统中，热点锁在 JDK 17 后性能平稳提升 5%，主要来自偏向锁撤销开销消失；
- 在大量短临界区场景，高自旋可能导致 CPU 空转，应结合 `perf` 观察；
- AQS（AbstractQueuedSynchronizer）仍基于重量级锁，需要结合业务选择。

# 优化建议
- 使用无锁或低争用设计（`LongAdder`、`StampedLock`）；
- 在 JDK 15+ 不再关注偏向锁参数，专注于竞争热点；
- 监控 `safepoint` 与锁竞争，`jcmd Thread.print` 查看；
- 在微服务中使用 `synchronized` 已不再过时，尤其配合 JIT 优化。

# 总结
偏向锁曾在单线程场景发挥作用，但随 JDK 发展，轻量级锁成为默认策略。理解锁状态转换与自旋策略，才能写出高效、稳定的同步代码。

# 参考资料
- [1] JEP 374: Disable Biased Locking. https://openjdk.org/jeps/374
- [2] Oracle, "Java Object Synchronization". https://docs.oracle.com/javase/
- [3] Aleksey Shipilev, "Java Locks and synchronizers" 演讲.
