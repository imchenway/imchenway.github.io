---
title: 记录类型的序列化与兼容性策略
date: 2020-08-05
tags: ['#Java', '#Records', '#Serialization']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 记录类型序列化现状
Records 默认实现 `Serializable`，但需要注意 `serialVersionUID`、构造器兼容与外部库支持。Jackson、Gson、Kryo 等序列化工具对 Records 的支持版本各异，需要针对版本做兼容测试。

# Jackson 示例
```java
ObjectMapper mapper = new ObjectMapper();
mapper.registerModule(new JavaTimeModule());
Payment payment = new Payment("ID-1", BigDecimal.TEN);
String json = mapper.writeValueAsString(payment);
Payment copy = mapper.readValue(json, Payment.class);
```
- 需要 Jackson 2.12+；
- 可以使用 `@JsonProperty` 指定字段名称；
- 对可选字段可结合 `@JsonInclude`。

# 二进制序列化
- 使用 Kryo 时需注册 `RecordSerializer`；
- protobuf 需手写 message，不直接支持 record；
- 日志传输可考虑 Avro + Schema Registry。

# 自检清单
- 是否锁定依赖版本以确保对 Records 支持？
- 是否为向后兼容保留默认构造器或 builder？
- 是否在多语言环境中提供 JSON/Avro 等通用格式？

# 参考资料
- Jackson 2.12 Release Notes：https://github.com/FasterXML/jackson/wiki/Jackson-Release-2.12
- Gson 2.9 记录类型支持讨论
- Kryo 文档：https://github.com/EsotericSoftware/kryo
