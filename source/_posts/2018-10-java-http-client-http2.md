---
title: Java 11 HttpClient 与 HTTP/2 实战
date: 2018-10-05
lang: zh-CN
tags: ['#Java', '#HTTP']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# HttpClient 新特性
JDK 11 引入标准 HttpClient，支持 HTTP/1.1、HTTP/2、WebSocket、异步编程。替代早期的 `HttpURLConnection`。

# 快速上手
```java
HttpClient client = HttpClient.newBuilder()
        .version(HttpClient.Version.HTTP_2)
        .connectTimeout(Duration.ofSeconds(5))
        .followRedirects(HttpClient.Redirect.NORMAL)
        .build();

HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create("https://api.example.com/data"))
        .header("Accept", "application/json")
        .GET()
        .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());
```

# 异步与流式处理
```java
client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
    .thenApply(HttpResponse::body)
    .thenAccept(System.out::println)
    .join();
```

# HTTP/2 与多路复用
- 单个 TCP 连接上并发多个流；
- 默认启用 ALPN；
- 通过 `HttpClient.Builder.priority(int streamId, int weight)` 设置优先级。

# TLS 与认证
- 自定义 SSLContext、TrustStore；
- Basic/OAuth2 认证可添加 Header 或凭据供应器；
- 配合 `CookieHandler` 管理 Cookie。

# 性能与监控
- JFR 事件 `HTTP Request`、`HTTP Response`；
- Micrometer HTTP 计时器；
- 配合 `CompletableFuture` 或 Reactor 构建响应式流。

# 自检清单
- 是否处理连接超时、读取超时与重试策略？
- 是否评估 HTTP/2 对服务端兼容性？
- 是否为敏感请求配置 TLS/TCP 参数？

# 参考资料
- Java 11 HttpClient 官方文档：https://docs.oracle.com/en/java/javase/11/docs/api/java.net.http/java/net/http/HttpClient.html
- JEP 321: HTTP Client：https://openjdk.org/jeps/321
- HTTP/2 规范：https://www.rfc-editor.org/rfc/rfc7540
