---
title: JVM Native Memory Tracking (NMT) 深入解析
date: 2019-05-12
lang: zh-CN
tags: ['#JVM', '#NMT', '#Troubleshooting']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# NMT 概览
Native Memory Tracking (NMT) 是 HotSpot 提供的原生内存诊断功能，用于监控 JVM 在各组件（堆、线程、代码缓存、类元数据等）的原生内存使用情况。帮助定位内存泄漏、容器内存膨胀等问题。

# 启用方式
- 轻量模式：`-XX:NativeMemoryTracking=summary`；
- 详细模式：`-XX:NativeMemoryTracking=detail`（开销更高）；
- 组合启动参数：`-XX:NativeMemoryTracking=detail -XX:+UnlockDiagnosticVMOptions -XX:+PrintNMTStatistics`。

# 动态查询
使用 `jcmd` 查看：
```bash
jcmd <pid> VM.native_memory summary
jcmd <pid> VM.native_memory detail.diff=1
```
- `summary` 输出各类别内存占用；
- `detail.diff=1` 与前一次快照比较增量。

# 常见分析维度
- **Thread**：线程栈和线程对象；
- **Java Heap**：堆使用，与 GC 指标对照；
- **Class**：类元数据、常量池；
- **Code**：JIT 代码缓存；
- **GC**：GC 数据结构，如 Remembered Set；
- **Internal**：JVM 内部数据结构。

# 故障排查流程
1. 启用 detail 模式并捕获多次快照；
2. 使用 `detail.diff` 标识增长的类别；
3. 若 `Thread` 增长，检查线程池配置；
4. 若 `Class` 增长，排查动态类加载；
5. 与系统监控（RSS、容器 cgroup）对照确认 NMT 覆盖范围。

# 自检清单
- 是否在问题复现时启用 NMT 以免影响生产性能？
- 是否记录快照与时间线，辅助复盘？
- 是否结合 jcmd、JFR、堆 dump 形成完整视图？

# 参考资料
- HotSpot NMT 官方文档：https://docs.oracle.com/javase/8/docs/technotes/guides/vm/nmt-8.html
- `jcmd` 工具说明：https://docs.oracle.com/javase/8/docs/technotes/tools/unix/jcmd.html
- Troubleshooting Guide：https://docs.oracle.com/en/java/javase/17/troubleshoot/troubleshooting-guide.pdf
