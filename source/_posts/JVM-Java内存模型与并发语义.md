---
title: Java内存模型与并发语义
date: 2021-10-07
tags: ['#JVM']
---

### 本文目录
<!-- toc -->

# 引言
> Java 内存模型（JMM）定义了线程之间如何通过内存交互，并规定了 `volatile`、锁、原子类等的语义。掌握 happens-before 关系与指令重排规则，才能写出正确的并发程序。

# JMM 基础
## 主内存与工作内存
- 主内存：堆上的共享变量；
- 工作内存：每个线程的本地缓存，线程对变量的操作必须先从主内存读取到工作内存，再写回；
- JMM 约束了这些 read/write 操作的顺序。

## Happens-before 规则
- 程序顺序规则；
- 监视器锁规则（unlock happens-before 后续 lock）；
- volatile 变量法则；
- 线程启动与终止规则；
- 传递性。

# 指令重排与内存屏障
## JVM 对重排的约束
HotSpot 编译器和硬件可以为性能进行指令重排，但需满足 JMM。内存屏障指令（LoadLoad、LoadStore、StoreStore、StoreLoad）确保顺序。`volatile` 在底层通过插入 StoreStore + StoreLoad 屏障实现可见性。

## 双重检查锁定（DCL）的正确写法
```
private volatile Singleton instance;
public Singleton getInstance() {
    if (instance == null) {
        synchronized (this) {
            if (instance == null) {
                instance = new Singleton();
            }
        }
    }
    return instance;
}
```
若 `instance` 未声明为 `volatile`，对象初始化的写入可能被重排，导致其他线程看到部分构造。

# 并发原子性与可见性
- `AtomicLong` 使用 CAS + volatile 保证原子性；
- LongAdder 通过分段热点减轻竞争；
- StampedLock 支持乐观读，需要正确校验 `validate`；
- `VarHandle` 提供更低级的内存语义控制。

# 调试与验证
- JDK 提供 `jcstress` 框架，可验证并发场景下的可见性与原子性；
- 使用 `-XX:+UnlockDiagnosticVMOptions -XX:+PrintAssembly` 查看屏障；
- 通过 `jdeps` 检查依赖，避免旧版 JMM（如 JSR-133 之前）的类库影响。

# 实践建议
- 尽量使用高层并发构件（CompletableFuture、ForkJoinPool）；
- 避免自旋锁占用过多 CPU，可结合 Backoff 策略；
- 在线程池中合理设置核心数、拒绝策略，避免任务堆积；
- 对共享状态使用不可变对象或 copy-on-write 模式；
- 结合性能测试验证扩展性与一致性。

# 总结
JMM 为 Java 并发提供了可预期的语义。理解 happens-before、内存屏障和原子操作，能够指导我们设计线程安全的系统，并避免深层的并发 bug。

# 参考资料
- [1] JSR-133: Java Memory Model and Thread Specification. https://download.oracle.com/otn-pub/jcp/memory_model-1.0-fr-eval-oth-JSpec/
- [2] Brian Goetz 等，《Java 并发编程实战》.
- [3] OpenJDK VarHandle 文档. https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/VarHandle.html
- [4] JCStress 项目主页. https://openjdk.org/projects/code-tools/jcstress/
