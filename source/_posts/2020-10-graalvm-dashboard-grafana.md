---
title: 构建 GraalVM 运行时 Grafana 监控看板
date: 2020-10-26
tags: ['#GraalVM', '#Observability', '#Grafana']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 监控诉求
GraalVM 运行时可通过 Micrometer、JFR、Polyglot 事件暴露 CPU、内存、语言调用情况。将这些指标整合到 Grafana 看板，帮助团队了解多语言服务的资源使用。

# 指标来源
- Micrometer Prometheus：`jvm_memory_used_bytes`, `process_cpu_usage`；
- JFR -> Prometheus（JFR Exporter）：GC 停顿、编译时间；
- Polyglot 自定义指标：`polyglot.invocation.count`；
- Native Image：`--enable-monitoring=prometheus` 暴露 `/metrics`。

# Grafana 推荐面板
- CPU/内存趋势；
- GC 停顿热力图；
- Polyglot 调用 TOP10；
- Native Image 响应时间与错误率。

# 自检清单
- 是否统一指标命名和标签（service, instance, language）？
- 是否关注 Native Image 指标的采样周期？
- 是否在告警中加入 JFR 导出的停顿阈值？

# 参考资料
- GraalVM 监控文档：https://www.graalvm.org/latest/reference-manual/native-image/Monitoring/
- Micrometer 指标参考：https://micrometer.io/docs/ref/prometheus
- Grafana Dashboard Marketplace
