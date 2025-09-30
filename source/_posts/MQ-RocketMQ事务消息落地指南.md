---
title: RocketMQ事务消息落地指南
date: 2023-06-09
tags: ['#MQ']
---

### 本文目录
<!-- toc -->

# 引言
> RocketMQ 事务消息通过半消息与事务回查机制，实现本地事务与消息发送的最终一致。本文总结使用流程、状态管理与故障处理。

# 工作流程
1. 发送半消息（Prepared Message）；
2. 执行业务本地事务；
3. 根据事务结果提交或回滚；
4. Broker 未收到结果时发起回查。

# 实现步骤
- 使用事务生产者 `TransactionMQProducer`；
- 实现 `TransactionListener`：`executeLocalTransaction`, `checkLocalTransaction`；
- 在本地事务中记录状态（如数据库表）。

# 状态管理
- 建议创建 `transaction_log` 表，记录 `messageId`, `bizId`, `status`；
- 在回查时查询状态，返回 `COMMIT`, `ROLLBACK`, `UNKNOWN`；
- 防止重复提交：使用幂等键或布尔字段。

# 故障处理
- 本地事务成功但提交失败：回查时补偿提交；
- 本地事务失败但提交成功：根据状态回滚；
- 回查超时需排查网络或 Broker 问题；
- 保留回查日志，便于审计。

# 最佳实践
- 事务消息不适合高频场景，需评估性能；
- 保证事务执行时间短，减小锁范围；
- 使用幂等消费，避免下游重复；
- 监控 `TransactionCheckNum`、`TransactionRollbackTimes`。

# 总结
RocketMQ 事务消息适合强一致场景，通过规范的事务日志、回查机制与监控，可实现业务与消息最终一致。

# 参考资料
- [1] RocketMQ 事务消息文档.
- [2] 阿里中间件团队实践分享。
