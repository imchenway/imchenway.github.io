---
title: 从 OpenTracing 向 OpenTelemetry 迁移指南
date: 2019-06-26
lang: zh-CN
tags: ['#Observability', '#Tracing', '#OpenTelemetry']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 为什么迁移
OpenTelemetry (OTel) 将 OpenTracing 与 OpenCensus 合并，提供统一的指标、日志、追踪数据模型。迁移可减少重复集成、享受更丰富的 SDK 与后端支持。

# 迁移步骤
1. **清点现状**：列出现有 OpenTracing 注解、Tracer 实现、指标系统。
2. **引入 OTel SDK**：
```xml
<dependency>
  <groupId>io.opentelemetry</groupId>
  <artifactId>opentelemetry-sdk</artifactId>
  <version>1.37.0</version>
</dependency>
```
3. **桥接层**：使用 `opentelemetry-opentracing-shim` 保持旧版 API，逐步迁移；
4. **配置 Exporter**：Jaeger、Zipkin、OTLP、Tempo；
5. **替换 Tracer 注入**：由 `GlobalOpenTelemetry` 获取 Tracer；
6. **指标与日志**：启用 OTel Metrics API，整合 Micrometer/Tlogs。

# 代码迁移示例
```java
Tracer tracer = GlobalOpenTelemetry.getTracer("com.example.app");
try (Scope scope = tracer.spanBuilder("processOrder").startSpan().makeCurrent()) {
    // business logic
}
```

# 常见问题
- **上下文传递**：使用 `ContextPropagators` 替换旧的 `Tracer.inject/extract`；
- **采样策略**：配置 `TraceIdRatioBasedSampler`；
- **资源属性**：统一设置 `service.name`、`deployment.environment`；
- **性能**：使用批量 Exporter，调整批量大小与超时时间。

# 自检清单
- 是否确保所有 Span 都附带 service/environment 标签？
- 是否更新部署脚本/配置使 OTLP Collector 可用？
- 是否设置采样率与告警阈值防止存储爆炸？

# 参考资料
- OpenTelemetry Java 文档：https://opentelemetry.io/docs/instrumentation/java/
- OTLP Collector：https://opentelemetry.io/docs/collector/
- OpenTracing → OTel 迁移指南：https://opentelemetry.io/docs/migration/opentracing/
