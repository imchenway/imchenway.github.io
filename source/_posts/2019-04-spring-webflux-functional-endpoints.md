---
title: Spring WebFlux Functional Endpoints 实战
date: 2019-04-19
lang: zh-CN
tags: ['#Spring', '#Reactive']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 为什么选择 Functional Endpoints
Spring WebFlux 提供基于 RouterFunction 与 HandlerFunction 的函数式编程模型，适合构建轻量 REST API。相比注解模式，函数式方式更易测试与组合。

# 基本示例
```java
@Configuration
public class RouteConfig {
    @Bean
    public RouterFunction<ServerResponse> routes(UserHandler handler) {
        return RouterFunctions
            .route(GET("/users"), handler::getAll)
            .andRoute(GET("/users/{id}"), handler::getById)
            .andRoute(POST("/users"), handler::create);
    }
}

@Component
class UserHandler {
    private final UserService userService;

    Mono<ServerResponse> getAll(ServerRequest request) {
        return ServerResponse.ok().body(userService.findAll(), User.class);
    }

    Mono<ServerResponse> getById(ServerRequest request) {
        return userService.findById(request.pathVariable("id"))
            .flatMap(user -> ServerResponse.ok().bodyValue(user))
            .switchIfEmpty(ServerResponse.notFound().build());
    }

    Mono<ServerResponse> create(ServerRequest request) {
        return request.bodyToMono(User.class)
            .flatMap(userService::create)
            .flatMap(user -> ServerResponse.created(URI.create("/users/" + user.getId())).bodyValue(user));
    }
}
```

# 验证与过滤器
- `HandlerFilterFunction` 可在 handler 前后执行逻辑；
- `ServerRequest`/`ServerResponse` 支持操作链；
- 使用 `RouterFunctions.nest` 实现路径与过滤器组合。

# 测试
- 使用 `WebTestClient` 进行端到端测试；
- 模拟请求：`webTestClient.get().uri("/users").exchange().expectStatus().isOk();`
- 结合 StepVerifier 验证响应体。

# Observability
- 配合 Micrometer + Spring Boot Actuator 提供指标；
- 结合 Sleuth/OpenTelemetry 输出 traceId；
- 通过 `Hooks.onOperatorDebug()` 在开发环境调试 Reactor 链。

# 自检清单
- 是否合理拆分 handler，保持可测试性？
- 是否对请求校验与错误处理提供统一过滤器？
- 是否结合响应式背压策略（limitRate、timeout 等）？

# 参考资料
- Spring WebFlux 官方文档：https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html
- WebTestClient 指南：https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#webtestclient
- Project Reactor 参考手册：https://projectreactor.io/docs/core/release/reference/
