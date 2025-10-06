---
title: Feign与Resilience4j熔断重试策略
date: 2022-11-11
lang: zh-CN
tags: ['#RPC']
---

### 本文目录
<!-- toc -->

# 引言
> Feign 作为声明式 HTTP 客户端，常与 Resilience4j 联动，实现熔断、限流和重试。本文总结 Feign + Resilience4j 的整合方式、策略配置与监控实践。

# 整合步骤
- 引入 `spring-cloud-starter-openfeign` 与 `spring-cloud-starter-circuitbreaker-resilience4j`；
- 使用 `@FeignClient` 定义接口；
- 配置 `resilience4j.circuitbreaker`、`retry`、`ratelimiter`；
- 在 `Feign.Builder` 加入 `Retryer`、`ErrorDecoder`。

# 配置示例
```yaml
feign:
  client:
    config:
      orderService:
        connectTimeout: 2000
        readTimeout: 3000

resilience4j:
  circuitbreaker:
    instances:
      orderService:
        failureRateThreshold: 50
        slidingWindowSize: 50
  retry:
    instances:
      orderService:
        maxAttempts: 3
        waitDuration: 500ms
```

# 熔断与重试策略
- 熔断后调用 `fallback`，返回友好提示或兜底数据；
- 重试需谨慎，避免对非幂等接口重复提交；
- 配合 Bulkhead 保护线程；
- 使用 `TimeLimiter` 控制调用超时。

# 监控
- Micrometer 指标：`resilience4j_circuitbreaker_state`、`resilience4j_retry_calls`；
- 日志记录：`traceId`、熔断次数、重试次数；
- 配合 Zipkin/OTel 跟踪调用链；
- Fallback 中记录业务告警。

# 实战经验
- 在订单服务中，根据 HTTP 状态码分类重试（5xx 重试，4xx 不重试）；
- 对关键接口设置 `RateLimiter` 提前限流；
- 在高峰期调整阈值，避免雪崩；
- 灰度发布时监控熔断频率，确保新版稳定。

# 总结
Feign 与 Resilience4j 的组合提供了灵活的容错机制。通过合理配置熔断、重试、限流，以及完善的监控，可保持跨服务调用的稳定性。

# 参考资料
- [1] Spring Cloud OpenFeign Reference. https://docs.spring.io/spring-cloud-openfeign/docs/current/reference/html/
- [2] Resilience4j Documentation. https://resilience4j.readme.io
- [3] Spring Cloud CircuitBreaker. https://docs.spring.io/spring-cloud-circuitbreaker/docs/current/reference/html/
