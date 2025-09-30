---
title: Java GC 压力测试流程与工具

date: 2020-11-05

tags: ['#JVM', '#GC', '#Testing']

categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 压力测试目标
通过构造高分配、高对象存活率、高并发等场景评估 GC 表现，确认停顿与吞吐是否满足 SLA，为上线调优提供依据。

# 工具组合
- JMH/Java Microbenchmark 构造分配压力；
- Gatling/Locust 对业务接口施压；
- `gc-stress` 工具或自研脚本持续创建大对象；
- JFR、GC 日志、Async-profiler 记录性能指标。

# 流程
1. 确认目标指标（停顿、吞吐、内存）；
2. 构建压测环境，设置 `-Xlog:gc*,gc+heap=debug`；
3. 收集 JFR 与 GC 日志，使用 GCViewer/Excel 分析；
4. 根据结果调整堆大小、回收器、参数；
5. 复测并记录基线。

# 自检清单
- 是否模拟真实的对象生命周期与负载？
- 是否对比多个 GC（Parallel/G1/ZGC）以选择最佳方案？
- 是否在压测结束后清理数据与恢复环境？

# 参考资料
- GCViewer：https://github.com/chewiebug/GCViewer
- JFR Runtime Guide：https://docs.oracle.com/javacomponents/jmc-8/jfr-runtime-guide/jfr-runtime-guide.pdf
- Netflix 性能测试实践
