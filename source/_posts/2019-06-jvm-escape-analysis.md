---
title: JVM 逃逸分析与标量替换调优
date: 2019-06-12
tags: ['#JVM', '#Performance']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 逃逸分析概念
JIT 编译器通过逃逸分析判断对象是否逃离当前方法或线程。如果对象不逃逸，可将其分配在栈上或进行标量替换，从而减少堆分配与 GC 压力。

# 逃逸类型
- **方法级逃逸**：对象作为返回值或传入外部方法；
- **线程级逃逸**：对象被其它线程引用；
- **无逃逸**：对象仅在当前方法内部使用。

# 标量替换
将对象字段拆解为局部变量，消除对象分配：
```java
public double length(double x, double y) {
    Point p = new Point(x, y); // 无逃逸
    return Math.sqrt(p.x * p.x + p.y * p.y);
}
```
JIT 会将 `Point` 拆解为两个 double，避免堆分配。

# 可视化与调试
- `-XX:+UnlockDiagnosticVMOptions -XX:+PrintEscapeAnalysis -XX:+PrintEliminateAllocations`：查看逃逸分析与分配消除；
- JITWatch GUI 可解析日志，展示内联与优化情况；
- JFR 事件 `Allocation in TLAB` 观察分配趋势。

# 优化建议
- 避免同步块中的大量短生命周期对象；
- 使用局部变量代替临时对象（如 `StringBuilder` 循环中复用）；
- 对 lambda/匿名类关注捕获变量是否导致逃逸；
- 禁用逃逸分析：`-XX:-DoEscapeAnalysis`（仅用于诊断）。

# 自检清单
- 是否使用日志工具确认关键方法已消除对象分配？
- 是否比较优化前后 GC 与吞吐指标？
- 是否确保代码可读性与可维护性优先，避免过早优化？

# 参考资料
- HotSpot Escape Analysis 白皮书：https://wiki.openjdk.org/display/HotSpot/Escape+Analysis
- Java Performance, 2nd Edition (Chapter 7)
- JITWatch 项目：https://github.com/AdoptOpenJDK/jitwatch
