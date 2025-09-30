---
title: RSocket 响应式通信模式
date: 2020-11-12
tags: ['#Java', '#RSocket', '#Reactive']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# RSocket 四种交互模式
- `fire-and-forget`
- `request-response`
- `request-stream`
- `channel`（双向流）
使用 RSocket + Reactor 可以灵活实现背压、流量控制以及跨语言通信。

# Spring Boot 集成
```java
@Bean
RSocketRequester rSocketRequester(RSocketRequester.Builder builder) {
    return builder.connectTcp("localhost", 7878).block();
}

@MessageMapping("chat")
Flux<Message> chat(Flux<Message> incoming) {
    return incoming.delayElements(Duration.ofMillis(10)).map(this::handle);
}
```

# 生产实践
- 配置 `resume` 功能应对网络抖动；
- 使用 `Loadbalance` 进行服务发现；
- 指标：`rsocket.frame.size`, `error.count`；
- 安全：结合 JWT / mTLS。

# 自检清单
- 是否根据业务选择合适交互模式与背压策略？
- 是否启用连接断线重连与心跳包？
- 是否监控 RSocket 指标并纳入告警？

# 参考资料
- RSocket 规范：https://rsocket.io
- Spring Messaging RSocket：https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html#rsocket
- Reactor 官方文档
