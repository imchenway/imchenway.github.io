---
title: Redis Cluster 热点 Key 治理策略
date: 2020-09-12
lang: zh-CN
tags: ['#Redis', '#Cluster', '#Performance']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 热点 key 风险
热点 key 导致单个分片 CPU 飙升、延迟增加、请求排队。需要从检测、缓解、架构优化三个层面进行治理。

# 检测方法
- 采集 `INFO commandstats` 与 slowlog；
- 使用 Keyspace 访问统计脚本收集 QPS；
- 在客户端（Lettuce、Redisson）记录 key 命中热点并上报 Prometheus。

# 缓解策略
- 缓存分片：对热点 key 仅缓存到本地 Caffeine；
- Key 拆分：针对计数类 key 使用 `shardKey + hash`；
- 候补副本：通过读写分离缓解读压力；
- Lua 脚本或 HyperLogLog 统计减少写入。 

# 架构优化
- 使用 Redis Cluster 的 `hash tag` 控制热点扩散；
- 引入 Proxy（Twemproxy、Predixy）实现 `Multi-Key` 批量；
- 监控热度变化并动态调整 TTL。

# 自检清单
- 是否建立热点 key 监控与报警？
- 是否对热点 key 有自动化降级策略？
- 是否定期回顾业务模型，避免单 key 聚集？

# 参考资料
- Redis Cluster 文档：https://redis.io/docs/interact/cluster/
- 阿里云 Redis 热点治理白皮书
- Netflix EVCache 热点处理经验
