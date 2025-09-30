---
title: Spring Cache 多实现基准对比
date: 2020-08-19
tags: ['#Spring', '#Cache', '#Performance']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 评估目标
Spring Cache 抽象支持 Caffeine、Redis、Hazelcast 等实现。不同缓存的延迟、序列化、过期策略差异会直接影响业务性能，需要通过基准测试科学选择。

# 基准设计
- 使用 JMH 或 Gatling 构建负载：读写比例 80/20；
- 关键指标：平均延迟、P95、命中率、序列化时间；
- 测试场景：本地/分布式、单节点/集群、热点与冷数据。

# 测试示例
```java
@Benchmark
public String caffeineCache() {
    return cacheManager.getCache("user").get("42", () -> loadUser("42"));
}

@Benchmark
public String redisCache() {
    return redisTemplate.opsForValue().get("user:42");
}
```

# 结果分析
- Caffeine：纳秒级，适合热点数据；
- Redis：微秒级，需评估序列化与网络；
- Hazelcast：集群内共享，适合状态同步，但延迟较高；
- 结论应结合容量、可用性、成本。

# 自检清单
- 是否在真实数据规模下测试缓存淘汰策略？
- 是否比较序列化方式（JSON、Kryo、Protostuff）对延迟影响？
- 是否在不同节点/集群拓扑下重复测试？

# 参考资料
- Spring Cache 文档：https://docs.spring.io/spring-framework/docs/current/reference/html/integration.html#cache
- Caffeine Wiki：https://github.com/ben-manes/caffeine/wiki
- Redis 官方基准工具 memtier benchmark
