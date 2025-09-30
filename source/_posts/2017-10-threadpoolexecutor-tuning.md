---
title: ThreadPoolExecutor 参数解析与调优策略
date: 2017-10-26
tags: ['#Java', '#Concurrency']
categories:
  - Java
  - Concurrency
---

### 本文目录
<!-- toc -->

# 核心参数
`ThreadPoolExecutor` 构造函数包含：
- `corePoolSize`：常驻线程数。
- `maximumPoolSize`：线程上限。
- `keepAliveTime` + `TimeUnit`：空闲线程存活时间。
- `BlockingQueue<Runnable>`：任务缓冲策略。
- `ThreadFactory`：自定义线程名称、优先级。
- `RejectedExecutionHandler`：拒绝策略（Abort、CallerRuns、Discard、DiscardOldest）。

# 任务执行流程
1. 线程数 < `corePoolSize`：直接创建新线程。
2. 否则尝试放入队列。
3. 队列满且线程数 < `maximumPoolSize`：创建新线程。
4. 仍无法接收任务时，触发拒绝策略。

# 队列选择
| 队列 | 特点 | 场景 |
|---|---|---|
| `SynchronousQueue` | 不存储任务，需要最大化吞吐 | 短任务、高并发 |
| `LinkedBlockingQueue` | 无界队列，可能导致 OOM | 任务执行快、生产速率可控 |
| `ArrayBlockingQueue` | 有界、可公平锁 | 需要背压、限流 |
| `PriorityBlockingQueue` | 支持优先级 | 调度任务 |

# 调优策略
- 估算任务成本与目标吞吐，合理设置核心线程数（CPU 密集 ~ CPU 核心数，IO 密集 ~ 核心数 × 2）。
- 明确队列容量与拒绝策略，避免请求堆积导致延迟。
- 开启 `allowCoreThreadTimeOut` 以释放空闲核心线程（适合突发型任务）。
- 实现自定义 `ThreadFactory`，为线程命名+设置 `UncaughtExceptionHandler`。

# 监控与诊断
- 使用 `ThreadPoolExecutor#getPoolSize()`、`getActiveCount()`、`getQueue().size()` 实时采样。
- `JMX` 与 Micrometer/Dropwizard Metrics 暴露线程池指标。
- Java Flight Recorder 录制 `ThreadPool` 事件，分析任务堆积与饱和。

# 自检清单
- 是否根据任务类型调优核心线程数与队列？
- 是否为线程池提供统一管理与监控？
- 是否针对异常场景设计拒绝策略与降级流程？

# 参考资料
- Java Concurrency Utilities 指南：https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ThreadPoolExecutor.html
- 《Java Concurrency in Practice》Chapter 8 线程池：https://jcip.net/
- Oracle Java Tutorials - Executors：https://docs.oracle.com/javase/tutorial/essential/concurrency/executors.html
