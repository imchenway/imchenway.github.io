---
title: 多活数据库冲突检测与解决
date: 2024-06-03
lang: zh-CN
tags: ['#Database']
---

### 本文目录
<!-- toc -->

# 引言
> 多活数据库部署提高可用性，但跨节点写入可能产生冲突。本文总结冲突检测机制与解决策略。

# 冲突来源
- 数据写入同时发生在不同节点；
- 时钟不同步；
- 业务逻辑缺乏幂等设计。

# 检测机制
- 基于版本号/时间戳（Vector Clock、Lamport）；
- 业务唯一键；
- 事件日志对账；
- 应用层冲突队列。

# 解决策略
- 最终写入胜（Last Writer Wins）；
- 合并策略（CRDT、基于业务规则）；
- 人工审核；
- 防止冲突：写路由、租户隔离、同步复制。

# 实践案例
- 双活 MySQL 使用 GTID + 判断冲突表；
- Cosmos DB/ DynamoDB CRDT 模型；
- 数据对账工具（Debezium 对比）。

# 总结
多活冲突不可避免，需要设计检测与解决流程。通过版本控制、幂等和业务规则，可降低冲突影响。

# 参考资料
- [1] Google Spanner Whitepaper.
- [2] Azure Cosmos DB Conflict Resolution.
