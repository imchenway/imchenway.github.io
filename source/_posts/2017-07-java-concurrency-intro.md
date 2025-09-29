---
title: Java 并发模型入门与线程安全初探
date: 2017-07-26
tags: ['#Java', '#Concurrency']
categories:
  - Java
  - Concurrency
---

### 本文目录
<!-- toc -->

# 并发为何重要
多核时代，Java 的并发能力直接影响服务吞吐与响应延迟。理解线程模型、任务抽象与内存可见性是写好并发代码的第一步。

# 基础组件
- **线程创建**：`Thread`、`Runnable`、`Callable` + `Future`。
- **线程池**：`Executors` 工厂方法快速生成；推荐使用 `ThreadPoolExecutor` 精细配置核心线程数、队列与拒绝策略。
- **同步机制**：`synchronized`、`ReentrantLock`、`Condition` 控制临界区；`volatile` 保证可见性；`Atomic*` 提供无锁原子操作。
- **并发工具包**：`CountDownLatch`、`CyclicBarrier`、`Semaphore`、`CompletableFuture` 等帮助编排任务。

# Java 内存模型 (JMM) 要点
- 程序顺序性、管程锁定、volatile 与线程启动/结束等八大 happens-before 规则。
- `volatile` 提供可见性与禁止指令重排序，但不保证复合操作原子性。
- 双重检查锁定需搭配 `volatile` 才能安全发布单例。

# 常见模式
1. **生产者-消费者**：`BlockingQueue` + 线程池，简化背压与缓冲处理。
2. **异步组合**：`CompletableFuture` 提供串联/并行任务组合，`thenCompose`、`thenCombine` 安排依赖关系。
3. **限流保护**：`Semaphore` 控制并发度，超时释放避免死锁。
4. **资源复用**：线程池复用线程，避免频繁创建销毁带来的开销。

# 调试与诊断
- `jstack` 查看线程栈，识别死锁与阻塞点；
- Java Flight Recorder 记录线程活动、锁竞争；
- `ThreadMXBean` 编程方式检测死锁线程。

# 最佳实践
- 明确任务并发度与线程池配置，避免 `Executors.newFixedThreadPool` 默认队列导致 OOM；
- 使用不可变对象或线程封闭减少锁争用；
- 在共享变量发布时确保可见性（`volatile`、`final` 或安全发布模式）。

# 参考资料
- Java SE 8 Concurrency Tutorial：https://docs.oracle.com/javase/tutorial/essential/concurrency/
- Java Language Specification - Memory Model：https://docs.oracle.com/javase/specs/jls/se8/html/jls-17.html
