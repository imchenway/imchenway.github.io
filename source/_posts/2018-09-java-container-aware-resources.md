---
title: Java 在容器中的资源感知与调优实践
date: 2018-09-26
tags: ['#Java', '#Performance', '#Containers']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 为何需要容器感知
在 Docker/Kubernetes 中，JVM 默认读取宿主机资源而非容器限制。JDK 10 之前需额外配置，JDK 10+ 已原生支持 cgroup 限制。正确识别 CPU/内存限制可防止 OOM 与调度问题。

# JVM 版本与参数
- JDK 8u191+：`-XX:+UseContainerSupport`（默认开启），`-XX:MaxRAMPercentage` 控制堆占比。
- JDK 11+：`UseContainerSupport` 默认开启，`-XX:InitialRAMPercentage`、`MaxRAMPercentage`、`MinHeapFreeRatio`、`MaxHeapFreeRatio`。
- `-XX:ActiveProcessorCount` 可手动设置 CPU 数量。

# 资源配置建议
- **内存**：设置 `-Xmx` 或使用 `MaxRAMPercentage` 控制堆占比（推荐 50~70%）。
- **CPU**：结合 `CPU limit` 与 `requests`，调整线程池大小与 ForkJoinPool 并行度。
- **TLAB/Metaspace**：关注 `-XX:MaxMetaspaceSize`，避免类加载泄漏。
- **GC**：低内存容器可评估 G1/ZGC；关注 `MaxGCPauseMillis` 与堆布局。

# 监控与探针
- 暴露 `/actuator/metrics` + Micrometer `jvm_memory_used_bytes`、`process_cpu_usage`；
- 使用 Prometheus Node Exporter + cAdvisor 监控容器限制；
- JFR 在容器内可以通过 `jcmd` 收集，需挂载输出目录。

# 自检清单
- 是否确认 JVM 版本支持容器感知？
- 是否设置合理的堆比例与线程池参数匹配容器限制？
- 是否将容器资源指标纳入告警体系？

# 参考资料
- 官方容器支持说明：https://docs.oracle.com/javase/10/tools/java.htm#JSWOR-GUID-13F5D1E2-33AA-4829-83D9-F1AE1BC5E5BE
- OpenJDK Container Support FAQ：https://openjdk.org/jeps/343
- Kubernetes Resource Management 文档：https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
