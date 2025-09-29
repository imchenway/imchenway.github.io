---
title: Java 结构化并发（Structured Concurrency）实践
date: 2020-07-05
tags: ['#Java', '#Loom', '#Concurrency']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# Structured Concurrency 概念
JEP 428（预览）为虚拟线程提供结构化并发 API，使并发任务具备生命周期管理与错误传播机制。类似 Go 的 `waitGroup`，但提供自动取消与异常传播。

# 示例
```java
try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    Future<String> user = scope.fork(() -> userClient.fetch(id));
    Future<List<Order>> orders = scope.fork(() -> orderClient.list(id));
    scope.join();
    scope.throwIfFailed();
    return new UserProfile(user.resultNow(), orders.resultNow());
}
```

# 优势
- 自动取消：任一任务失败将取消其它任务；
- 资源管理：使用 try-with-resources 自动关闭；
- 调试便利：结构化 Trace 树清晰。

# 实战建议
- 结合 `Executor.ofVirtualThreads()`，避免线程爆炸；
- 在 Spring / Micronaut 中通过自定义组件封装；
- 使用 JFR 事件 `VirtualThread` 观察执行情况。

# 自检清单
- 是否启用 `--enable-preview` 并关注 JDK 更新？
- 是否处理 `StructuredTaskScope` 的异常传播？
- 是否在 Scope 中只执行短生命周期任务，避免阻塞？

# 参考资料
- JEP 428: Structured Concurrency：https://openjdk.org/jeps/428
- Project Loom 文档：https://wiki.openjdk.org/display/loom/Main
- Java Magazine 结构化并发文章
