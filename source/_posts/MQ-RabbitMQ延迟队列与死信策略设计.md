---
title: RabbitMQ延迟队列与死信策略设计
date: 2023-06-19
lang: zh-CN
tags: ['#MQ']
---

### 本文目录
<!-- toc -->

# 引言
> RabbitMQ 原生不支持延迟队列，但可以通过 TTL + 死信交换机或 Delayed Message 插件实现。本文总结延迟消息、死信策略设计及运维要点。

# TTL + DLX 模式
- 设置队列 TTL (`x-message-ttl`) 或消息 TTL；
- 过期消息转发至 DLX（Dead Letter Exchange）；
- 消费者监听 DLX 队列，实现延时处理。

# Delayed Message 插件
- 安装 `rabbitmq_delayed_message_exchange`；
- 使用 `x-delayed-message` 交换机，支持 `x-delay` 参数；
- 更灵活，避免创建大量队列。

# 死信策略
- 死信原因：TTL 过期、队列满、被拒绝；
- 设计死信队列监控异常；
- 对不可恢复消息，写入数据库或报警；
- 可使用 DLX 重试机制（延迟重试）。

# 架构图
```mermaid
graph LR
  Producer --> DelayQueue
  DelayQueue -- TTL Expire --> DLX
  DLX --> Consumer
  Consumer -->|处理失败| DLX
```

# 实践建议
- 按延迟粒度划分队列（1m,5m,1h）；
- 控制队列长度，避免大规模堆积；
- 配置死信队列的监控与报警；
- 结合业务幂等，避免重复处理。

# 总结
RabbitMQ 可通过 TTL+DLX 或 Delayed 插件实现延迟与死信策略。设计时需考虑队列规划、监控与幂等，确保可靠。

# 参考资料
- [1] RabbitMQ官方文档：DLX.
- [2] Delayed Message Plugin README.
