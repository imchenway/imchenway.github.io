---
title: RabbitMQ集群高可用与联邦配置
date: 2023-08-18
tags: ['#MQ']
---

### 本文目录
<!-- toc -->

# 引言
> RabbitMQ 集群提供节点内高可用，但跨地域同步需要联邦（Federation）或 Shovel。本文总结集群模式、联邦配置与运维策略。

# 集群模式
- 内部节点共享元数据（Policy、Exchange）；
- 队列只位于一个节点（经典队列）；
- 镜像/Quorum 队列实现副本；
- 集群适合单机房部署。

# 联邦（Federation）
- 通过 Federation 插件链接远程 Broker；
- 配置 Upstream、Policy，将交换机/队列复制；
- 适合跨机房、跨云同步；
- 与 Shovel（数据复制工具）对比。

# 配置示例
```shell
rabbitmq-plugins enable rabbitmq_federation rabbitmq_federation_management
# 定义 upstream
rabbitmqctl set_parameter federation-upstream upstream-name '{"uri":"amqp://remote"}'
# 应用策略
rabbitmqctl set_policy ha-fed "^fed\." '{"federation-upstream-set":"all"}'
```

# 运维要点
- 监控 Federation 链路延迟与失败；
- 配置带宽限制，避免占满网络；
- 对联邦数据进行过滤（只同步关键数据）；
- 定期演练故障切换。

# 总结
RabbitMQ 集群适合单机房，跨地域需使用 Federation/Shovel。合理规划拓扑与监控可提升整体可靠性。

# 参考资料
- [1] RabbitMQ Federation Guide.
- [2] RabbitMQ Shovel Plugin.
