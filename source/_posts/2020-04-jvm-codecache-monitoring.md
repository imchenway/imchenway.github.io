---
title: JVM 代码缓存监控与调优
date: 2020-04-12
tags: ['#JVM', '#JIT', '#CodeCache']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 代码缓存的重要性
HotSpot 将 JIT 编译后的机器码存放在 Code Cache 中。Code Cache 满了会导致 `CodeCache is full`、编译暂停甚至降级为解释执行，引发延迟飙升。因此需要持续监控其使用情况，并根据编译负载调整容量。

# 监控方式
- `-Xlog:codecache+size=info`（JDK 11+）输出使用情况；
- `jcmd <pid> Compiler.codecache` 查看分区（non-profiled、profiled、non-nmethod）；
- JFR 事件 `CodeCacheFull`, `Compilation`；
- Micrometer `jvm.info` + 自定义 JMX 采集 `CodeCacheManager` 指标。

# 调优选项
- `-XX:ReservedCodeCacheSize`：默认 ~240MB，可根据服务规模调大；
- `-XX:InitialCodeCacheSize`：预留初始大小，减少扩容停顿；
- 禁用不必要的编译优化：`-XX:TieredStopAtLevel=1`（调试用）；
- 结合 AOT（JEP 295）或 GraalVM Native Image 减少 JIT 压力。

# 自检清单
- 是否定期检查 Code Cache 使用率并配置告警阈值（80%、90%）？
- 是否评估编译日志中存在的 `CodeCache is full` 问题？
- 是否在变更后（升级 JDK、引入新框架）复测编译压力？

# 参考资料
- HotSpot Code Cache 文档：https://docs.oracle.com/javase/8/docs/technotes/guides/vm/codecache.html
- `jcmd` 工具说明：https://docs.oracle.com/javase/8/docs/technotes/tools/unix/jcmd.html
- JEP 295: Ahead-of-Time Compilation：https://openjdk.org/jeps/295
