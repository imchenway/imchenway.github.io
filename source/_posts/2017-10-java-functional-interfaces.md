---
title: Java 函数式接口与行为参数化实践
date: 2017-10-05
lang: zh-CN
tags: ['#Java']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 函数式接口的定位
函数式接口（Functional Interface）指只包含一个抽象方法的接口，`@FunctionalInterface` 注解用于编译期校验。Java 8 通过函数式接口与 Lambda 表达式，实现行为参数化与简洁的 API 设计。

# 标准函数式接口速览
| 接口 | 抽象方法 | 场景 |
|---|---|---|
| `Supplier<T>` | `T get()` | 延迟获取/惰性加载 |
| `Consumer<T>` | `void accept(T t)` | 遍历处理、事件回调 |
| `Function<T,R>` | `R apply(T t)` | 映射转换 |
| `Predicate<T>` | `boolean test(T t)` | 条件过滤 |
| `UnaryOperator<T>` | `T apply(T t)` | 自变换，如数值操作 |
| `BinaryOperator<T>` | `T apply(T t, T u)` | 聚合，如求最大值 |

支持 2/3/4 参数的 `BiFunction`、`BiConsumer` 等接口，以及带检查异常的自定义接口。

# 行为参数化示例
```java
<T> List<T> filter(List<T> source, Predicate<T> predicate) {
    List<T> result = new ArrayList<>();
    for (T item : source) {
        if (predicate.test(item)) {
            result.add(item);
        }
    }
    return result;
}

var vipUsers = filter(users, user -> user.isVip() && user.active());
```

# 自定义函数式接口注意事项
- 标注 `@FunctionalInterface`，确保只有一个抽象方法。
- 允许定义默认方法与静态方法。
- 如需抛出受检异常，可在接口方法签名中声明或使用包装。
- 在序列化场景中慎用 Lambda，需考虑实现类名称。

# 与方法引用搭配
- 静态方法：`ClassName::staticMethod`
- 特定对象实例：`instance::method`
- 特定类型任意对象实例：`ClassName::instanceMethod`
- 构造方法：`ClassName::new`

# 自检清单
- 是否使用 `@FunctionalInterface` 保证接口符合约定？
- 是否合理选择 `java.util.function` 中已有接口，避免重复造轮子？
- 是否为 Lambda 提供清晰的变量命名与注释，提升可读性？

# 参考资料
- Java Language Specification §9.8 Functional Interfaces：https://docs.oracle.com/javase/specs/jls/se8/html/jls-9.html#jls-9.8
- Java SE 8 API - java.util.function 包：https://docs.oracle.com/javase/8/docs/api/java/util/function/package-summary.html
- Oracle Java Tutorials - Lambda Expressions：https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html
