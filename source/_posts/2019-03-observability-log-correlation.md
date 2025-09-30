---
title: 日志、指标、追踪的三栖关联策略
date: 2019-03-26
tags: ['#Observability', '#Tracing', '#Logging']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 三栖可观测性
- **指标 Metrics**：量化服务表现；
- **日志 Logs**：详细事件记录；
- **追踪 Traces**：跨服务调用链路。三者结合可以快速定位故障根因。

# 关联策略
1. **统一 Trace ID**：在请求入口生成 Trace ID，注入到日志与指标标签：
   - Spring Cloud Sleuth、OpenTelemetry 提供自动注入；
   - 日志格式：`%X{traceId}`。
2. **结构化日志**：JSON 输出包含 `traceId`, `spanId`, `service`；
3. **指标标签**：`http_server_requests_seconds{trace_id="..."}`（注意高基数，生产环境只在抽样场景使用）。
4. **日志→追踪跳转**：在 Kibana/Elastic 中配置链接到 Jaeger/Zipkin；
5. **追踪→指标**：Grafana 可嵌入 Tempo/Jaeger 视图，同时展示相关指标面板。

# 工具组合
- OpenTelemetry Collector：统一采集；
- Prometheus + Grafana：指标展示；
- Loki/ELK：日志检索；
- Jaeger/Tempo：追踪存储；
- Micrometer：将 traceId/spanId 注入日志 MDC。 

# 实施步骤
1. 借助 Spring Sleuth/OTEL SDK 设置 Trace Context；
2. 更新日志框架配置（Logback、Log4j2）输出 trace/span 信息；
3. 在 Grafana 创建面板：指标 + 日志 + 追踪；
4. 告警携带 Trace链接，缩短定位时间；
5. 定期演练可观测性流程。 

# 自检清单
- 是否在关键日志中输出 Trace ID 与业务上下文？
- 是否确保日志与追踪聚合时不会产生高基数问题？
- 是否提供跨系统的 Trace 跳转与上下文？

# 参考资料
- OpenTelemetry 文档：https://opentelemetry.io/docs/
- Spring Cloud Sleuth 指南：https://docs.spring.io/spring-cloud-sleuth/docs/current/reference/html/
- Grafana Tempo + Loki 集成示例：https://grafana.com/docs/tempo/latest/getting-started/
