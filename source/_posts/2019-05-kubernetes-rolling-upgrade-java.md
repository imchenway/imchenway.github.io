---
title: Kubernetes 上的 Java 服务滚动升级策略
date: 2019-05-26
lang: zh-CN
tags: ['#DevOps', '#Kubernetes', '#Deployment']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 滚动升级挑战
Java 服务在 Kubernetes 上滚动发布时需关注启动时间、健康探针、流量切换以及依赖的缓存/连接。合理配置可避免级联故障与冷启动风暴。

# 关键配置
- **podDisruptionBudget (PDB)**：限制同时离线的副本数量；
- **readinessProbe**：等待应用完全初始化（JIT、缓存加载）后才接收流量；
- **preStop Hook**：在终止前触发 `sleep/endpoint` 通知，配合 `terminationGracePeriodSeconds` 完成连接排空；
- **maxUnavailable / maxSurge**：控制滚动升级速率。

# Java 特定优化
- 预热：使用 `/actuator/health` 或自定义探针确保 JIT、数据库连接池初始化完毕；
- 优雅停机：Spring Boot `spring.lifecycle.timeout-per-shutdown-phase`，Netty/Vert.x 关闭事件循环；
- GC 友好：使用 jlink 镜像 + 合理堆配置（`MaxRAMPercentage`）。

# 蓝绿 / 金丝雀配合
- 对关键服务，先以金丝雀方式验证新版本；
- 使用 Istio/Linkerd 控制流量百分比；
- 与 Feature Flag 配合可快速回滚功能。

# Observability
- 监控 Pod 创建、Ready 跨越时长；
- 指标：`http_server_requests_seconds`, `jvm_gc_pause_seconds`, `kube_pod_container_status_restarts_total`；
- 日志中增加版本标签，便于对比。

# 自检清单
- 是否为关键服务设置 PDB 与 Pod 优雅终止？
- 是否在探针中考虑应用冷启动需求？
- 是否建立发布回滚流程与指标监控看板？

# 参考资料
- Kubernetes RollingUpdate 文档：https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#rolling-update-deployment
- Spring Boot Kubernetes 指南：https://docs.spring.io/spring-boot/docs/current/reference/html/deployment.html#deployment.kubernetes
- Google SRE: Canarying Releases：https://sre.google/workbook/canarying-releases/
