---
title: 深入理解 Java 内存模型与 happens-before 规则
date: 2017-08-26
lang: zh-CN
tags: ['#Java', '#JMM']
categories:
  - Java
  - Concurrency
---

### 本文目录
<!-- toc -->

# 为什么需要 JMM
Java 内存模型（Java Memory Model, JMM）定义了多线程环境下的可见性、有序性与原子性语义。它是保证线程安全的理论基础，指导我们使用 `volatile`、锁与原子类。

# happens-before 八大规则
1. **程序次序规则**：单线程内按照代码顺序执行。
2. **管程锁定规则**：解锁操作先行发生于其后对同一锁的加锁。
3. **volatile 变量规则**：对 `volatile` 变量的写先发生于后续读。
4. **线程启动规则**：`Thread.start()` 先行发生于子线程开始。
5. **线程终止规则**：线程终止（`Thread.join` 成功返回）先行发生于主线程之后的操作。
6. **线程中断规则**：对线程的中断调用先行发生于被检查到中断事件。
7. **对象终结规则**：对象构造完成先行发生于 `finalize` 的开始。
8. **传递性**：如果 A happens-before B，B happens-before C，则 A happens-before C。

# `volatile` 与锁
- `volatile` 保证可见性与禁止指令重排序，不保证复合操作原子性；
- `synchronized`/`ReentrantLock` 同时提供互斥与可见性；
- 双重检查锁定必须让单例实例变量 `volatile` 才安全。

# 安全发布模式
1. 在静态初始化器中创建对象；
2. 将对象引用存储至 `volatile` 变量或原子引用；
3. 使用锁保护对象写入；
4. 将引用放入线程安全容器。

# 常见案例
- **指令重排序**：无 `volatile` 的双重检查单例可能读取到未初始化的对象。
- **发布-订阅模型**：生产者写入 `volatile` 标记，消费者读取后刷新数据。
- **不可变对象**：`final` 字段在构造完成后对其他线程可见。

# 调试与验证
- 使用 `jcstress` 运行 JMM 竞态测试；
- Java Flight Recorder 事件 `Java Monitor Blocked`、`Thread Dump` 分析锁争用；
- `hsdis` 反汇编确认指令序列。

# 自检清单
- 是否清楚代码依赖哪些 happens-before 规则？
- 是否使用了安全发布手段让对象对其他线程可见？
- 是否评估锁竞争与 `volatile` 对性能的影响？

# 参考资料
- Java Language Specification - Chapter 17 Threads and Locks：https://docs.oracle.com/javase/specs/jls/se8/html/jls-17.html
- Java Concurrency in Practice（JCiP）JMM 章节：https://jcip.net/
- OpenJDK jcstress 工具介绍：https://openjdk.org/projects/code-tools/jcstress/
