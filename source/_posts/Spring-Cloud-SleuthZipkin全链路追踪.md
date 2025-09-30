---
title: Spring Cloud Sleuth与Zipkin全链路追踪
date: 2022-07-14
tags: ['#Spring']
---

### 本文目录
<!-- toc -->

# 引言
> 在微服务体系中，全链路追踪是定位性能瓶颈的关键。Spring Cloud Sleuth 与 Zipkin 提供开箱即用的 Trace 收集与展示能力。本文介绍追踪原理、生产化部署与优化策略。

# Sleuth 工作原理
- 在入口处创建 Trace/Span，使用 B3/W3C Header 传播；
- 支持 RestTemplate、WebClient、Feign、RabbitMQ、Kafka；
- 对异步任务、线程池进行上下文传播；
- 与 Micrometer Tracing 集成。

# Zipkin 部署
- 存储后端：MySQL、Elasticsearch、Cassandra；
- Collector：接收 HTTP/GRPC；
- Query Service + UI 展示；
- 可部署在 Kubernetes，并设置数据保留策略。

# 性能优化
- 采样率 `spring.sleuth.sampler.probability` 控制；
- 对高流量接口进行概率采样或基于规则采样；
- 设置 `zipkin.storage.percentiles` 支持延迟统计；
- 使用 Kafka Collector 缓冲高并发数据。

# 深度实践
- 将 Trace ID 注入日志，便于日志追踪；
- 使用 `@NewSpan` 自定义 Span；
- 与 Gateway 集成，记录入口、出口；
- 结合 `Spring Cloud Task` 记录批处理任务。

# Observability 升级
- 升级到 Micrometer Tracing + OTEL Collector，兼容 Zipkin；
- 引入 Service Map，结合 Grafana Tempo/Jaeger；
- 添加业务标签（租户、订单号）提高定位效率。

# 总结
Sleuth + Zipkin 提供了标准化的追踪方案。通过合理采样、可视化平台和上下文传播，能快速发现分布式系统中的瓶颈。

# 参考资料
- [1] Spring Cloud Sleuth Reference. https://docs.spring.io/spring-cloud-sleuth/docs/current/reference/html/
- [2] Zipkin Documentation. https://zipkin.io/pages/quickstart
- [3] Micrometer Tracing Guide. https://micrometer.io/docs/tracing
