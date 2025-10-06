---
title: CompletableFuture 常见模式与最佳实践
date: 2018-05-05
lang: zh-CN
tags: ['#Java', '#Concurrency']
categories:
  - Java
  - Concurrency
---

### 本文目录
<!-- toc -->

# CompletableFuture 能解决什么问题
`CompletableFuture` 提供异步任务组合、依赖管理与非阻塞回调，是构建响应式与非阻塞应用的重要工具。它支持串行依赖、并行组合、异常处理与超时控制。

# 核心模式
| 模式 | 说明 | 示例 |
|---|---|---|
| 串联 `thenCompose` | 上一个异步结果作为下一个任务输入 | `fetchUser().thenCompose(user -> fetchOrders(user))` |
| 并行 `thenCombine` | 合并两个并行任务结果 | `priceFuture.thenCombine(stockFuture, Math::min)` |
| 多任务 `allOf/anyOf` | 等待全部/任意任务完成 | `CompletableFuture.allOf(futures...)` |
| 异常 `handle/exceptionally` | 统一处理异常或提供默认值 | `future.handle((res, ex) -> ...)` |
| 超时 `orTimeout/completeOnTimeout` | JDK 9+ 内置超时控制 | `future.orTimeout(2, TimeUnit.SECONDS)` |

# 自定义线程池
默认使用 `ForkJoinPool.commonPool`。在 IO 密集或隔离场景下自定义线程池：
```java
ExecutorService executor = Executors.newFixedThreadPool(8);
CompletableFuture.supplyAsync(() -> fetch(), executor);
```
避免与 CPU 密集任务混用，使用命名线程工厂与监控。

# 调试与监控
- `CompletableFuture#whenComplete` 打印日志；
- 使用 JFR `Java Monitor`、`Async Profiler` 观察线程池状况；
- 注意异常传播：链路上的异常若未处理，最终 `join()` 会抛出 `CompletionException`。

# 自检清单
- 是否对每一条异步链路处理异常？
- 是否合理安排线程池，避免阻塞公共线程池？
- 是否使用 `allOf`/`anyOf` 实现批量任务控制？

# 参考资料
- Java SE 8 API - `CompletableFuture`：https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CompletableFuture.html
- Oracle 官方异步编程指南：https://docs.oracle.com/javase/tutorial/essential/concurrency/completablefuture.html
- “CompletableFuture: Patterns and Best Practices” (Oracle Blog)
