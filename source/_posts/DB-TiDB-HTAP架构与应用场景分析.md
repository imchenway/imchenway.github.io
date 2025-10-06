---
title: TiDB HTAP架构与应用场景分析
date: 2024-03-25
lang: zh-CN
tags: ['#Database']
---

### 本文目录
<!-- toc -->

# 引言
> TiDB 通过 TiKV + TiFlash 实现 HTAP（Hybrid Transactional and Analytical Processing）。本文介绍架构、查询加速与适用场景。

# 架构
- TiDB Server：SQL 层；
- TiKV：行存储（事务）；
- TiFlash：列存储（分析）；
- PD：集群调度、元数据；
- Raft 复制保证一致性。

# HTAP 特性
- 行列双写：写入 TiKV 同步到 TiFlash；
- MPP 引擎：TiFlash 负责分析查询；
-智能优化器根据代价选择执行计划；
- ACID + 实时分析兼顾。

# 应用场景
- 需要实时分析的在线业务（实时报表）；
- 替代传统 OLTP+OLAP 分库方案；
- 中等规模分析（TB 级）；
- 需要弹性扩展。

# 调优建议
- 合理设置副本数 `pd-ctl config set replication`；
- 对热点数据使用分区表；
- 监控 TiFlash 同步延迟；
- 结合资源隔离（资源组）提高公平性。

# 总结
TiDB 的 HTAP 架构适合实时分析与事务融合的场景。通过 TiFlash、MPP 与资源治理，可实现灵活的混合负载处理。

# 参考资料
- [1] PingCAP Docs: TiDB HTAP. https://docs.pingcap.com/tidb/stable/tidb-overview
- [2] TiDB Whitepaper.
