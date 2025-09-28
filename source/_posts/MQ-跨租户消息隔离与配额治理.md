---
title: 跨租户消息隔离与配额治理
date: 2023-10-17
tags: ['#MQ']
---

### 本文目录
<!-- toc -->

# 引言
> SaaS 平台需要确保不同租户的消息隔离与配额控制。本文介绍在 Kafka、RabbitMQ、RocketMQ 中的多租户设计与治理策略。

# 隔离策略
- Kafka：使用独立 Topic、ACL、命名空间（KIP-500 future）；
- RabbitMQ：每租户 VHost；
- RocketMQ：Topic+Group 命名规范；
- 配合 Gateway/Proxy 校验租户信息。

# 配额治理
- 限制 Topic 生产/消费速率；
- 监控租户消息堆积、失败率；
- 定期评估配额，超限告警；
- 提供自助申请和审批流程。

# 审计
- 日志记录租户操作；
- 保留消息轨迹用于纠纷处理；
- 与计费系统集成；
- 定期导出报告。

# 总结
多租户消息治理需要隔离、配额与审计的组合，确保平台安全与公平使用。

# 参考资料
- [1] Confluent Multi-Tenancy Whitepaper.
- [2] RabbitMQ VHost Best Practices.
