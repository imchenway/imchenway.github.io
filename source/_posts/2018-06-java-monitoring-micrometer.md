---
title: Micrometer 指标体系设计：从 Spring 应用到 Prometheus
date: 2018-06-05
tags: ['#Java', '#Observability']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# Micrometer 简介
Micrometer 是 Spring Boot 2.x 默认的指标门面，提供与 Prometheus、InfluxDB、Datadog 等多种监控系统的适配。它提供统一 API 与 Tag 管理。

# 指标类型与 API
- `Counter`：累加计数；
- `Gauge`：瞬时值；
- `Timer`：计时与频率；
- `DistributionSummary`：统计分布；
- `LongTaskTimer`：长任务。 
```java
Counter counter = meterRegistry.counter("order.create", "status", "success");
counter.increment();

Timer timer = meterRegistry.timer("http.call", "method", "GET");
timer.record(() -> httpClient.get());
```

# Tag 规范
- 使用统一标签：`application`、`environment`、`instance`；
- 避免高基数标签（如用户 ID），可使用采样或聚合；
- 与 Prometheus `label` 对齐，便于查询。

# 与 Spring Boot Actuator 集成
```yaml
management:
  metrics:
    export:
      prometheus:
        enabled: true
    tags:
      application: payment-api
```
- 暴露 `/actuator/prometheus`；
- 自定义 `MeterBinder` 注册业务指标。

# Prometheus + Grafana 实践
1. Prometheus `scrape_configs` 拉取 Actuator 指标；
2. Grafana 采用仪表盘模板（Micrometer 官方提供）；
3. 告警规则：错误率、延迟、线程池队列等指标。

# 自检清单
- 是否约定统一的指标命名与标签规范？
- 是否避免高基数标签导致 Prometheus 内存膨胀？
- 是否与业务团队定义核心 SLIs/SLOs？

# 参考资料
- Micrometer 官方文档：https://micrometer.io/docs
- Spring Boot Actuator 文档：https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html
- Prometheus Operator 示例：https://github.com/prometheus-operator/kube-prometheus
