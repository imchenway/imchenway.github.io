---
title: Java 17 密封类设计模式
date: 2021-09-12
tags: ['#Java', '#SealedClasses', '#DesignPatterns']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 背景
密封类提供受控继承结构，可用于建模协议状态机、命令体系等，需要总结常见设计模式。

# 模式示例
- 状态机模式：密封接口 + record 表示状态；
- 访问者模式：利用 `switch` 表达式处理分支；
- 枚举扩展：密封类定义基础行为，子类覆盖具体逻辑。

# 实践建议
- 将密封层次放在单独包内，保护不可见实现；
- 结合 `record` 简化数据载体，减少样板代码；
- 在测试中使用模式匹配校验完整性。

# 自检清单
- 是否声明 `permits` 列出所有子类？
- 是否为外部扩展预留 SPI 或工厂？
- 是否覆盖所有分支以避免 `MatchException`？

# 参考资料
- JEP 409: Sealed Classes：https://openjdk.org/jeps/409
- Pattern Matching for `switch` (JEP 406)：https://openjdk.org/jeps/406
- Java 17 Language Specification：https://docs.oracle.com/javase/specs/jls/se17/html/index.html
