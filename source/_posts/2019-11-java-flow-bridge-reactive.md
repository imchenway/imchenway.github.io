---
title: 将 Java Flow API 与 Reactor/RxJava 互操作
date: 2019-11-05
tags: ['#Java', '#Reactive', '#Flow']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# Flow API 回顾
JDK 9 引入 `java.util.concurrent.Flow`，提供标准的发布-订阅接口。Project Reactor、RxJava 等框架遵守 Reactive Streams 规范，支持与 Flow API 互操作。

# 互操作方式
- Reactor：`Flux.from(publisher)`、`Flux#toStream()`；
- Flow Publisher ↔ Reactors `Flux`：
```java
Flow.Publisher<String> publisher = FlowAdapters.toFlowPublisher(Flux.just("a", "b"));
Flux<String> flux = Flux.from(FlowAdapters.toPublisher(publisher));
```
- RxJava：通过 `Flowable.fromPublisher()`、`Flowable#toFlowable()`。

# 背压策略
- Flow API 原生支持 `Subscription.request(n)`；
- Reactor/RxJava 自动处理背压；
- 在桥接时确保 `request` 逻辑正确传递，避免无限流。

# 应用场景
- 将已有 Reactive Streams 库 (Kafka, RSocket) 与 JDK Flow 集成；
- 在模块化项目中仅依赖 JDK API；
- 实现自定义 Publisher/Subscriber 并嵌入 Reactor Pipeline。

# 自检清单
- 是否使用 FlowAdapters 提供的安全桥接方法？
- 是否验证背压在两个框架之间正确传递？
- 是否设置错误处理策略（`onErrorResume`, `doOnError`）？

# 参考资料
- JDK Flow API：https://docs.oracle.com/javase/11/docs/api/java.base/java/util/concurrent/Flow.html
- Reactor FlowAdapter：https://projectreactor.io/docs/core/release/api/reactor/adapter/JdkFlowAdapter.html
- Reactive Streams 规范：https://www.reactive-streams.org/
