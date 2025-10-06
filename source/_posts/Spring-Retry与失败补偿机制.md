---
title: Spring Retry与失败补偿机制
date: 2022-08-13
lang: zh-CN
tags: ['#Spring']
---

### 本文目录
<!-- toc -->

# 引言
> 分布式系统中，不可避免会出现超时、临时失败。Spring Retry 提供声明式重试，而补偿策略则保证业务最终一致。本文介绍如何结合 Retry、CircuitBreaker、补偿任务构建健壮系统。

# Spring Retry 基础
- 注解：`@Retryable`、`@Recover`；
- 策略：`SimpleRetryPolicy`、`ExponentialBackOffPolicy`；
- 与 AOP、异步任务集成；
- 支持 `RetryTemplate` 编程式调用。

# 重试设计要点
- 针对可恢复异常：网络抖动、临时不可用；
- 避免对幂等性差的操作自动重试；
- 配合 `CircuitBreaker` 快速失败；
- 将重试指标暴露用于监控。

# 补偿机制
1. **Transactional Outbox**：在同一事务写入アウトボックス，异步补偿；
2. **补偿任务**：Spring Batch/Quartz 定期扫描失败记录；
3. **人机协同**：提供后台操作界面，支持人工介入；
4. **幂等设计**：通过业务幂等键、版本号保证重复执行安全。

# 实现示例
```java
@Retryable(value = TimeoutException.class,
           maxAttempts = 3,
           backoff = @Backoff(delay = 500, multiplier = 2))
public void invokePayment(PaymentRequest request) { ... }

@Recover
public void recover(Throwable throwable, PaymentRequest request) {
    compensationService.enqueue(request);
}
```
- `compensationService` 将失败请求写入队列或表。

# 监控与报警
- Micrometer 记录重试次数、失败率；
- 对补偿任务的堆积设告警；
- 在日志中记录 `retryAttempt`、`traceId`；
- 对接 Prometheus + Alertmanager。

# 实战经验
- 支付通道调度使用 Retry + Outbox，确保交易状态最终一致；
- 合同签约系统结合补偿任务与人工审核；
- 在高并发场景，重试间隔需指数退避，避免雪崩。

# 总结
Spring Retry 提供快速的失败重试能力，但必须配合补偿机制、幂等设计与监控，才能在复杂分布式场景下保持一致性与稳定性。

# 参考资料
- [1] Spring Retry Reference. https://docs.spring.io/spring-retry/docs/current/reference/html/
- [2] Spring Batch User Guide. https://docs.spring.io/spring-batch/docs/current/reference/html/
- [3] Transactional Outbox Pattern. https://microservices.io/patterns/data/transactional-outbox.html
