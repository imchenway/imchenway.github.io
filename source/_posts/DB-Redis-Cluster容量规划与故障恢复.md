---
title: Redis Cluster容量规划与故障恢复
date: 2024-02-04
lang: zh-CN
tags: ['#Database']
---

### 本文目录
<!-- toc -->

# 引言
> Redis Cluster 通过分片实现扩展。容量规划与故障恢复直接影响高可用。本文总结节点规划、故障处理与监控体系。

# 容量规划
- 计算数据量：键数×平均值大小 + Overhead；
- 预留副本与冗余，推荐 3 主 3 从；
- Slot 分布均衡，避免热点；
- 使用 Cluster Manager 或 `redis-cli --cluster create`。

# 故障恢复
- 主节点故障：从节点自动提升；
- 网络分区：大多数党保持可用；
- 手动故障转移：`redis-cli -c cluster failover`；
- 注意复制延迟与 `min-replicas-to-write`。

# 监控指标
- `cluster info`：`cluster_state`, `slots_assigned`；
- 延迟：`latency latest`；
- Redis Exporter 指标：内存、命中率、复制偏移；
- Sentinel 或自研监控故障。

# 运维建议
- 定期检查 slot 分布，执行 `redis-cli --cluster rebalance`；
- 控制命令超时时间，防止长任务阻塞；
- 使用 RDB/AOF 做备份；
- 对大键、热键进行治理。

# 总结
Redis Cluster 需要精细的容量规划与故障演练。通过合理的节点配置、监控与备份策略，可保证高可用与性能。

# 参考资料
- [1] Redis Cluster Specification. https://redis.io/docs/interact/cluster-tutorial/
- [2] Redis Operability Guide.
