---
title: Java 模式匹配 switch 的业务落地方案
date: 2020-12-05
tags: ['#Java', '#PatternMatching', '#Language']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 新特性概览
JDK 17 引入 preview 版的模式匹配 switch（JEP 406），允许在 `switch` 中对类型和结构进行匹配，减少层层 `instanceof` 判断。可用于事件路由、DSL 解析等场景。

# 示例
```java
String result = switch (obj) {
    case OrderCreated(var id, var amount) -> processCreated(id, amount);
    case OrderCancelled(var id, var reason) when reason != null -> logCancel(id, reason);
    case String s -> s.toUpperCase();
    default -> "UNKNOWN";
};
```
- `when` 子句可添加守卫条件；
- 注意所有分支需穷尽。

# 实践建议
- 在模块化项目中统一启用 `--enable-preview`；
- 对枚举/密封类优先使用 switch 模式匹配；
- 在日志系统中利用模式匹配处理多种事件类型。

# 自检清单
- 是否覆盖所有 `permits` 子类，避免 `MatchException`？
- 是否在守卫条件中处理空指针？
- 是否在构建、测试、运行阶段统一开启预览特性？

# 参考资料
- JEP 406: Pattern Matching for switch：https://openjdk.org/jeps/406
- JDK 19 Pattern Matching 更新：https://openjdk.org/jeps/427
- IntelliJ/IDE 支持说明
