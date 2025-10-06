---
title: JVM容器感知与资源隔离
date: 2022-02-04
lang: zh-CN
tags: ['#JVM']
---

### 本文目录
<!-- toc -->

# 引言
> 在容器环境中，JVM 需要感知 cgroup 限制，以正确配置堆大小、线程数和 GC 行为。本文介绍 JVM 容器支持演进、关键参数与资源隔离实践。

# 容器感知的演变
- JDK 8u131 之后引入 `UseCGroupMemoryLimitForHeap`；
- JDK 10 JEP 343 默认支持 cgroup v1；
- JDK 14 JEP 358 完整支持 cgroup v2；
- 通过 `/sys/fs/cgroup` 读取 `memory.limit_in_bytes`、`cpu.quota`。

# 关键参数
- `-XX:InitialRAMPercentage`、`-XX:MaxRAMPercentage`：按总内存百分比分配堆；
- `-XX:MinHeapFreeRatio`：控制堆收缩；
- `-XX:ActiveProcessorCount`：限制可见 CPU 数量；
- `-XX:MaxDirectMemorySize`：限制直接内存；
- `-XX:+UseContainerSupport`（JDK 10+ 默认）。

# 资源隔离策略
- 为每个 Pod 设定 `requests/limits`，避免超卖；
- JVM 堆大小 = `limit` * 60~70%，预留本地内存；
- 控制编译线程、GC 线程数量，与 CPU quota 匹配；
- 使用 cgroup `blkio` 限制 I/O；
- 启用 `Native Memory Tracking` 监控 native 内存。

# 实战经验
- 将 G1 `-XX:G1HeapRegionSize` 与容器大小匹配，防止 region 过大；
- 在 K8s HPA 中使用 CPU、延迟指标，结合 JVM 自适应策略；
- 对 P99 延迟敏感的服务，升级到 ZGC + 容器感知；
- 使用 `jcmd VM.system_properties` 验证容器配置。

# 总结
容器感知能力让 JVM 更好地在云原生环境运行。通过正确配置堆、线程与 GC 参数，并结合 cgroup 监控，可以实现资源隔离与性能的双赢。

# 参考资料
- [1] JEP 343: Packaging Tool. https://openjdk.org/jeps/343
- [2] JEP 353: Reimplement the Legacy Socket API.（容器补丁）
- [3] OpenJDK, "Containers and the JVM" 文档. https://openjdk.java.net/groups/hotspot/docs/ContainerSupport.html
- [4] Red Hat, "Running Java in OpenShift".
