---
title: Java 记录类型与模式匹配的协同实践
date: 2020-02-05
tags: ['#Java', '#Records', '#PatternMatching']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 记录类型与模式匹配的关系
记录类型（Record）提供了不可变数据载体，模式匹配（Pattern Matching for instanceof/switch）则让代码可以结构化解构记录。两者结合后可以减少样板代码，编写出声明式的业务规则。

# 示例：事件处理器
```java
record PaymentEvent(String orderId, BigDecimal amount, String channel) {}

void handle(Object event) {
    if (event instanceof PaymentEvent(var orderId, var amount, var channel)) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("amount");
        }
        audit(orderId, channel, amount);
    }
}
```

# 在 switch 中使用
```java
double price = switch (event) {
    case PaymentEvent(String id, BigDecimal amt, String ch) -> discountService.calc(id, ch, amt);
    case RefundEvent(var id, var amt) -> refundService.calc(id, amt);
    default -> throw new IllegalArgumentException();
};
```
- 需要 JDK 17+（JEP 406）配合 `--enable-preview`；
- 编译与运行均需启用预览特性。

# 测试与模块化
- 在 JPMS 下，为测试模块添加 `requires preview`；
- junit-platform 通过 `--add-opens` 访问记录组件；
- 使用 Jacoco >= 0.8.6 支持记录生成的字节码。

# 自检清单
- 是否在构建脚本中统一启用/关闭预览开关？
- 是否确保记录字段符合不可变建模需求？
- 是否在 switch 模式匹配中覆盖所有记录子类型？

# 参考资料
- JEP 395: Records：https://openjdk.org/jeps/395
- JEP 406: Pattern Matching for switch：https://openjdk.org/jeps/406
- IntelliJ IDEA 预览特性支持：https://www.jetbrains.com/help/idea/preview-features.html
