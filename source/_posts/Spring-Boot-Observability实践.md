---
title: Spring Boot Observability（Micrometer+OTel）实战
date: 2022-06-14
tags: ['#Spring']
---

### 本文目录
<!-- toc -->

# 引言
> Spring Boot 3 引入 Observability 支持，整合 Micrometer 与 OpenTelemetry。本文介绍如何构建指标、日志、链路统一观测体系，满足生产级可观测需求。

# Observability 基础
- Micrometer 统一指标 API；
- OpenTelemetry 提供 Trace、Metrics、Logs 标准；
- Spring Boot 3 `spring-boot-actuator` 默认集成；
- 通过 `ObservationRegistry` 编织指标与日志。

# 实施步骤
1. 引入依赖：`micrometer-registry-prometheus`、`opentelemetry-exporter-otlp`；
2. 配置采集端点：`management.endpoints.web.exposure.include=health,info,prometheus`；
3. Trace 导出：`management.otlp.tracing.endpoint=http://otel-collector:4317`；
4. 使用 `Observation` API 标记关键业务；
5. 结合 `LoggingSystem` 输出 JSON 日志。

# 指标设计
- 技术指标：HTTP 响应时间、JVM、线程池、数据库；
- 业务指标：订单创建成功率、支付失败数；
- 通过 `MeterFilter` 添加租户标签；
- 使用 `LongTaskTimer` 观察长耗时任务。

# 链路追踪
- 使用 `spring-cloud-sleuth-otel` 或 `micrometer-tracing`；
- TraceContext 通过 B3/W3C 传播；
- Gateway / Feign 客户端自动注入 traceid；
- 使用 Grafana Tempo 或 Jaeger 展示。

# 日志与 Trace 关联
- 日志 MDC 包含 `traceId`、`spanId`；
- 输出 JSON 格式，供 ELK 解析；
- 使用 `Logback` encoder 统一格式。

# 实战经验
- 微服务平台通过 Observability API 构建统一监控 SDK，开发者只需注解 `@Observed` 即可采集；
- 对批处理任务，根据 Step 名称记录指标；
- 在故障演练时，通过 Trace 快速定位下游依赖。

# 总结
Spring Boot Observability 将 Micrometer 与 OTel 融合，简化了指标与追踪的收集。通过全链路观测，可以快速诊断性能与稳定性问题。

# 参考资料
- [1] Spring Boot 3 Reference, Observability. https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html#actuator.observability
- [2] Micrometer Tracing. https://micrometer.io/docs/tracing
- [3] OpenTelemetry Specification. https://opentelemetry.io/docs/
