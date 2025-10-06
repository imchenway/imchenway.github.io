---
title: 虚拟线程环境下的锁策略设计
date: 2021-06-12
lang: zh-CN
tags: ['#Java', '#VirtualThreads', '#Concurrency']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 背景
Project Loom 引入虚拟线程，需要重新评估锁的竞争策略与阻塞行为，避免平台线程被占满。

# 策略
- 优先选择 `ReentrantLock.tryLock` + 超时，降低长时间占用；
- 将阻塞 I/O 改造为异步接口，避免虚拟线程频繁挂起唤醒；
- 利用 `StructuredTaskScope` 管理批量任务，收敛提交点；
- 对共享数据采用无锁结构或 `StampedLock` 读写分离。

# 监控
- 启用 `jdk.VirtualThreadPinned` JFR 事件，定位 Pinning；
- 暴露线程池指标，观察 Carrier Thread 使用率；
- 结合 JVM TI 采样，确认阻塞点与锁饥饿情况。

# 自检清单
- 是否排查 `synchronized` 内包含阻塞 I/O？
- 是否提供 Pinning 预警并自动降级为平台线程？
- 是否在性能测试中验证吞吐提升与尾延迟？

# 参考资料
- Project Loom 官方页面：https://openjdk.org/projects/loom/
- JEP 425: Virtual Threads：https://openjdk.org/jeps/425
- StructuredTaskScope 指南：https://download.java.net/java/early_access/loom/docs/api/jdk.incubator.concurrent/jdk/incubator/concurrent/StructuredTaskScope.html
