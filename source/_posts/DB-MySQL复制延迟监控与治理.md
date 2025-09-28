---
title: MySQL复制延迟监控与治理方案
date: 2023-12-26
tags: ['#Database']
---

### 本文目录
<!-- toc -->

# 引言
> 主从复制延迟会影响读写分离与故障切换的可用性。本文梳理 MySQL 复制延迟的成因、监控方法与治理策略。

# 延迟成因
- 网络带宽不足、RTT 高；
- 从库 IO/SQL 线程性能瓶颈；
- 大事务、DDL 阻塞；
- 从库资源竞争（IO/CPU）。

# 监控手段
- `SHOW SLAVE STATUS`：`Seconds_Behind_Master`；
- `performance_schema.replication_applier_status_by_worker`；
- MySQL 8.0 `replication_applier` 事件表；
- Prometheus Exporter `mysql_slave_status_seconds_behind_master`；
- 自建延迟探针：在主库写时间戳，从库读取比较。

# 治理策略
1. **多线程复制**：`slave_parallel_workers`、`parallel_type=LOGICAL_CLOCK`；
2. **网络优化**：专线、启用压缩；
3. **拆分大事务**：控制批量操作规模；
4. **延迟监控告警**：设置阈值+自动化处理；
5. **读写路由**：延迟过高时暂时停止从库读；
6. **备库调优**：SSD 磁盘、增加 Buffer Pool。

# 高级特性
- `INNODB_REDO_LOG_SPEED_LIMIT` 控制写入节奏；
- `GROUP_REPLICATION` 解决复制一致性；
- 延迟复制（Delayed Replica）提供灾备。

# 总结
持续监控、合理调优和架构优化是解决复制延迟的关键。通过多线程复制、网络优化及大事务治理，可显著降低延迟风险。

# 参考资料
- [1] Oracle, *MySQL 8.0 Replication Manual*. https://dev.mysql.com/doc/refman/8.0/en/replication-features.html
- [2] Percona Blog: Diagnosing Replication Delay.
