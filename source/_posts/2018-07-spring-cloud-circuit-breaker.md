---
title: Spring Cloud Circuit Breaker 架构与落地建议
date: 2018-07-26
lang: zh-CN
tags: ['#Spring', '#Resilience']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 背景
熔断/限流是微服务可靠性建设的基础。Spring Cloud Circuit Breaker 抽象化了 Hystrix、Resilience4j、Sentinel 等实现，提供统一 API，方便逐步迁移与多种容错策略组合。

# 核心概念
- **CircuitBreakerFactory**：创建不同命名的熔断器；
- **Customizer**：按名称定制配置，如超时、滑动窗口；
- **Fallback**：熔断后执行降级逻辑；
- **Bulkhead**：线程池/信号量隔离。

# Resilience4j 示例
```java
@Configuration
class CircuitBreakerConfig {
    @Bean
    public Customizer<Resilience4JCircuitBreakerFactory> defaultCustomizer() {
        return factory -> factory.configureDefault(id -> new Resilience4JConfigBuilder(id)
            .circuitBreakerConfig(CircuitBreakerConfig.custom()
                .failureRateThreshold(50)
                .waitDurationInOpenState(Duration.ofSeconds(5))
                .slidingWindowSize(20)
                .build())
            .timeLimiterConfig(TimeLimiterConfig.custom()
                .timeoutDuration(Duration.ofSeconds(2))
                .build())
            .build());
    }
}

@Service
class RemoteService {
    private final CircuitBreakerFactory cbFactory;
    private final RestTemplate restTemplate;

    RemoteService(CircuitBreakerFactory cbFactory, RestTemplate restTemplate) {
        this.cbFactory = cbFactory;
        this.restTemplate = restTemplate;
    }

    String call() {
        return cbFactory.create("remote-api")
            .run(() -> restTemplate.getForObject("https://api.example.com/data", String.class),
                throwable -> "fallback");
    }
}
```

# 监控与告警
- 暴露 Actuator `/actuator/circuitbreakers`；
- Micrometer 提供 `resilience4j_circuitbreaker_state`、`_calls` 指标；
- 设置告警：失败率、慢调用、重试次数。

# 落地建议
- 与客户端重试策略区分责任，避免放大流量；
- 配置统一的熔断策略模板，并根据服务 SLA 细分；
- 定期演练故障（混沌工程），验证熔断与降级效果。

# 自检清单
- 是否为关键依赖配置熔断与隔离？
- 是否将熔断状态纳入监控与报警？
- 是否验证降级逻辑的正确性与幂等性？

# 参考资料
- Spring Cloud Circuit Breaker 文档：https://docs.spring.io/spring-cloud-circuitbreaker/docs/current/reference/html/
- Resilience4j 官方指南：https://resilience4j.readme.io/
- Netflix Hystrix 设计文档：https://github.com/Netflix/Hystrix/wiki
