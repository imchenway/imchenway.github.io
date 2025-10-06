---
title: Java Switch 表达式（JEP 361）的使用与陷阱
date: 2019-02-05
lang: zh-CN
tags: ['#Java', '#Language']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 新特性概览
JDK 14 将 switch 表达式标准化（JEP 361），支持返回值与箭头语法，减少 `break` 与 fall-through 错误。

# 基础示例
```java
int numLetters = switch (day) {
    case MONDAY, FRIDAY, SUNDAY -> 6;
    case TUESDAY -> 7;
    case THURSDAY, SATURDAY -> 8;
    case WEDNESDAY -> 9;
    default -> throw new IllegalStateException("Invalid day");
};
```

# yield 关键字
在代码块内返回值使用 `yield`：
```java
int result = switch (value) {
    case 1 -> 1;
    case 2 -> {
        int tmp = compute();
        yield tmp * 2;
    }
    default -> 0;
};
```

# 注意事项
- switch 表达式必须覆盖所有分支（包含 default 或 enum 全覆盖）；
- 字符串匹配使用 equals，大写敏感；
- 旧语法仍可与新语法共存；
- 对 pattern matching for switch（JEP 406）提供基础。

# 错误示例
- fall-through 不再默认生效，若需要可使用 `yield` 和代码块；
- 若在表达式中执行副作用操作需谨慎，保持纯函数式。

# 自检清单
- 是否启用新 JDK 版本并配置构建工具？
- 是否在 switch 表达式中返回有限定的不可变对象，避免副作用？
- 是否对 default 分支处理异常或非法输入？

# 参考资料
- JEP 361: Switch Expressions：https://openjdk.org/jeps/361
- Java 14 Language Updates：https://docs.oracle.com/en/java/javase/14/language/switch-expressions.html
- Pattern Matching for switch (JEP 406)：https://openjdk.org/jeps/406
