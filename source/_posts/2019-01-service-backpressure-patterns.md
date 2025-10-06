---
title: 服务端背压与流控模式：令牌桶、漏桶与响应式
date: 2019-01-26
lang: zh-CN
tags: ['#Java', '#Resilience', '#Backpressure']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 背压的意义
背压用于缓解上下游速度不匹配，防止服务过载。实现方式包括限流、排队、丢弃、降级，以及响应式流的请求反馈机制。

# 限流算法
- **令牌桶**：以恒定速率生成令牌，可突发；
- **漏桶**：固定速率流出，平滑流量；
- **滑动窗口**：统计窗口内请求数量；
- **二次确认**：客户端/网关按照容量反馈。

# Java 实现示例
```java
class TokenBucketLimiter {
    private final long capacity;
    private final long refillTokens;
    private final long refillIntervalNanos;
    private long tokens;
    private long lastRefillTimestamp;

    TokenBucketLimiter(long capacity, long refillTokens, Duration refillInterval) {
        this.capacity = capacity;
        this.refillTokens = refillTokens;
        this.refillIntervalNanos = refillInterval.toNanos();
        this.tokens = capacity;
        this.lastRefillTimestamp = System.nanoTime();
    }

    synchronized boolean tryAcquire() {
        refill();
        if (tokens > 0) {
            tokens--;
            return true;
        }
        return false;
    }

    private void refill() {
        long now = System.nanoTime();
        long elapsed = now - lastRefillTimestamp;
        if (elapsed > refillIntervalNanos) {
            long tokensToAdd = (elapsed / refillIntervalNanos) * refillTokens;
            tokens = Math.min(capacity, tokens + tokensToAdd);
            lastRefillTimestamp = now;
        }
    }
}
```

# 响应式背压
- 使用 Reactor、Mutiny、Akka Streams 等实现 `request(n)`；
- 微服务间通过 RSocket、gRPC Flow Control 实现端到端背压；
- 结合 Hystrix/Resilience4j 限流与熔断。

# 监控指标
- 请求排队长度、拒绝率；
- 线程池队列深度、等待时间；
- 成功/失败速率，对应 SLO；
- Micrometer + Prometheus 记录 `rate_limited_requests_total`。

# 自检清单
- 是否区分入站与出站背压策略？
- 是否对拒绝或降级进行日志与告警？
- 是否结合错误预算与熔断策略联动？

# 参考资料
- Google Site Reliability Engineering (SRE) - Load Shedding：https://sre.google/sre-book/load-shedding/
- Netflix 技术博客 - Rate Limiting：https://netflixtechblog.com/rate-limiting-at-netflix-4e2b7eab679c
- Project Reactor 背压文档：https://projectreactor.io/docs/core/release/reference/#_backpressure
