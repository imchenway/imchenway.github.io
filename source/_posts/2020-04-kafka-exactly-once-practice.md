---
title: Kafka 精确一次（Exactly-Once）语义落地实战
date: 2020-04-26
lang: zh-CN
tags: ['#Kafka', '#Streaming', '#Reliability']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# EOS 能解决什么问题
Kafka 的 Exactly-Once Semantics（EOS）结合幂等生产者、事务性写入与消费者位点提交，解决消息重复与顺序错乱问题。适用于金额、积分等强一致场景。

# 配置步骤
1. **Broker**：`transaction.state.log.replication.factor>=3`、`transaction.state.log.min.isr>=2`；
2. **Producer**：`enable.idempotence=true`、`transactional.id=xxx`；
3. **Consumer**：使用 `isolation.level=read_committed`；
4. **应用逻辑**：
```java
producer.initTransactions();
producer.beginTransaction();
producer.send(record);
producer.sendOffsetsToTransaction(offsets, consumerGroupId);
producer.commitTransaction();
```

# 常见坑位
- 事务超时：`transaction.timeout.ms` 需大于业务处理时间；
- 并发度：一个 `transactional.id` 只允许单线程使用，可通过事务 ID 前缀 + 实例编号解决；
- 写入外部系统：确保外部操作具备幂等或参与同一事务（如写入数据库 + Kafka connect 事务）。

# 监控指标
- `kafka.producer.transaction-abort-rate`、`transaction-start-rate`；
- Broker `TransactionCoordinator` 指标；
- 消费端滞后：确保 `read_committed` 不导致堆积。

# 自检清单
- 是否评估事务时长与并发限制？
- 是否监控事务失败率并捕获 `ProducerFencedException`？
- 是否在外部系统中实现幂等写入或两阶段提交？

# 参考资料
- Kafka 官方文档：https://kafka.apache.org/documentation/#semantics
- Confluent EOS 指南：https://docs.confluent.io/platform/current/ clients/producer.html#transactions
- Kafka Improvement Proposals：KIP-98, KIP-129
