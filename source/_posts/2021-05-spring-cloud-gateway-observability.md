---
title: Spring Cloud Gateway 可观测性实战
date: 2021-05-19
tags: ['#Spring', '#Gateway', '#Observability']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 指标体系
- Micrometer 指标：`spring.cloud.gateway.requests`, `http.status`；
- 结合 Prometheus Exporter，记录每个路由的 QPS、延迟、错误率；
- 通过 `GatewayFilter` 增加 Trace ID、Route ID 标签。

# 日志与追踪
- 使用 `GlobalFilter` 输出 JSON 日志，包含 `traceId`, `routeId`, `elapsed`；
- 集成 Sleuth/Zipkin 追踪上下游调用链；
- 在告警中包含回放链路信息。

# Dashboard
- Grafana 展示路由级别热力图与错误率；
- Kibana 分析请求日志与异常日志；
- 可选：将指标推送至 SLO 面板。

# 自检清单
- 是否为每个路由定义 SLO 并配置告警？
- 是否记录上游/下游 IP 与用户标识（注意脱敏）？
- 是否在 API 发布前运行基准测试验证指标？

# 参考资料
- Spring Cloud Gateway 文档：https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/
- Micrometer 指南：https://micrometer.io/docs
- Sleuth + Zipkin 集成案例
