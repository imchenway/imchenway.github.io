---
title: Project Loom 虚拟线程预览（JDK 19）
date: 2019-03-05
lang: zh-CN
tags: ['#Java', '#VirtualThreads']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 虚拟线程概念
Project Loom 引入虚拟线程（Virtual Threads），轻量化线程模型，便于编写高并发、阻塞式风格的代码而无需大量线程池管理。JDK 19 提供预览特性（JEP 425）。

# 快速体验
```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 10_000).forEach(i ->
        executor.submit(() -> {
            HttpClient.newHttpClient()
                .send(HttpRequest.newBuilder(URI.create("https://example.com"))
                .build(), HttpResponse.BodyHandlers.discarding());
            return null;
        }));
}
```

- 虚拟线程调度由 JVM 与协作式调度实现；
- 阻塞调用（如 `Socket`, `jdbc`）通过 Loom 改造的 JDK 库实现挂起。

# 与平台线程比较
| 特性 | 平台线程 | 虚拟线程 |
|---|---|---|
| 创建成本 | 高 | 低 |
| 数量 | 机器核数量限制 | 数百万级 |
| 阻塞影响 | 占用 OS 线程 | 自动挂起，不阻塞平台线程 |
| 协作方式 | OS 调度 | JVM 调度 + Continuations |

# API 与工具
- `Thread.startVirtualThread(Runnable)`
- `Executors.newVirtualThreadPerTaskExecutor()`
- Debugging：JFR 事件 `VirtualThread`, `JDK Mission Control` 支持虚拟线程视图。

# 实践注意
- JDBC 驱动需支持 Loom，阻塞 IO 如果未适配将退化为平台线程；
- 线程局部变量（ThreadLocal）在虚拟线程中仍可用，但需注意数量；
- 与 `StructuredTaskScope`（JEP 428）结合，实现结构化并发。

# 自检清单
- 是否启用 `--enable-preview` 与最新 JDK？
- 是否评估依赖（JDBC、Netty）是否对 Loom 友好？
- 是否在测试环境验证虚拟线程调度与监控指标？

# 参考资料
- JEP 425: Virtual Threads (Preview)：https://openjdk.org/jeps/425
- Project Loom Early-Access 文档：https://wiki.openjdk.org/display/loom/Main
- Structured Concurrency (JEP 428)：https://openjdk.org/jeps/428
