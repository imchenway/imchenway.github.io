---
title: 记录类型与 ProGuard 混淆兼容攻略
date: 2021-02-19
tags: ['#Java', '#Records', '#Build']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 兼容问题
旧版 ProGuard/R8 未完全支持记录类型的 `componentN` 与 `record` 构造器，混淆后可能导致反射或序列化失败。需确保使用兼容版本并配置保留规则。

# 配置建议
- 升级到支持 Records 的 R8 版本；
- 添加 keep 规则：
```
-keepclassmembers class * extends java.lang.Record {
    <init>(...);
    java.lang.String[] $components$();
    *** component*(...);
}
```
- 对 Jackson/Gson 等序列化库保留字段名称；
- 使用 `@JsonProperty` 明确字段映射。

# 自检清单
- 是否在混淆后运行集成测试验证反序列化？
- 是否监控线上混淆引起的 ClassNotFound/NoSuchMethod？
- 是否记录混淆配置并在升级 JDK 时复查？

# 参考资料
- ProGuard 官方文档：https://www.guardsquare.com/manual/configuration/usage
- R8 Release Notes
- Jackson 关于记录类型的配置
