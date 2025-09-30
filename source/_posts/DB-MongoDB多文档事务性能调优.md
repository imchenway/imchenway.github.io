---
title: MongoDB多文档事务性能调优
date: 2024-01-25
tags: ['#Database']
---

### 本文目录
<!-- toc -->

# 引言
> MongoDB 4.0+ 支持多文档事务，但使用不当会影响性能。本文总结事务模型、性能指标与调优建议。

# 事务模型
- 基于 WiredTiger 的 MVCC；
- 支持 Replica Set（4.0）与 Sharded Cluster（4.2）；
- `session.startTransaction()` -> `commitTransaction()`；
- 操作数量与执行时间有限制。

# 性能指标
- `transactionLifetimeLimitSeconds` 默认 60s；
- 监控 `db.serverStatus().transactions`；
- `Current Operations` 查看事务锁等待；
- `metrics.transactions` 指标。

# 调优策略
- 控制事务粒度，减少操作数量；
- 避免跨分片事务，优先单分片；
- 设置合理的 `writeConcern` 与 `readPreference`；
- 使用偏好逻辑在应用层避免长事务；
- 对热点集合建立合适索引。

# 故障处理
- 事务冲突触发重试：捕获 `TransientTransactionError`；
- 网络中断使用 `commitWithRetry` 模式；
- 结合幂等逻辑确保重试安全。

# 总结
MongoDB 事务适合小范围、一致性需求强的场景。控制事务大小与运行时间，并结合监控与重试逻辑，可以平衡一致性与性能。

# 参考资料
- [1] MongoDB Transactions Guide. https://www.mongodb.com/docs/manual/core/transactions/
- [2] MongoDB Best Practices: Transactions.
