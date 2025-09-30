---
title: Spring Data Redis多活一致性方案
date: 2022-04-15
tags: ['#Spring']
---

### 本文目录
<!-- toc -->

# 引言
> Redis 在分布式场景中常用于缓存、会话、排行榜等。多活部署下，一致性与冲突处理尤为关键。本文基于 Spring Data Redis，总结多活架构、写入冲突解决与观测手段。

# 多活架构模式
- **双写主主**：各机房写入本地 Redis，异步复制；
- **主从 + 只读从**：写入集中到主机房，其他机房只读；
- **Proxy 路由**：使用 Twemproxy、Codis；
- **Redis Enterprise**：原生多活支持。

# Spring Data Redis 配置
```yaml
spring:
  redis:
    lettuce:
      cluster:
        nodes: cluster-a:6379,cluster-b:6379
      pool:
        max-active: 50
```
- 使用 `Lettuce` 支持异步、基于 Netty；
- 配置 `TopologyRefreshOptions`，动态感知集群变更。

# 一致性策略
1. **Session 同步**：使用 Redis Stream/CDC 复制会话数据，配合 `Spring Session`；
2. **幂等写入**：通过 `SET key value NX` + 版本号，确保最终一致；
3. **冲突解决**：利用 `Lua` 脚本 + Vector Clock；
4. **缓存刷新**：设置合理 TTL，弱一致，结合 MQ 或 Canal。

# 多租户隔离
- prefix 区分租户：`{tenant}:key`；
- 使用 `RedisCacheManager` 自定义缓存名称；
- 对关键业务启用 ACL，防止跨租户访问。

# 观测与回滚
- Micrometer 采集命中率、延迟；
- Redis Slowlog + `latency doctor`；
- 配置 `RedisKeyspaceEvent` 监听，触发告警；
- 备份与回滚：RDB 快照 + AOF 增量。

# 案例
- 某电商跨区域部署，使用 Canal 将 MySQL binlog 投递至 MQ，再由消费端写入 Redis，最后通过 `CacheAside` 保证一致性；
- 使用 `RateLimiter` + Redis 共享限流数据，对冲突写入通过 Lua 原子操作解决。

# 总结
Spring Data Redis 在多活场景下需要配合复制、冲突处理与监控体系。通过幂等设计、异步复制、合理的缓存策略，可以实现高可用且可控的一致性。

# 参考资料
- [1] Spring Data Redis Reference. https://docs.spring.io/spring-data/redis/docs/current/reference/html/
- [2] Redis官方文档. https://redis.io/docs
- [3] Spring Session Data Redis. https://docs.spring.io/spring-session/reference/
