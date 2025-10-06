---
title: Java 泛型深入解析：类型擦除与边界应用
date: 2018-02-05
lang: zh-CN
tags: ['#Java']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 泛型的目标
泛型提供编译期类型检查与类型参数化，避免大量强制转换并提升代码复用度。JVM 通过类型擦除实现泛型，与 C# 的泛型实现不同。

# 类型擦除机制
- 编译期泛型信息用于类型检查；
- 运行期擦除为原始类型（类擦除为上界、接口擦除为 Object）；
- 编译器生成桥接方法以保持多态。

# 通配符与上下界
- `? extends T`：上界通配符，生产者使用，协变读取；
- `? super T`：下界通配符，消费者使用，逆变写入；
- PECS 原则：Producer Extends, Consumer Super。

# 常见模式
```java
// 泛型方法
<T extends Comparable<T>> T max(List<T> list) { ... }

// 自定义泛型类
class Pair<K, V> {
    private final K key;
    private final V value;
}

// 类型令牌
<T> T deserialize(String json, Class<T> type)
```

# 限制与注意事项
- 不支持基本类型泛型，需使用包装类型或 `IntStream` 等专用接口；
- 不能创建泛型数组 `new T[]`；
- `instanceof` 与泛型参数无关，需结合通配符；
- 运行期无法获取泛型参数类型，可使用 `TypeToken` 或 `ParameterizedType`。

# 反例分析
- 原始类型（Raw Type）导致类型安全丢失；
- 使用泛型进行类型检测（`list instanceof List<String>`）非法；
- 泛型与可变参数结合需加 `@SafeVarargs` 并谨慎使用。

# 自检清单
- 是否正确选择上界/下界通配符？
- 是否避免原始类型与不安全转换？
- 是否理解类型擦除导致的限制并采取替代方案？

# 参考资料
- Java Language Specification §4 Generics：https://docs.oracle.com/javase/specs/jls/se8/html/jls-4.html
- Oracle Java Tutorials - Generics：https://docs.oracle.com/javase/tutorial/java/generics/
- Effective Java 第三版 第 5 章：泛型
