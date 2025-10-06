---
title: Java 集合框架性能与实践指南
date: 2017-07-05
lang: zh-CN
tags: ['#Java']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 为什么要再复盘集合框架
Java 自 1.2 引入集合框架以来，逐步形成 `List`、`Set`、`Map` 与并发容器等层次化结构。JDK 8 之后，结合泛型、lambda 与 Stream API，集合成为系统性能与可读性的重要基石。重新梳理集合框架有助于在高吞吐场景下做出正确的容器选择。

# 架构速览
| 顶层接口 | 核心实现 | 场景要点 |
|---|---|---|
| `List` | `ArrayList`、`LinkedList` | 顺序访问/插入；随机读写性能差异显著 |
| `Set` | `HashSet`、`LinkedHashSet`、`TreeSet` | 保证唯一性；是否保持顺序/排序取决于实现 |
| `Queue` | `ArrayDeque`、`PriorityQueue` | FIFO 或优先级队列；`ArrayDeque` 适合栈/队列双端操作 |
| `Map` | `HashMap`、`LinkedHashMap`、`TreeMap` | 键值对存储；红黑树优化应对碰撞 |
| 并发容器 | `ConcurrentHashMap`、`CopyOnWriteArrayList` | 细粒度锁或写时复制，解决多线程读写 |

# 性能决策清单
1. **随机读多写少**：首选 `ArrayList` 与 `HashMap`。扩容成本可通过预估容量（`new ArrayList(capacity)`）降低。
2. **频繁中间插入删除**：`LinkedList` 避免数组移动，但需关注遍历性能。
3. **迭代顺序稳定**：`LinkedHashMap` 或 `LinkedHashSet` 保持插入顺序，并可设置 LRU（`accessOrder=true`）。
4. **排序需求**：`TreeSet`、`TreeMap` 基于 `Comparable`/`Comparator` 的红黑树实现。
5. **高并发读取**：`ConcurrentHashMap` 基于分段 CAS（JDK 8 采用树化 + CAS），避免全表锁；读多写少场景下 `CopyOnWriteArrayList` 简化同步。

# JDK 8 新能力
- `Collection.removeIf`、`Map.computeIfAbsent` 等默认方法，降低模板代码。
- Stream API 将集合转为声明式数据流；并行流需确认数据无共享状态。
- `Map` 的 `forEach`、`merge` 等方法可减少显式空指针判断。

# 常见踩坑
- `HashMap` 在旧版本（JDK 7）存在并发扩容死循环；JDK 8 采用树化避免长链导致退化性能。
- 写入 `Collections.unmodifiableList` 后再强转原始实现会抛出 `UnsupportedOperationException`。
- 将可变对象作为 `HashSet` 键值，若 `hashCode` 变化会导致元素“丢失”。

# 自检清单
- 是否根据访问模式选择合适实现？
- 是否为容器设置预估容量，避免频繁扩容？
- 并发访问是否使用线程安全集合或外层锁？

# 参考资料
- Oracle 官方 Java Collections Framework 概览：https://docs.oracle.com/javase/8/docs/technotes/guides/collections/overview.html
- Java Language Specification - Classes, Interfaces, and Subtyping：https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html
