---
title: Java gRPC 与 Reactor 的响应式整合
date: 2020-04-05
tags: ['#Java', '#Reactive', '#gRPC']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 需求场景
传统 gRPC Java 使用阻塞 Stub 或基于 Callbacks 的异步 Stub。对于需要响应式数据流、背压与操作符组合的微服务，可通过 Project Reactor 为 gRPC 通信提供更加灵活的编排方式。

# 整体方案
- 使用 `grpc-java` + `reactor-grpc` 代码生成器；
- 通过 `Flux`/`Mono` 映射 gRPC 的流式方法；
- 利用 Reactor 的 `Schedulers.boundedElastic()` 隔离阻塞壳层。

```bash
protoc \
  --plugin=protoc-gen-reactor=reactor-grpc \ 
  --reactor_out=classpath \
  --grpc-java_out=classpath \
  service.proto
```

```java
public class UserServiceReactor extends ReactorUserServiceGrpc.UserServiceImplBase {
    @Override
    public Mono<UserReply> getUser(Mono<UserRequest> request) {
        return request.flatMap(req -> repository.findById(req.getId()))
            .map(this::toReply);
    }
}
```

# 背压与线程模型
- Reactor gRPC 将服务端流式响应暴露为 `Flux`，可直接应用 `limitRate`, `retryWhen`；
- 对阻塞仓储调用使用 `publishOn(Schedulers.boundedElastic())` 避免阻塞 event-loop；
- 客户端使用 `ReactorUserServiceGrpc.ReactorUserServiceStub` 获取响应式 Stub。

# 自检清单
- 是否统一在代码生成阶段引入 reactor 插件，并在 CI 中验证？
- 是否避免在 Reactor pipeline 中执行阻塞调用？
- 是否在指标系统中记录 gRPC 延迟与错误率？

# 参考资料
- reactor-grpc 项目：https://github.com/salesforce/reactive-grpc
- gRPC Java 文档：https://grpc.io/docs/languages/java/
- Reactor 官方文档：https://projectreactor.io/docs/core/release/reference/
