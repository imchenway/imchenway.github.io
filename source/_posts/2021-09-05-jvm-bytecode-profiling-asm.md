---
title: JVM 字节码 Profiling 与 ASM 改写
date: 2021-09-05
lang: zh-CN
tags: ['#JVM', '#ASM', '#Profiling']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 背景
通过字节码注入实现运行时 Profiling，可定位热点方法与异常路径，但需控制开销与兼容性。

# 实施步骤
- 使用 ASM `ClassVisitor` 在方法入口/出口注入计时逻辑；
- 通过 `MethodNode` 复制原指令，确保异常表不被破坏；
- 在 ClassFileVersion < Java 8 时降级为代理模式，保证兼容。

# 运行时治理
- 提供 Agent 配置，按包名/注解白名单注入；
- 使用 `AsyncGetCallTrace` 栈采样交叉验证数据；
- 监控字节码膨胀与 Metaspace 使用情况。

# 自检清单
- 是否校验注入后字节码通过 `VerifyError` 检查？
- 是否对性能开销进行基准评估？
- 是否提供紧急关闭开关？

# 参考资料
- ASM 官方指南：https://asm.ow2.io/
- JVMTI 文档：https://docs.oracle.com/javase/8/docs/platform/jvmti/jvmti.html
- AsyncGetCallTrace 说明（OpenJDK）：https://hirt.se/blog/?p=1215
