---
title: Redis持久化策略RDB与AOF取舍
date: 2024-02-14
lang: zh-CN
tags: ['#Database']
---

### 本文目录
<!-- toc -->

# 引言
> Redis 提供 RDB 与 AOF 两种持久化机制。本文比较两者优缺点，并给出组合使用的实践建议。

# RDB 快照
- 周期性保存内存快照至磁盘；
- 配置 `save 900 1` 等规则；
- 体积小，重启快；
- 断电可能丢失最后一次快照后的数据。

# AOF 日志
- 记录每个写命令，支持 `appendfsync` 同步策略；
- 可重写（Rewrite）压缩文件；
- 数据更安全，体积较大；
- `appendfsync always` 影响性能。

# 组合策略
- 同时启用 RDB+AOF：启动时优先载入 AOF；
- 设置 `appendfsync everysec`、`no-appendfsync-on-rewrite yes`；
- 定期监控 AOF 重写；
- 对内存敏感场景使用 RDB+增量备份。

# 运维要点
- 确保磁盘 IO 足够；
- 配置 `dir` 指向高可靠存储；
- 监控 `aof_current_size`, `rdb_changes_since_last_save`；
- 灾备：定时复制持久化文件至外部存储。

# 总结
RDB 快照和 AOF 日志各有优势，结合使用可平衡性能与数据安全。合理配置同步策略与监控是关键。

# 参考资料
- [1] Redis Persistence Documentation. https://redis.io/docs/interact/programmability/persistence/
