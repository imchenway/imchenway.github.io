---
title: HotSpot 对象布局解析：Mark Word 与压缩指针
date: 2017-10-12
tags: ['#JVM', '#Memory']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 对象在内存中的组成
HotSpot 中的 Java 对象由三部分组成：
1. **对象头 (Header)**：包括 Mark Word 与 Klass Pointer；数组对象还包含长度字段。
2. **实例数据 (Fields)**：按照声明顺序、对齐填充；受 `-XX:FieldsAllocationStyle`、`-XX:+UseCompressedOops` 影响。
3. **对齐填充 (Padding)**：保证对象大小为 8 字节倍数。

# Mark Word 结构
Mark Word 存储对象运行时信息，取决于对象所处状态：
| 位宽 | 内容 |
|---|---|
| 32/64 bit | 哈希码、GC 分代年龄、锁标志位、偏向锁线程 ID 与时间戳 |

锁状态迁移：无锁 → 偏向锁 → 轻量级锁 → 重量级锁。`-XX:+PrintBiasedLockingStatistics` 可观察偏向锁。JDK 15 默认关闭偏向锁，可通过 `-XX:+UseBiasedLocking` 开启。

# 压缩指针（Compressed Oops）
- 默认在 64 位 JVM、堆小于 32GB 时启用，减少对象头与引用占用。
- 通过 `-XX:-UseCompressedOops` 关闭；类指针压缩由 `-XX:+UseCompressedClassPointers` 控制。
- 对象地址计算：`(narrow_oop << 3) + base`，节省内存同时保持 8 字节对齐。

# 工具与实战
- `java -XX:+PrintCommandLineFlags` 查看压缩指针状态。
- 使用 JOL（Java Object Layout）验证对象占用：
```java
System.out.println(ClassLayout.parseInstance(new Object()).toPrintable());
```
- GC 日志中的 `Heap: 1G(4G)` 等信息可辅助判断对象分配与存活。

# 自检清单
- 是否了解对象头在不同锁状态下的变化？
- 是否评估压缩指针对性能与内存的影响？
- 是否利用 JOL 等工具验证关键数据结构的内存占用？

# 参考资料
- HotSpot 虚拟机对象布局文档：https://docs.oracle.com/en/java/javase/17/gctuning/garbage-collector-implementation.html#GUID-565C3B57-DB70-4D8B-9E0C-5A7E724F6023
- JEP 374: Disable and Deprecate Biased Locking：https://openjdk.org/jeps/374
- OpenJDK/HotSpot 源码（oops/oop.hpp）：https://hg.openjdk.org/jdk/jdk/file/tip/src/hotspot/share/oops/oop.hpp
