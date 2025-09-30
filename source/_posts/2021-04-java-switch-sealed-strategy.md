---
title: Sealed + 模式匹配构建策略引擎
date: 2021-04-05
tags: ['#Java', '#SealedClasses', '#PatternMatching']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 组合优势
Sealed Classes 限定事件类型，模式匹配 switch 提供穷尽校验，两者结合可构建策略引擎（风控、优惠策略）并避免遗漏。

# 实践步骤
- 定义 `sealed interface Event permits ...`；
- 使用 `switch (event)` 匹配不同策略；
- 通过 `when` 守卫表达复杂条件；
- 利用 `record` 传递不可变参数。

# 自检清单
- 是否设计 `permits` 列表，避免未来迭代破坏兼容？
- 是否在策略匹配中记录事件日志便于审计？
- 是否编写单元测试覆盖每个事件类型？

# 参考资料
- JEP 360, 406：https://openjdk.org/jeps/360
- Java 17 语言更新文档：https://docs.oracle.com/en/java/javase/17/language/sealed-classes-and-interfaces.html
- IntelliJ 模式匹配提示指南
