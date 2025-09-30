---
title: RabbitMQ Quorum队列与镜像队列比较
date: 2023-06-29
tags: ['#MQ']
---

### 本文目录
<!-- toc -->

# 引言
> RabbitMQ 3.8 引入 Quorum Queue（基于 Raft），替代传统镜像队列（Mirrored Queue）。本文比较两者在一致性、可靠性与运维方面的差异。

# 架构差异
- **镜像队列**：Master + Mirrors，基于 Erlang 分布；
- **Quorum 队列**：多副本 + Raft；
- Quorum 提供更强一致性，可自动故障切换。

# 特性对比
| 维度 | 镜像队列 | Quorum 队列 |
| --- | --- | --- |
| 一致性 | 最终一致 | 强一致（Raft） |
| 复制机制 | 同步/异步镜像 | Raft 日志复制 |
| 故障恢复 | 手工配置 | 自动选举 |
| 延迟 | 较低 | 略高 |
| 适用场景 | 读多写少 | 核心业务、强一致 |

# 配置示例
```shell
rabbitmq-plugins enable rabbitmq_raft
# 定义策略
rabbitmqctl set_policy ha-all "^critical\." '{"queue-type":"quorum"}'
```

# 迁移建议
- 新项目优先使用 Quorum；
- 旧镜像队列逐步迁移，评估延迟；
- 注意磁盘需求，Quorum 队列写放大更大；
- 监控 `raft_wal`、`quorum_queue_len` 等指标。

# 总结
Quorum 队列通过 Raft 提供更高可靠性，但需要平衡延迟与资源。对于关键任务队列，推荐使用 Quorum；非核心场景可继续使用经典队列。

# 参考资料
- [1] RabbitMQ Quorum Queues Guide.
- [2] RabbitMQ Mirrored Queues Deprecation Notice.
