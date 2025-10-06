---
title: Kafka事务与Exactly Once语义实战
date: 2023-05-10
lang: zh-CN
tags: ['#MQ']
---

### 本文目录
<!-- toc -->

# 引言
> Kafka 在 0.11 引入事务与幂等生产者，使得端到端 Exactly Once 语义（EOS）成为可能。本文总结事务配置、处理流程、常见陷阱以及在流处理场景下的落地经验。

# EOS 基础原理
## 幂等生产者
- 通过 `enable.idempotence=true` 开启，每条消息带 `PID`、`sequence`；
- Broker 以 `(PID, partition, sequence)` 去重；
- 保证单分区、单生产者无重复。

## 事务生产者
- `transactional.id` 标识事务会话；
- `initTransactions` → `beginTransaction` → `send` → `commit/abort`；
- 事务写在 `__transaction_state` 主题；
- 消费者需设置 `isolation.level=read_committed`。

# 流处理中的 EOS
- Kafka Streams 默认开启 EOS（`processing.guarantee=exactly_once_v2`）；
- 使用内部主题 (`changelog`, `repartition`)；
- 事务提交与 offsets 同步提交；
- 状态存储在 RocksDB，事务提交后刷新。

# 配置示例
```properties
bootstrap.servers=kafka:9092
enable.idempotence=true
acks=all
retries=Integer.MAX_VALUE
transactional.id=payment-tx-001
linger.ms=20
batch.size=32768
```

# 实战经验
1. **多分区事务**：同一个事务可以跨多个分区，确保所有分区写入成功；
2. **事务超时**：`transaction.timeout.ms` 需与 broker 配置匹配，避免长事务被中断；
3. **幂等消费**：下游仍需保证幂等（数据库 UPSERT、幂等键）；
4. **故障恢复**：生产者重启需调用 `initTransactions`，由事务日志恢复；
5. **监控**：关注 `TransactionCoordinator` 指标、`kafka.server:type=TransactionCoordinatorMetrics,name=NumSuccessfulTransactions`。

# 常见陷阱
- 没有设置 `acks=all` 会破坏幂等；
- 事务未正确 `commit` 或 `abort`，消费者可能看到未提交数据；
- 使用外部系统时仍需保证幂等，否则 Exactly Once 无法闭环；
- Kafka Streams EOS 模式增加延迟，应结合 SLA 调整 `commit.interval.ms`。

# 总结
Kafka EOS 为金融、支付等强一致场景提供基础。通过正确配置事务生产者、流处理和幂等消费，可以实现端到端的 Exactly Once 处理链路。

# 参考资料
- [1] Kafka 官方文档：Transactional API. https://kafka.apache.org/documentation/#transactions
- [2] Confluent Blog, Exactly Once Semantics.
