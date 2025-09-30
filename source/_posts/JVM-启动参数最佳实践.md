---
title: JVM启动参数最佳实践
date: 2021-11-06
tags: ['#JVM']
---

### 本文目录
<!-- toc -->

# 引言
> JVM 参数决定了堆大小、GC 策略、JIT 行为，是生产稳定性的基础。本文总结常用参数组合及在容器、微服务环境下的配置建议。

# 内存与 GC 参数
- `-Xms/-Xmx`：固定堆大小，减少扩容抖动；
- `-XX:MaxRAMPercentage`、`-XX:InitialRAMPercentage`：适用于容器；
- `-XX:+UseG1GC`/`-XX:+UseZGC`：选择 GC；
- `-XX:MaxGCPauseMillis`：GC 延迟目标；
- `-XX:+ParallelRefProcEnabled`：并行处理引用队列。

# JIT 与编译
- `-XX:+TieredCompilation`、`-XX:TieredStopAtLevel=1`：调节预热；
- `-XX:CICompilerCount`：控制编译线程数；
- `-XX:+PrintCompilation`、`-XX:+UnlockDiagnosticVMOptions`：调试。

# 诊断与可观测
- `-XX:+UnlockCommercialFeatures -XX:+FlightRecorder`（JDK 11 前）；
- `-XX:+HeapDumpOnOutOfMemoryError`；
- `-XX:+ExitOnOutOfMemoryError`；
- `-Xlog:gc*,safepoint:file=gc.log:time,uptimemillis`；
- `-XX:StartFlightRecording=duration=5m,filename=app.jfr`。

# 容器环境
- 必须开启 `UseContainerSupport`（JDK 10+ 默认）；
- 使用 `-XX:ActiveProcessorCount` 控制线程数；
- 结合 `cgroup` 资源限制；
- 对于 Kubernetes，建议在 Helm Chart 中集中管理参数；
- 预热脚本：`java -Xshare:on -XX:TieredStopAtLevel=1`。

# 组合示例
```
JAVA_OPTS="-Xms4g -Xmx4g -XX:+UseG1GC -XX:MaxGCPauseMillis=200 \
 -XX:+HeapDumpOnOutOfMemoryError -XX:+ExitOnOutOfMemoryError \
 -XX:StartFlightRecording=duration=10m,filename=/logs/app.jfr \
 -Xlog:gc*,safepoint:file=/logs/gc.log:tags,uptimemillis"
```

# 总结
JVM 参数配置要结合硬件、业务形态、容器限制综合考虑。通过模板化配置、自动化校验，可以让调优成为可复制的能力。

# 参考资料
- [1] Oracle, "Java Command-Line Reference". https://docs.oracle.com/javase/8/docs/technotes/tools/unix/java.html
- [2] OpenJDK JEP 343: Packaging Tool. https://openjdk.org/jeps/343
- [3] Red Hat, "Optimizing Java in Containers". https://access.redhat.com
