---
title: Java 异常处理策略：可读性与可恢复性的平衡
date: 2017-11-05
lang: zh-CN
tags: ['#Java']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 异常体系概览
Java 将异常分为受检异常（Checked）、未受检异常（RuntimeException）与 `Error`。受检异常要求调用方捕获或声明抛出，强调可恢复场景；未受检异常用于编程错误或系统不可恢复的情况。

# 最佳实践
1. **精确捕获**：不要捕获 `Exception` 大包；针对具体异常类型处理。
2. **异常包装**：使用自定义异常携带业务上下文，保留原始堆栈；`throw new BizException("xxx", cause)`。
3. **finally vs try-with-resources**：JDK 7 起使用 `try(...) {}` 自动关闭资源，避免隐藏异常。
4. **日志与重抛**：若无法处理异常，应在合适层级记录并重抛，而非吞掉。
5. **避免过度受检异常**：对调用者难以恢复的情况使用未受检异常。

# 常见错误示例
- 捕获后空操作（`catch (Exception e) {}`），导致问题被掩盖。
- 使用异常控制流程（如在循环中捕获 `NumberFormatException`），会严重影响性能。
- 返回 `null` 代替抛异常，使调用方难以感知错误。

# 调试技巧
- `Thread.setDefaultUncaughtExceptionHandler` 统一处理未捕获异常。
- 在日志中输出 `exception.getClass().getName()` + 堆栈，便于检索。
- 使用 JFR 事件 `Exception Statistics` 或 IDE Breakpoint 捕获特定异常。

# 自检清单
- 是否为 API 设计了合理的异常类型，调用方能否恢复？
- 是否使用 try-with-resources 确保资源释放？
- 是否记录了异常上下文，方便排查？

# 参考资料
- Oracle Java Tutorials - Exceptions：https://docs.oracle.com/javase/tutorial/essential/exceptions/
- Java Language Specification §11 Exceptions：https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html
- Effective Java 第三版 第 9 章：异常最佳实践
