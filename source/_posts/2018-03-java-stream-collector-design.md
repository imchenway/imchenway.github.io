---
title: 自定义 Java Stream Collector 的设计模式
date: 2018-03-05
tags: ['#Java', '#Stream']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# Collector 架构
`Collector<T, A, R>` 定义了流终端操作的聚合逻辑：
- **Supplier**：创建可变容器。
- **Accumulator**：将元素累加到容器。
- **Combiner**：并行流合并子结果。
- **Finisher**：将容器转换为最终结果。
- **Characteristics**：标识 `UNORDERED`、`CONCURRENT`、`IDENTITY_FINISH`。

# 设计步骤
1. **明确需求**：最终结果类型 R，是否需要中间容器。
2. **选择容器**：使用 `ArrayList`、`StringBuilder` 或自定义对象。
3. **定义 Accumulator**：确保线程安全；在并行流下不要对共享状态写操作。
4. **Combiner**：合并两个容器；对串行流会被优化掉，但必须正确实现。
5. **Finisher**：如果容器即结果，返回 `collectorOf(..., Characteristics.IDENTITY_FINISH)`。

# 示例：计算 Top-K 热门元素
```java
class TopKCollector<T> implements Collector<T, PriorityQueue<T>, List<T>> {
    private final int k;
    private final Comparator<? super T> cmp;

    TopKCollector(int k, Comparator<? super T> cmp) {
        this.k = k;
        this.cmp = cmp;
    }

    public Supplier<PriorityQueue<T>> supplier() {
        return () -> new PriorityQueue<>(k, cmp);
    }

    public BiConsumer<PriorityQueue<T>, T> accumulator() {
        return (pq, item) -> {
            pq.offer(item);
            if (pq.size() > k) {
                pq.poll();
            }
        };
    }

    public BinaryOperator<PriorityQueue<T>> combiner() {
        return (left, right) -> {
            right.forEach(item -> {
                left.offer(item);
                if (left.size() > k) left.poll();
            });
            return left;
        };
    }

    public Function<PriorityQueue<T>, List<T>> finisher() {
        return pq -> {
            List<T> result = new ArrayList<>(pq);
            result.sort(cmp.reversed());
            return result;
        };
    }

    public Set<Characteristics> characteristics() {
        return EnumSet.noneOf(Characteristics.class);
    }
}
```

# 线程安全注意事项
- 避免在 `accumulator` 中使用共享可变状态。
- 如果容器不是线程安全的，Collector 不能声明为 `CONCURRENT`。
- 使用并行流时确保组合操作对数据无副作用。

# 自检清单
- 是否正确实现 `combiner`，在并行流下能合并结果？
- 是否根据容器是否等于结果设置 `IDENTITY_FINISH`？
- 是否评估并行流执行效率与线程安全？

# 参考资料
- Java SE 8 API - `Collector` 接口：https://docs.oracle.com/javase/8/docs/api/java/util/stream/Collector.html
- Oracle Stream API 指南：https://docs.oracle.com/javase/tutorial/collections/streams/index.html
- 《Effective Java》第 7 章 Stream 最佳实践
