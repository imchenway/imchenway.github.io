---
title: Java Records 预览特性实践（JDK 14）
date: 2019-01-05
lang: zh-CN
tags: ['#Java', '#Records']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# Records 简介
Records 是 JDK 14 的预览特性（JEP 359），用于声明不可变、基于数据的类，编译器自动生成构造器、访问器、`equals`、`hashCode`、`toString`。

# 基本语法
```java
record Point(int x, int y) {}

Point p = new Point(3, 4);
System.out.println(p.x()); // 3
```

# 自定义逻辑
- **紧凑构造器**：
```java
record Range(int start, int end) {
    Range {
        if (start > end) throw new IllegalArgumentException("start > end");
    }
}
```
- **方法与静态字段**：Records 可定义方法、静态字段，但实例字段必须在组件列表中声明。
- **实现接口**：Records 可实现接口，但不能继承其它类。

# 使用限制
- Fields 隐式 `final`；
- 不能定义显式的可变实例字段；
- 为反射/序列化准备：需注意 Jackson 等库的支持版本。

# 启用方式
- 编译：`javac --enable-preview --release 14 Point.java`
- 运行：`java --enable-preview Point`

# 场景与迁移
- 替换值对象（DTO、配置项）；
- 与 Pattern Matching（JEP 406）结合；
- 当需要可变状态或复杂逻辑时使用普通类。

# 自检清单
- 是否在构建脚本中启用 `--enable-preview`？
- 是否评估依赖库对 Records 的支持情况？
- 是否确保 Records 适用于不可变数据模型？

# 参考资料
- JEP 359: Records：https://openjdk.org/jeps/359
- Java 14 Release Notes：https://docs.oracle.com/en/java/javase/14/docs/api/preview-summary.html
- Pattern Matching with Records：https://openjdk.java.net/jeps/405
