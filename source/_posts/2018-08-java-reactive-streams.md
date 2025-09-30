---
title: Java Reactive Streams 标准与 Project Reactor 实战
date: 2018-08-05
tags: ['#Java', '#Reactive']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# Reactive Streams 规范
Reactive Streams 定义了异步流处理的标准接口（Publisher、Subscriber、Subscription、Processor），强调非阻塞与背压。JDK 9 的 Flow API 与 Project Reactor、RxJava 等框架兼容。

# Flow API 与 Reactor 映射
| Reactive Streams | Flow API | Reactor |
|---|---|---|
| Publisher<T> | Flow.Publisher<T> | Flux/Mono |
| Subscriber<T> | Flow.Subscriber<T> | CoreSubscriber |
| Subscription | Flow.Subscription | Subscription |
| Processor<T,R> | Flow.Processor<T,R> | FluxProcessor |

# Reactor 示例
```java
Flux<String> flux = Flux.just("app", "service", "reactive")
    .filter(s -> s.length() > 4)
    .map(String::toUpperCase)
    .delayElements(Duration.ofMillis(200));

flux.subscribe(new BaseSubscriber<>() {
    @Override
    protected void hookOnSubscribe(Subscription subscription) {
        request(1);
    }

    @Override
    protected void hookOnNext(String value) {
        System.out.println("onNext: " + value);
        request(1); // 背压控制
    }
});
```

# 背压策略
- `onBackpressureBuffer`、`onBackpressureDrop`、`onBackpressureLatest`；
- 控制请求速率：`Flux.interval` + `limitRate`；
- 与外部系统（数据库、消息队列）结合需要考虑批量、超时。

# 调试与监控
- `log()` 操作符输出信号；
- `Hooks.onOperatorDebug()` 在开发环境提供堆栈追踪；
- Micrometer + Reactor Metrics 监控延迟与订阅数量。

# 自检清单
- 是否理解背压并正确实现 `request(n)`？
- 是否使用 `checkpoint()`、`log()` 等工具排查问题？
- 是否为生产环境配置指标与警报？

# 参考资料
- Reactive Streams 规范：https://www.reactive-streams.org/
- Project Reactor 官方文档：https://projectreactor.io/docs/core/release/reference/
- JDK 9 Flow API：https://docs.oracle.com/javase/9/docs/api/java/util/concurrent/Flow.html
