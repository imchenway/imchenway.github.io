---
title: MySQL InnoDB Cluster与MGR容错机制
date: 2024-01-05
lang: zh-CN
tags: ['#Database']
---

### 本文目录
<!-- toc -->

# 引言
> MySQL InnoDB Cluster 基于 Group Replication（MGR）实现高可用与一致性。本文分析 MGR 的组件、容错流程以及部署要点。

# 架构组成
- MySQL Router：连接路由；
- MySQL Shell：集群管理；
- InnoDB Cluster：多主或单主拓扑；
- Group Replication：Paxos 风格一致性协议。

# 容错机制
- 写入事务在多数节点提交 (`group_replication_group_seeds`)；
- single-primary 模式自动选主；
- 自动故障检测与重连；
- 网络分区时少数派自动退出。

# 配置关键项
```sql
SET GLOBAL group_replication_group_name='uuid';
SET GLOBAL group_replication_start_on_boot=ON;
SET GLOBAL group_replication_bootstrap_group=OFF;
SET GLOBAL group_replication_enforce_update_everywhere_checks=ON;
```
- 使用 MySQL Shell `dba.createCluster()` 快速部署；
- 建议启用 `group_replication_consistency=EVENTUAL|BEFORE_ON_PRIMARY_FAILOVER` 按需求调整。

# 监控与运维
- `performance_schema.replication_group_members` 查看节点状态；
- MySQL Router 监控连接；
- 定期演练故障切换；
- 备份策略：逻辑/物理 + GTID。

# 总结
InnoDB Cluster 提供自动化的高可用能力。掌握 MGR 配置、故障处理与监控，能显著提升数据库可靠性。

# 参考资料
- [1] Oracle, *MySQL InnoDB Cluster User Guide*. https://dev.mysql.com/doc/mysql-shell/8.0/en/mysql-innodb-cluster.html
- [2] Oracle, *Group Replication*. https://dev.mysql.com/doc/refman/8.0/en/group-replication.html
