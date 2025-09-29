---
title: java.time 高级用法：TemporalAdjuster 与时间线建模
date: 2019-08-05
tags: ['#Java', '#DateTime']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# TemporalAdjuster 概述
`TemporalAdjuster` 定义了时间调整策略，适用于 `LocalDate`, `LocalDateTime` 等类型。通过调整器可以自定义业务日历，如下个工作日、月末、财务周期。

# 内置调整器
- `next(DayOfWeek)`、`previousOrSame(DayOfWeek)`；
- `firstDayOfMonth()`、`lastDayOfQuarter()`；
- `lastInMonth(DayOfWeek)` 等。

# 自定义调整器
```java
TemporalAdjuster nextWorkday = temporal -> {
    LocalDate date = LocalDate.from(temporal);
    do {
        date = date.plusDays(1);
    } while (EnumSet.of(DayOfWeek.SATURDAY, DayOfWeek.SUNDAY).contains(date.getDayOfWeek()));
    return temporal.with(date);
};

LocalDate nextBizDay = LocalDate.now().with(nextWorkday);
```

# 业务建模
- 财务周期：结合 `YearMonth`, `TemporalAdjuster` 计算账单周期；
- SLAs：使用 `Duration`, `Period` 与 `ChronoUnit` 计算时限；
- 时区转换：`ZonedDateTime.withZoneSameInstant()` 与调整器组合。

# 日期与时间线库
- `java.time` + `ZoneId`；
- `ThreeTen-Extra` 提供额外调整器（如营业日历）；
- JSR-310 兼容 libs（Joda-Time 迁移）。

# 自检清单
- 是否在业务逻辑中替换繁琐的手写日期运算？
- 是否考虑节假日自定义调整器与外部配置？
- 是否保证时间转换使用 `ZoneId` 而非系统默认？

# 参考资料
- Java Date and Time API：https://docs.oracle.com/javase/tutorial/datetime/
- TemporalAdjusters API：https://docs.oracle.com/javase/8/docs/api/java/time/temporal/TemporalAdjusters.html
- ThreeTen-Extra 项目：https://www.threeten.org/threeten-extra/
