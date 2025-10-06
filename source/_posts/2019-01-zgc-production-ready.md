---
title: ZGC 升级实战：从测试到生产
date: 2019-01-12
lang: zh-CN
tags: ['#JVM', '#GC', '#ZGC']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 升级背景
JDK 15 后 ZGC 转正（JEP 377），支持 Linux、Windows、macOS。相比 G1，ZGC 提供亚毫秒停顿，对大型堆和延迟敏感服务更友好。

# 升级准备
1. **JDK 版本**：确认迁移至 JDK 17 或更新；
2. **兼容性**：快速验证代码与依赖对新 JDK 的兼容；
3. **堆规划**：设置 `-Xms` = `-Xmx`，建议预留 30% 空间；
4. **参数**：`-XX:+UseZGC -XX:ZCollectionInterval=60s -XX:ZUncommitDelay=300` 等。

# 测试流程
- **性能基线**：记录 G1 下的停顿、吞吐、CPU；
- **压测环境**：使用相同数据集，观察 `ZCollectionCycle`, `ZAllocationStall`；
- **Profiling**：Async-profiler + JFR 分析分配热点；
- **故障演练**：模拟流量波动、内存峰值。

# 生产上线
- 灰度发布：先在非核心服务验证；
- 监控指标：`jvm_gc_pause_seconds`, `process_resident_memory_bytes`, `cpu_usage`; Grafana 仪表板对比 G1 与 ZGC；
- 日志分析：`-Xlog:gc*,safepoint:file=zgc.log`。

# 常见问题
- `ZAllocationStall`：分配速度过快，调整堆大小或降低流量；
- 大对象处理：ZGC 对 Humongous 对象支持良好，但仍应优化数据结构；
- 容器资源：确保 cgroup 感知开启，使用 `MaxRAMPercentage` 调整堆。

# 自检清单
- 是否完成 G1 与 ZGC 指标对比？
- 是否设置针对 ZGC 的监控与告警？
- 是否制定回滚计划与灰度策略？

# 参考资料
- JEP 377: ZGC: A Scalable Low-Latency Garbage Collector：https://openjdk.org/jeps/377
- ZGC 调优指南：https://docs.oracle.com/en/java/javase/17/gctuning/z-garbage-collector.html
- Azul/ZGC 实践分享：https://www.azul.com/blog/zgc-production-ready/
