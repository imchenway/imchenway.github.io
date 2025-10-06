---
title: HotSpot C2 逃逸分析剖析
date: 2021-10-05
lang: zh-CN
tags: ['#JVM', '#HotSpot', '#EscapeAnalysis']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 背景
逃逸分析是 HotSpot C2 在 JIT 时优化栈上分配与锁消除的重要手段，理解其原理有助于解释性能波动。

# 工作机制
- C2 构建指令图，对对象分配点进行逃逸分类；
- 对非逃逸对象执行栈上分配与标量替换；
- 对同步块尝试锁消除，降低 Monitor 进入开销。

# 调试技巧
- 启用 `-XX:+UnlockDiagnosticVMOptions -XX:+PrintEscapeAnalysis` 查看分析日志；
- 使用 `-XX:+PrintEliminateAllocations` 观察分配消除情况；
- 结合 JFR `ObjectAllocationInNewTLAB` 事件验证效果。

# 自检清单
- 是否确认被优化的代码不存在并发可见性问题？
- 是否在不同 JDK 版本之间比较逃逸分析行为？
- 是否编写基准测试评估收益？

# 参考资料
- HotSpot VM White Paper：https://www.oracle.com/technetwork/java/javase/tech/index-142774.html
- JDK Source: Escape Analysis：https://wiki.openjdk.org/display/HotSpot/EscapeAnalysis
- JFR Event Reference：https://docs.oracle.com/javacomponents/jmc-8-1/jfr-runtime-guide/monitoring-jfr-events.htm
