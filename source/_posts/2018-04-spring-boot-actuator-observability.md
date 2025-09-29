---
title: Spring Boot Actuator 与可观测性建设
date: 2018-04-26
tags: ['#Spring', '#Observability']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# Actuator 概览
Spring Boot Actuator 提供健康检查、指标、审计、线程和环境信息等端点，是构建微服务可观测性的基础组件。从 2.x 起采用 Micrometer 作为统一指标接口，支持 Prometheus、Datadog 等后端。

# 启用与配置
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,threaddump,logfile
  endpoint:
    health:
      show-details: always
  metrics:
    tags:
      application: demo-service
```
- `management.endpoints.web.exposure.include` 控制暴露端点；
- `management.endpoint.health.show-details` 设置健康详情；
- 自定义健康指标：实现 `HealthIndicator`。

# Micrometer 指标
- `Counter`、`Gauge`、`Timer`、`Summary`；
- `@Timed`, `MeterRegistry` 自定义指标；
- 常用 tag：`application`、`environment`、`instance`。

# 与 Prometheus 集成
1. 添加依赖：`spring-boot-starter-actuator` + `micrometer-registry-prometheus`；
2. 暴露 `/actuator/prometheus`；
3. Prometheus 配置 `scrape_configs`；
4. Grafana 使用提供的仪表盘模板。

# 日志与追踪
- `loggers` 端点动态调整日志级别；
- 集成 Spring Cloud Sleuth/Zipkin，实现分布式追踪；
- `httptrace` (2.2 起废弃) 可替换为 Spring Cloud Gateway/Zipkin 记录请求链路。

# 自检清单
- 是否限制敏感端点的访问权限与认证？
- 是否设置统一的应用/环境标签、便于聚合指标？
- 是否将 Actuator 融合到告警与可视化体系？

# 参考资料
- Spring Boot Actuator 官方文档：https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html
- Micrometer 文档：https://micrometer.io/docs
- Prometheus Operator & Grafana 参考配置：https://github.com/prometheus-operator/kube-prometheus
