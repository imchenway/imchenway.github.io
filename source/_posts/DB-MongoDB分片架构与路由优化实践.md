---
title: MongoDB分片架构与路由优化实践
date: 2024-01-15
tags: ['#Database']
---

### 本文目录
<!-- toc -->

# 引言
> MongoDB 分片（Sharding）支持水平扩展，但需要精心设计分片键与路由策略。本文总结分片架构、负载均衡与优化实践。

# 分片架构
- Shard：数据存储节点，可为副本集；
- Config Server：存储元数据；
- Mongos：路由进程；
- Chunk：数据分片单位。

# 分片键选择
- 均匀分布，避免热点；
- 支持范围查询或哈希分片；
- 采用复合键结合业务维度；
- 分片键不可修改。

# 路由优化
- 使用 `hashed` 分片键避免热点；
- Chunk 迁移：`balancer` 自动均衡，必要时手动；
- Query 需包含分片键，避免广播；
- 监控 `chunks` 分布、`balancer` 状态。

# 实战建议
- 分析 `mongostat`, `serverStatus`，关注 `opcounters`；
- 对热点写入使用预分配 Chunk；
- 使用 Tag-aware Sharding 结合地域；
- 对大集群启用分片侦测与自动缩容策略。

# 总结
合理的分片键与路由策略是 MongoDB 分片性能的关键。通过监控与 Chunk 管理可确保数据均衡与高可用。

# 参考资料
- [1] MongoDB Manual: Sharding Introduction. https://www.mongodb.com/docs/manual/sharding/
- [2] MongoDB Production Notes.
