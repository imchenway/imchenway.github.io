---
title: JVM JIT热点探测与编译决策
date: 2021-12-16
lang: zh-CN
tags: ['#JVM']
---

### 本文目录
<!-- toc -->

# 引言
> JIT 编译器依赖执行计数器来判断热点方法与热点循环，进而进行优化。了解 HotSpot 的热点探测逻辑，有助于解释预热时间、编译回退等现象。

# 热点探测机制
## 方法计数器
- `Invocation Counter`：方法调用次数；
- `Backedge Counter`：循环后边计数；
- 触发阈值：`CompileThreshold`（默认 10,000）与 `OnStackReplacePercentage`；
- `TieredCompilation` 会动态调整阈值。

## OSR（On Stack Replacement）
- 当循环计数超过阈值，JVM 会在栈上替换正在执行的函数，跳转到编译后的机器码；
- `-XX:OnStackReplacePercentage=140` 控制 OSR 触发点；
- 可通过 `-XX:+TraceOnStackReplacement` 观察。

# 编译队列与优先级
- `CompileBroker` 管理编译任务队列；
- 方法被标记为 `queued`、`compiling`、`compiled`；
- `-XX:CICompilerCount` 决定并行编译线程；
- 对于热方法，JVM 会优先使用 C1 生成代码，再升级至 C2。

# 再编译与去优化
- 若假设失效（如类型 profile 变化），JVM 会触发 Deoptimization，回退到解释执行；
- `-XX:+TraceDeoptimization`、`-XX:+UnlockDiagnosticVMOptions` 监控；
- JITWatch `TriView` 分析编译历史。

# 最佳实践
- 对长预热应用，使用 `-XX:TieredStopAtLevel=1` 缩短预热，再恢复默认；
- 对热点路径进行微基准（JMH）评估；
- 避免在热点方法中使用 `System.out.println` 等阻碍优化的操作；
- 监控 `CompilationTime`、`CompileQueueSize` 指标，避免编译线程饱和。

# 总结
JIT 热点探测是动态优化的起点。通过理解计数器、OSR、去优化机制，我们可以更合理地设计代码结构与调优策略，避免“预热时间过长”或“性能不稳定”等问题。

# 参考资料
- [1] Oracle, "Java HotSpot VM Compilation". https://docs.oracle.com/javase/
- [2] JEP 165: Compiler Control. https://openjdk.org/jeps/165
- [3] JITWatch 文档. https://github.com/AdoptOpenJDK/jitwatch
