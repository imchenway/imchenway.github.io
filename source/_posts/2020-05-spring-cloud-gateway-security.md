---
title: Spring Cloud Gateway 安全加固实践
date: 2020-05-05
lang: zh-CN
tags: ['#Spring', '#Security', '#Gateway']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 常见威胁
Spring Cloud Gateway 作为入口层，需要抵御路径穿越、越权访问、熔断绕过等风险。加固措施包括统一认证、速率限制、跨域控制与熔断保护。

# 加固策略
- **统一鉴权**：集成 Spring Security + OAuth2 Resource Server，对所有路由指定 `SecurityWebFilterChain`；
- **速率限制**：使用 `RequestRateLimiter` 过滤器，结合 Redis 实现令牌桶：
```yaml
filters:
  - name: RequestRateLimiter
    args:
      redis-rate-limiter.replenishRate: 100
      redis-rate-limiter.burstCapacity: 200
```
- **跨域控制**：配置 `globalcors` 严格限定 Source；
- **敏感头部保护**：`default-filters: - RemoveRequestHeader=Cookie`，避免跨域攻击利用旧 Cookie；
- **熔断与回退**：`CircuitBreaker` 过滤器，结合 Resilience4j；
- **日志脱敏**：自定义 `GlobalFilter` 对 Authorization、个人信息字段进行掩码。

# 监控与告警
- Micrometer 指标 `spring.cloud.gateway.requests`；
- 结合 Prometheus 报告状态码分布、限流触发次数；
- 使用 `Logback` 的 JSON Encoder 将请求 ID、用户 ID、Trace ID 注入日志。

# 自检清单
- 是否统一开启鉴权并对静态资源做白名单控制？
- 是否为敏感接口配置限流与熔断？
- 是否建立日志脱敏与审计策略？

# 参考资料
- Spring Cloud Gateway 文档：https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/
- Spring Security OAuth2 Resource Server：https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/index.html
- Resilience4j 官方指南：https://resilience4j.readme.io/
