---
title: 结合 Async-profiler 与 JFR 进行 CPU + 分配联合分析
date: 2018-10-12
lang: zh-CN
tags: ['#JVM', '#Profiling']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 背景
单独分析 CPU 或内存分配可能无法完整解释性能问题。结合 Async-profiler (采样) 与 JFR (事件) 可以从多个维度观测热点，帮助定位 CPU 瓶颈、内存压力与 GC 协作问题。

# 工作流
1. **JFR 采集**：`jcmd PID JFR.start duration=5m filename=profile.jfr settings=profile`。
2. **Async-profiler**：
   ```bash
   ./profiler.sh -d 300 -e cpu -f cpu.html <pid>
   ./profiler.sh -d 300 -e alloc -f alloc.html <pid>
   ```
3. **交叉分析**：
   - CPU 火焰图定位热点方法；
   - 分配火焰图识别高分配代码；
   - JFR 确认线程状态、GC 事件、锁竞争。

# 结合指标
- 若 CPU 火焰图显示大量 `HashMap.resize`，而 JFR 显示 `Allocation in new TLAB` 飙升，则可确认哈希表扩容导致分配压力；
- 若 JFR 显示 GC 停顿与 Async-profiler `wall` 事件一致，说明停顿影响响应时间；
- 使用 `jfr print --events allocation-in-new-tlab profile.jfr` 获取定量指标。

# 自动化与脚本
- 编写脚本同时启动 JFR 与 profiler，并归档结果；
- 将火焰图与 JFR 报告上传至知识库，形成案例库；
- 在 CI 环境运行短时间采样，监控性能回归。

# 自检清单
- 是否在相同时间段采集多种数据以便对比？
- 是否根据分析结果实施代码或参数优化？
- 是否将结论文档化，纳入复盘流程？

# 参考资料
- Async-profiler 官方文档：https://github.com/async-profiler/async-profiler/wiki
- JFR Runtime Guide：https://docs.oracle.com/javacomponents/jmc-8/jfr-runtime-guide/jfr-runtime-guide.pdf
- Oracle 性能调优白皮书：《Java Performance, 2nd Edition》
