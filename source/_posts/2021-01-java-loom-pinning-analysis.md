---
title: 虚拟线程固定风险与 Pinning 诊断
date: 2021-01-05
tags: ['#Java', '#Loom', '#Performance']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 固定（Pinning）问题概述
虚拟线程遇到同步块、native 方法或阻塞 I/O 时可能被固定到平台线程，失去调度优势。理解哪些场景会触发 Pinning 并监控相应事件，是使用 Loom 的前提。

# 典型触发场景
- `synchronized`/`ReentrantLock` 长时间持锁；
- 调用未适配 Loom 的 `native` 方法；
- 使用旧版 JDBC 驱动、阻塞式 I/O；
- `ThreadLocal` 中保存大对象并长时间持有。

# 诊断方法
- JFR 事件 `VirtualThreadPinned`, `VirtualThreadBlocked`; 
- `jcmd Thread.print -virtual` 查看虚拟线程状态；
- 结合 Async-profiler `-e wall` 分析长时间阻塞。

# 避免策略
- 使用 `java.util.concurrent` 中的非阻塞组件；
- 更新数据库驱动至 Loom 友好版本或使用 R2DBC；
- 将耗时 I/O 包装成 `CompletableFuture.supplyAsync()` 并切换自定义线程池。

# 自检清单
- 是否在日志/监控中记录 Pinning 事件数量？
- 是否用 JFR 回溯固定时间 > 100ms 的调用栈？
- 是否在上线前使用压力测试验证虚拟线程吞吐？

# 参考资料
- Project Loom FAQ：https://wiki.openjdk.org/display/loom/FAQ
- JEP 425 Virtual Threads：https://openjdk.org/jeps/425
- IntelliJ Loom 调试指南
