---
title: Java Sealed Classes 设计与模式匹配
date: 2019-10-05
tags: ['#Java', '#SealedClasses']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# Sealed Classes 简介
Sealed Classes 是 JDK 15 引入的预览特性（JEP 360），允许类或接口限制哪些子类型可以继承，实现更严格的建模与模式匹配支持。

# 语法示例
```java
public sealed interface Shape permits Circle, Rectangle {}

public final class Circle implements Shape {
    double radius;
}

public final class Rectangle implements Shape {
    double width, height;
}
```

- `sealed` 声明；
- `permits` 指定允许的子类型；
- 子类必须 `final`、`sealed` 或 `non-sealed`。

# 与模式匹配结合
配合模式匹配 switch（JEP 406）可以对封闭层次进行穷尽检查：
```java
static double area(Shape shape) {
    return switch (shape) {
        case Circle c -> Math.PI * c.radius * c.radius;
        case Rectangle r -> r.width * r.height;
    };
}
```
编译器检查所有 permitted 子类是否被覆盖。

# 设计建议
- 用于领域模型（如支付状态、事件类型）；
- 与 `record` 配合描述不可变数据；
- 对扩展性要求高的接口仍保持开放。

# 自检清单
- 是否在构建脚本中开启 `--enable-preview`（JDK 15）？
- 是否评估封闭层次的扩展需求，避免未来破坏性修改？
- 是否使用模式匹配或 `instanceof` 捕获所有子类型？

# 参考资料
- JEP 360: Sealed Classes：https://openjdk.org/jeps/360
- JEP 406: Pattern Matching for switch：https://openjdk.org/jeps/406
- Java 17 Language Updates：https://docs.oracle.com/en/java/javase/17/language/sealed-classes-and-interfaces.html
