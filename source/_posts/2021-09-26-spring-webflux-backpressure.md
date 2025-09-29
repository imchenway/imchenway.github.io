---
title: Spring WebFlux 背压调度策略
date: 2021-09-26
tags: ['#Spring', '#WebFlux', '#Backpressure']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 背景
响应式系统需要处理上下游速率不匹配的问题，通过背压策略保障资源使用与 SLA。

# 策略
- 使用 `publishOn` 配置 Scheduler，隔离慢消费者；
- 借助 `limitRate` 与 `onBackpressureBuffer` 控制排队；
- 集成 Resilience4j RateLimiter，避免流量洪峰。

# 实施建议
- 对关键链路增加 `Hooks.onOperatorDebug` 诊断；
- 暴露 Reactor Metrics，监控请求排队长度；
- 使用 StepVerifier 编写背压行为的自动化测试。

# 自检清单
- 是否确认上下游都支持背压协议？
- 是否处理缓冲区满时的降级策略？
- 是否验证慢订阅者场景下的资源占用？

# 参考资料
- Spring WebFlux 官方文档：https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html
- Project Reactor 参考手册：https://projectreactor.io/docs/core/release/reference/
- Resilience4j RateLimiter 指南：https://resilience4j.readme.io/docs/ratelimiter
