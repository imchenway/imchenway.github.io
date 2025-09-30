---
title: OpenFeign与HTTP/3互操作前瞻
date: 2022-11-21
tags: ['#RPC']
---

### 本文目录
<!-- toc -->

# 引言
> HTTP/3 基于 QUIC，为高延迟场景提供更优的性能。虽然 Java 生态尚在演进，但我们可以提前评估 OpenFeign 与 HTTP/3 的互操作路径，考虑代理层引入 QUIC 支持。

# HTTP/3 概述
- 基于 UDP + QUIC，提供 0-RTT、头部压缩、流控制；
- 加密默认开启；
- 需要客户端、服务端、代理支持。

# Feign 现状
- 默认使用 Apache HttpClient 或 OkHttp；
- OkHttp 4.x 支持 HTTP/2，HTTP/3 仍在实验；
- 可通过自定义 Client 接入其他库（如 Cloudflare QUIC 支持）。

# 代理方案
- 在服务端 / 边缘使用 Envoy、NGINX QUIC 提供 HTTP/3；
- Feign 调用代理层的 HTTP/2/1.1 接口，由代理转为 HTTP/3；
- 或者使用 gRPC + Triple 协议（HTTP/2），结合 HTTP/3 网关。

# 未来展望
- Jetty/Netty 正在开发 QUIC 支持；
- Spring Cloud Gateway + Netty QUIC 可能实现端到端 HTTP/3；
- Feign 可能通过 OkHttp 实现原生支持。

# 监控与测试建议
- 使用 `curl --http3`、`h2load` 测试；
- 关注 RTT、重传率、丢包情况；
- 在 QUIC 代理上记录指标；
- 对 Feign 侧仍需监控重试、熔断行为。

# 总结
HTTP/3 对 RPC 的影响主要在传输层。短期内可以通过代理平滑过渡，长期则需要关注 Java 客户端的 QUIC 支持演进。

# 参考资料
- [1] IETF HTTP/3 RFC 9114.
- [2] OkHttp HTTP/3 Roadmap. https://square.github.io/okhttp/http3/
- [3] Envoy QUIC Support. https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/http/http3
