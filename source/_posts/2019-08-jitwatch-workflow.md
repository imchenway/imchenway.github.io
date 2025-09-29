---
title: 使用 JITWatch 分析 HotSpot JIT 优化
date: 2019-08-12
tags: ['#JVM', '#JIT', '#Profiling']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# JITWatch 简介
JITWatch 是开源分析工具，用于解析 HotSpot JIT 日志，展示内联、逃逸分析、热点方法等信息。帮助开发者理解 JIT 优化决策，定位性能瓶颈。

# 收集 JIT 日志
```bash
java \
  -XX:+UnlockDiagnosticVMOptions \
  -XX:+LogCompilation \
  -XX:+PrintCompilation \
  -XX:+TraceClassLoading \
  -jar app.jar
```
- `-XX:+LogCompilation` 输出 `hotspot_pid.log`；
- 可增加 `-XX:+PrintInlining`；
- 与 `-XX:+PrintEscapeAnalysis` 搭配深入分析。

# 使用流程
1. 启动 JITWatch UI；
2. 加载 JIT 日志 (`hotspot_pid.log`)；
3. 加载源代码与 classpath 提供反编译；
4. 在「Code Cache」观察编译热度，在「TriView」查看字节码、优化 IR 与汇编；
5. 关注 `Inlining`, `Elimination`, `C2` 面板；
6. 与 JFR/Async-profiler 数据交叉验证。

# 典型场景
- 识别未内联的方法（因体积或多态）；
- 分析逃逸分析失败原因；
- 发现频繁反优化（Deoptimization）；
- 辅助确认 Graal/HotSpot 参数调整效果。

# 自检清单
- 是否在性能测试过程中收集最新日志？
- 是否为关键方法加载对应源代码以便 TriView 分析？
- 是否记录分析结论并与代码优化挂钩？

# 参考资料
- JITWatch GitHub：https://github.com/AdoptOpenJDK/jitwatch
- HotSpot 编译器控制（JEP 165）：https://openjdk.org/jeps/165
- Java Performance, 2nd Edition（JIT 分析章节）
