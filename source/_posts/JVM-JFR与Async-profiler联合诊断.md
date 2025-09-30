---
title: JFR与Async-profiler联合诊断
date: 2021-09-17
tags: ['#JVM']
---

### 本文目录
<!-- toc -->

# 引言
> Java Flight Recorder (JFR) 提供低开销的事件采样，而 async-profiler 专注于火焰图与原生栈捕获。将两者结合，可以在生产环境获得可视化、低干扰的性能诊断能力。

# JFR 的优势与限制
## 内置事件模型
- 收集 JVM 事件（GC、JIT、线程、锁竞争）；
- 支持自定义事件与阈值；
- 和 Mission Control 配合分析。

## 低开销原理
JFR 在 JVM 内核实现，采用环形缓冲区、批量写入，默认开销 <1%。但对原生栈、内核栈支持有限。

# async-profiler 特性
- 通过 `perf_event_open`（Linux）或 `dtrace` 捕获原生栈；
- 支持 CPU、Wall Clock、Lock、Memory 采样；
- 生成 flame graph、火焰图、JFR 输出 (`--jfr`)；
- 开销 < 2%，适合在线使用。

# 联合诊断流程
1. **基础监控**：开启 JFR 周期性录制 `jcmd <pid> JFR.start name=profile settings=profile delay=10s duration=120s filename=app.jfr`；
2. **热点确认**：在 JMC 中查看方法采样、锁阻塞、线程活动；
3. **细化原生栈**：对疑点运行 `async-profiler -e cpu -d 60 -f flame.html <pid>`；
4. **对齐时间线**：使用 `async-profiler --jfr` 输出 JFR 文件，与主 JFR 合并 `jfr assemble`；
5. **案例**：在实战中定位 Netty Native Transport 中的 `epoll` 阻塞，将 JFR 的线程阻塞事件与 async-profiler 的 native 栈对齐，快速定位 epoll wait 长时间未唤醒。

# 最佳实践
- JFR 设置 `stackdepth=256` 提高栈采样深度；
- async-profiler 使用 `--begin --end` 控制采样窗口；
- 对容器需挂载 `perf_event_paranoid=1`；
- 使用 `JMC 8` 的 `JFR Analytics` 脚本自动分析；
- 在 CI/CD 中集成“性能回归守门人”：构建后自动运行 5 分钟负载，收集 JFR + flame graph，比较指标。

# 经验总结
结合 JFR 的 JVM 内部指标与 async-profiler 的原生栈，能够覆盖从 Java 层到系统层的性能视角。通过统一时间线和自动化分析脚本，可以让性能诊断成为日常工程实践的一部分。

# 参考资料
- [1] Oracle, "Java Flight Recorder Runtime Guide". https://docs.oracle.com/javase/flight-recorder/
- [2] Async-profiler 官方文档. https://github.com/jvm-profiling-tools/async-profiler
- [3] JEP 328: Flight Recorder. https://openjdk.org/jeps/328
- [4] JDK Mission Control 官方指南. https://docs.oracle.com/javacomponents/jmc-8-0/jmc-user-guide
