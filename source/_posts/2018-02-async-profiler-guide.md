---
title: Async-profiler 火焰图分析实践
date: 2018-02-26
tags: ['#JVM', '#Profiling']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 工具概览
Async-profiler 是一款基于 Linux `perf_events` 的采样型分析器，可生成 CPU、分配、锁、墙钟时间等火焰图。它通过 AsyncGetCallTrace API 获取栈信息，开销低。JDK 8u60+ 可使用。

# 安装与运行
```bash
# CPU 样本
./profiler.sh -d 60 -f cpu.html -e cpu <pid>

# 分配火焰图
./profiler.sh -d 60 -f alloc.html -e alloc <pid>

# 墙钟时间（含阻塞）
./profiler.sh -d 120 -f wall.html -e wall <pid>
```

参数说明：
- `-d` 采样时长；
- `-e` 事件类型（cpu/alloc/wall/lock等）；
- `-o` 输出格式（flamegraph、collapsed）；
- `-i` 采样间隔。

# 火焰图解读
- 横轴表示调用栈宽度（占总采样比例），纵向堆叠表示调用链。
- 顶部函数越宽，说明该函数耗时占比越高。
- 支持搜索、折叠，定位热点方法。

# 常见用法
- 分析 CPU 热点：`-e cpu`；
- 排查 GC 分配压力：`-e alloc`；
- 分析阻塞：`-e wall`；
- 偏向锁竞争：`-e lock`。

# 注意事项
- 需要非 root 用户开启 `perf_event_paranoid`：`echo 1 | sudo tee /proc/sys/kernel/perf_event_paranoid`；
- 在容器中需挂载 `perf_event`；
- Windows 不支持，可在 WSL/容器中运行。

# 自检清单
- 是否选择合适的事件与采样时长？
- 是否结合业务高峰或异常时间段采集？
- 是否与 GC 日志、JFR 结果交叉验证？

# 参考资料
- Async-profiler GitHub：https://github.com/async-profiler/async-profiler
- 官方 Wiki：https://github.com/async-profiler/async-profiler/wiki
- Brendan Gregg Flame Graphs：https://www.brendangregg.com/flamegraphs.html
