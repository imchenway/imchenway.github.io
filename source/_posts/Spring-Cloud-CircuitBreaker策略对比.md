---
title: Spring Cloud CircuitBreaker策略对比
date: 2022-09-02
lang: zh-CN
tags: ['#Spring']
---

### 本文目录
<!-- toc -->

# 引言
> 熔断器是微服务弹性设计的核心。Spring Cloud CircuitBreaker 抽象了 Resilience4j、Sentinel、Hystrix（已废弃）等实现。本文比较不同策略、实践案例与监控手段。

# API 概览
- `ReactiveCircuitBreakerFactory`、`CircuitBreakerFactory`；
- 注解 `@CircuitBreaker`, `@TimeLimiter`；
- 支持 `Resilience4j`, `Sentinel`, `Spring Retry`；
- 与 WebClient、RestTemplate、Gateway 集成。

# 策略对比
| 实现 | 特性 | 场景 |
| --- | --- | --- |
| Resilience4j | 熔断、限流、Bulkhead、缓存、Retry | 云原生日常推荐 |
| Sentinel | 流控、热点参数、系统保护、控制台 | 大规模限流、规则动态管理 |
| Hystrix | 已停止维护 | 不推荐 |

# Resilience4j 配置示例
```yaml
resilience4j.circuitbreaker:
  instances:
    orderService:
      slidingWindowType: COUNT_BASED
      slidingWindowSize: 50
      failureRateThreshold: 50
      waitDurationInOpenState: 10s
```
- 与 `@CircuitBreaker(name="orderService")` 配合。

# Sentinel 集成
- 通过 `SentinelRestTemplate`, `SentinelGatewayFilter`；
- 控制台动态配置规则；
- 结合 `Nacos` 推送规则；
- 注意引入 `spring-cloud-alibaba-sentinel`。

# 监控与报警
- Resilience4j：Micrometer 指标 `resilience4j_circuitbreaker_state`；
- Sentinel：Dashboard、Prometheus exporter；
- 对熔断、限流事件设置告警；
- 与日志系统关联 `traceId`、`ruleId`。

# 实战经验
- 在 API Gateway 使用 Sentinel 实现热点参数限流；
- 在内部服务使用 Resilience4j 配合异步 Bulkhead；
- K8s 中热更新配置，利用 ConfigMap 与 Sentinel 控制台；
- 结合重试与补偿，确保业务流程最终完成。

# 总结
Spring Cloud CircuitBreaker 提供统一抽象。选择实现时需考虑场景、生态与监控体系。Resilience4j 适合通用场景，Sentinel 适合大规模限流需求。

# 参考资料
- [1] Spring Cloud CircuitBreaker Reference. https://docs.spring.io/spring-cloud-circuitbreaker/docs/current/reference/html/
- [2] Resilience4j Documentation. https://resilience4j.readme.io
- [3] Sentinel 官方文档. https://sentinelguard.io/zh-cn/docs/
