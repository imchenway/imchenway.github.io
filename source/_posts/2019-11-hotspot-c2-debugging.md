---
title: HotSpot C2 编译器调试：hsdis 与 CompileCommand

date: 2019-11-12

tags: ['#JVM', '#JIT', '#Debugging']

categories:
  - JVM
---

### 本文目录
<!-- toc -->

# C2 调试动机
HotSpot C2 是服务端优化编译器。通过反汇编与编译日志可以分析优化效果、定位反优化。调试手段包括 hsdis 反汇编器、`CompileCommand` 控制、JITWatch 等。

# 安装 hsdis
- 下载与 CPU 架构匹配的 `hsdis-<arch>.so` 放置于 `$JAVA_HOME/lib/server/`；
- 启动参数：`-XX:PrintAssemblyOptions=intel -XX:+UnlockDiagnosticVMOptions -XX:+PrintAssembly`。

# 使用 CompileCommand
```bash
java \
  -XX:+UnlockDiagnosticVMOptions \
  -XX:CompileCommand=print,com.example.Service::hotMethod \
  -XX:CompileCommand=option,com.example.Service::hotMethod,PrintOptoAssembly \
  -jar app.jar
```
- `exclude`：排除编译；
- `inline`/`dontinline`：控制内联；
- `option`：针对特定方法设置 C2 参数。

# 分析流程
1. 收集 `-XX:+LogCompilation` 日志；
2. 使用 JITWatch TriView 展示字节码、IR、汇编；
3. hsdis 输出 C2 汇编，观察寄存器、指令；
4. 利用 `-XX:+PrintEliminateAllocations`、`PrintEscapeAnalysis` 了解优化；
5. 对照 JFR `Compilation` 事件确认编译频率与耗时。

# 自检清单
- 是否选择合适的测试场景（-Xbatch）确保编译发生？
- 是否加载 hsdis 以查看最终汇编？
- 是否记录调试配置并在生产禁用？

# 参考资料
- hsdis 说明：https://github.com/liuzhengyang/hsdis
- JEP 165 Compiler Control：https://openjdk.org/jeps/165
- JITWatch：https://github.com/AdoptOpenJDK/jitwatch
