---
title: Java Stream API 实战与性能考量
date: 2017-08-05
tags: ['#Java']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 为何关注 Stream
JDK 8 引入 Stream API，将集合操作转为声明式流水线。它能够简化过滤、映射、聚合逻辑，并支持并行执行。然而滥用流会带来额外装箱、调试困难与不可控的并行成本，本文归纳实战经验。

# 核心抽象
- **中间操作**：`map`、`filter`、`sorted`、`distinct` 等返回 Stream，惰性执行。
- **终端操作**：`collect`、`reduce`、`forEach`、`count` 等触发执行。
- **可重用性**：流一旦消费即失效，二次遍历需重新创建。
- **无状态 vs 有状态**：无状态中间操作可在并行流中伸缩；`sorted`、`distinct` 等有状态操作需要额外内存。

# 性能要点
1. **避免不必要的装箱**：优先使用 `IntStream`/`LongStream`/`DoubleStream` 等原始流。
2. **限制链路长度**：过深的中间操作会影响可读性与性能，必要时拆解。
3. **collectors 选择**：`Collectors.toList` 默认 `ArrayList`；`groupingByConcurrent` 适合无序并行聚合。
4. **并行流慎用**：需要无共享状态、数据量较大、CPU 密集；IO 密集、短集合不适合。
5. **定制 Collector**：实现 `Supplier`、`Accumulator`、`Combiner`、`Finisher` 即可构建线程安全、可并行的收集器。

# 常见陷阱
- `parallelStream` 下 `forEach` 的执行顺序不可控，可改用 `forEachOrdered`。
- `map` 中抛出的受检异常需显式处理，可封装为辅助函数。
- 流操作默认不短路，若需提前结束应使用 `findFirst`、`anyMatch` 等短路终端操作。

# 调试技巧
- `peek` 用于调试时查看中间结果，但不要依赖其改变状态。
- 使用 IDE 的 Stream 分析器或 `JFR` 的 Event (JDK 14+) 捕获长耗时流。

# 使用场景示例
```java
record Order(String id, String buyer, BigDecimal amount) {}

Map<String, BigDecimal> totalByBuyer = orders.stream()
    .collect(Collectors.groupingBy(
        Order::buyer,
        Collectors.mapping(Order::amount, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
    ));
```

# 自检清单
- 是否评估了 Stream 与传统循环的可读性和性能差异？
- 并行流是否满足无共享可变状态的约束？
- 自定义 Collector 是否线程安全且具备结合性？

# 参考资料
- Oracle Java Tutorials - Aggregate Operations：https://docs.oracle.com/javase/tutorial/collections/streams/index.html
- Java SE 8 API - java.util.stream 包文档：https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html
