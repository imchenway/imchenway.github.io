---
title: JVM虚拟线程与Project Loom进展
date: 2021-12-06
lang: zh-CN
tags: ['#JVM']
---

### 本文目录
<!-- toc -->

# 引言
> Project Loom 引入的虚拟线程让 Java 在处理高并发 I/O 时具有天然优势。本文回顾虚拟线程设计、调度策略与当前限制，帮助我们评估迁移路径。

# 虚拟线程的核心理念
- 每个虚拟线程都是 `java.lang.Thread` 的实例，JVM 维护数百万级别的轻量线程；
- 使用 `ForkJoinPool`（`VirtualThreadScheduler`）调度；
- 阻塞操作（`java.nio.channels`）会通过 `Continuation` 挂起，释放平台线程；
- 无需重写框架，保持同步代码 style。

# API 使用
```
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 1_000_000).forEach(i ->
        executor.submit(() -> handleRequest(i))
    );
}
```
- `Thread.startVirtualThread` 创建单个虚拟线程；
- `StructuredTaskScope` 提供结构化并发解决方案；
- 需依赖 JDK 19+ 的预览特性。[1]

# 调度与性能
- 阻塞时通过 `Continuations` 保存状态；
- LIFO/FIFO 混合调度策略，优先执行本地任务；
- 与 Kotlin 协程不同，虚拟线程与线程 API 完全兼容；
- 适合 I/O 密集型、低 CPU 工作负载；
- 需结合 `-Djdk.traceVirtualThread` 调试。

# 当前限制与注意事项
- 本地方法、`synchronized` 阻塞仍占用平台线程；
- JDK 内部未适配的阻塞 API 可能退化；
- 观测工具需更新（JFR 支持虚拟线程事件）；
- 监控线程数时需拉高阈值，避免误报。

# 实战建议
- 对传统线程池应用进行 POC，比较吞吐、延迟；
- 边车中间件（如 Hystrix）需评估是否支持；
- 日志 MDC 需适配虚拟线程上下文；
- 配合 Loom-friendly 框架：Spring Boot 3、Helidon、Micronaut 已在适配中。

# 总结
虚拟线程让同步编程模型重回主流。通过结构化并发与现有 API 的无缝集成，我们可以用更低的成本构建海量并发应用。

# 参考资料
- [1] JEP 425: Virtual Threads (Preview). https://openjdk.org/jeps/425
- [2] Project Loom Wiki. https://wiki.openjdk.org/display/loom/Main
- [3] Re:StructuredTaskScope API 文档. https://download.java.net/java/early_access/loom/docs/api/
