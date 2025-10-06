---
title: HotSpot JIT 编译管线：从解释到优化
date: 2018-02-12
lang: zh-CN
tags: ['#JVM', '#JIT']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 执行模式
HotSpot 采用解释器 + JIT 编译器（C1、C2）协同的分层编译（Tiered Compilation）。热点方法先由解释器执行，收集 profiling 数据，再由 C1/C2 编译为本地代码。

# 分层编译
| 层级 | 执行引擎 | 特点 |
|---|---|---|
| 0 | 解释器 | 收集 profiling，迅速启动 |
| 1~2 | C1 客户端编译器 | 轻量级优化，插桩收集更精细数据 |
| 3~4 | C2 服务端编译器 | 深度优化，适合长期热点 |

# 热点探测
- **计数器**：方法调用计数、循环回边计数（`InvocationCounter`、`BackEdgeCounter`）。
- **阈值**：`-XX:CompileThreshold`、`-XX:BackEdgeThreshold` 控制触发编译。
- **OSR (On-Stack Replacement)**：将正在执行的热循环替换为已编译的版本。

# 典型优化
- 内联、逃逸分析、锁消除/锁粗化、常量折叠、循环优化（向量化、无界展开）。
- `-XX:+PrintCompilation` 查看编译日志；`-XX:+PrintInlining` 追踪内联决策。

# 调试与诊断
- `-XX:+UnlockDiagnosticVMOptions -XX:+PrintCompilation`：观察编译线程活动。
- `-XX:CompileCommand=print,com.example.MyClass::method` 输出 IR；
- `-XX:CompileCommand=exclude,...` 排除问题方法。

# GraalVM 展望
JDK 11+ 可用 Graal 替换 C2 (`-XX:+UnlockExperimentalVMOptions -XX:+UseJVMCICompiler`)，提供更强的优化与多语言支持。

# 自检清单
- 是否理解方法为何被编译（计数器阈值）？
- 是否利用编译日志跟踪性能问题？
- 是否在需要时调整分层编译参数或尝试 Graal？

# 参考资料
- HotSpot 编译器控制文档：https://docs.oracle.com/javase/9/tools/java.htm#JSWOR624
- JEP 165: Compiler Control：https://openjdk.org/jeps/165
- HotSpot 编译白皮书：《The Java HotSpot Virtual Machine》
