---
title: Java Optional 与新日期时间 API 最佳实践
date: 2017-09-05
lang: zh-CN
tags: ['#Java']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 为什么要再次审视 Optional 与 java.time
`Optional` 与 `java.time` 是 Java 8 引入的重要增强：前者旨在表达“可能缺失”的值，后者替换 `java.util.Date/Calendar` 的易错 API。合理使用二者能提升空值处理与时间计算的可读性与安全性。

# Optional 核心准则
- **返回值替代空指针**：适用于方法结果，避免 `null`；不建议作为字段或序列化对象使用。
- **链式操作**：`map`、`flatMap`、`filter`、`orElseGet` 组合，可表达条件转换与默认值。
- **避免滥用**：集合、流中的元素不应使用 `Optional` 装箱；参数仍优先使用普通类型或重载。
- **抛出异常**：`orElseThrow` 搭配自定义异常更直观。

# java.time 结构速览
- `LocalDate`、`LocalTime`、`LocalDateTime`：无时区表示。
- `ZonedDateTime`、`OffsetDateTime`：携带时区或偏移量。
- `Instant`：UTC 时间戳，可与 `Clock`、`Duration` 搭配。
- `DateTimeFormatter`：线程安全格式化。

# 常见场景示例
```java
Optional<Duration> travelTime = Optional.ofNullable(plan.getDuration())
    .filter(d -> !d.isNegative())
    .filter(d -> !d.isZero());

LocalDate statementMonth = LocalDate.now(ZoneId.of("Asia/Shanghai"))
    .withDayOfMonth(1);

String isoText = DateTimeFormatter.ISO_OFFSET_DATE_TIME.format(ZonedDateTime.now());
```

# 错误示例与修正
- **将 Optional 作为字段**：考虑使用普通引用 + 注释或构建器处理。
- **混用旧 API**：使用 `Date.from(instant)`、`instant.toEpochMilli()` 做桥接；尽快迁移至 `java.time`。
- **时区缺省**：所有跨地区业务都应显式指定 `ZoneId`，避免依赖系统默认值。

# 自检清单
- 方法是否通过 `Optional` 清晰表达“可能无值”？
- 是否对时间操作使用不可变、线程安全的 `java.time` 类？
- 是否为格式化/解析指定时区与 Locale？

# 参考资料
- Oracle Java Tutorials - Optional：https://docs.oracle.com/javase/tutorial/java/javaOO/optional.html
- Java Platform SE 8 - java.time 包文档：https://docs.oracle.com/javase/8/docs/api/java/time/package-summary.html
