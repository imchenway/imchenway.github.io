---
title: JVM 对象分配速率调优与监控
date: 2018-08-12
lang: zh-CN
tags: ['#JVM', '#Performance']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 分配速率为何重要
高分配速率会导致频繁 GC、增加停顿与 CPU 消耗。了解分配热点与速率可指导缓存、复用与数据结构优化。

# 监控手段
- **JFR**：事件 `Allocation in new TLAB`、`Allocation outside TLAB`；
- **JVM Metrics**：`jvm_gc_allocation_bytes_total`（Micrometer/Prometheus）；
- **JMap**：`jcmd <pid> GC.heap_info` 观察 Eden/TLAB；
- **Async-profiler**：`-e alloc` 生成分配火焰图。

# 调优策略
1. **对象池/缓存**：复用可重用对象（注意池化成本）。
2. **原始类型优化**：使用 `StringBuilder`、`ThreadLocal` 缓冲、`LongAdder` 等减少临时对象。
3. **TLAB 调整**：`-XX:+PrintTLAB` 观察 TLAB 分配；`-XX:TLABSize` 或 `-XX:-ResizeTLAB` 控制大小。
4. **逃逸分析**：确保 JIT 能够优化为栈上分配；避免共享引用阻断优化。
5. **数据结构选择**：使用 `Int2IntMap` 等 primitive 集合减少包装对象。

# 案例步骤
- 采集 JFR 10 分钟；
- 找到分配热点（例如 JSON 序列化）；
- 针对热点优化（例如启用 Jackson Afterburner、复用缓冲区）；
- 再次采样验证分配速率降低。

# 自检清单
- 是否定期监控分配速率并对异常值告警？
- 是否评估缓存与对象池的可行性？
- 是否利用 JFR/Profiler 定位热点代码路径？

# 参考资料
- JFR Runtime Guide：https://docs.oracle.com/javacomponents/jmc-8/jfr-runtime-guide/jfr-runtime-guide.pdf
- HotSpot VM Options（TLAB）：https://docs.oracle.com/javase/8/docs/technotes/tools/unix/java.html#BABHDABI
- Async-profiler Wiki：https://github.com/async-profiler/async-profiler/wiki
