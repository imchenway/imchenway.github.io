---
title: VarHandle 编程模式：现代化替代 Unsafe
date: 2019-07-05
tags: ['#Java', '#VarHandle', '#Concurrency']
categories:
  - Java
  - Concurrency
---

### 本文目录
<!-- toc -->

# VarHandle 简介
VarHandle 在 JDK 9 引入，提供类型安全、内存语义明确的变量访问 API，替代 `sun.misc.Unsafe`。支持原子操作、内存屏障、数组/字段访问。

# 创建示例
```java
record Counter() {
    static final VarHandle VALUE;
    static {
        try {
            VALUE = MethodHandles.lookup()
                .findVarHandle(Counter.class, "value", long.class);
        } catch (ReflectiveOperationException e) {
            throw new ExceptionInInitializerError(e);
        }
    }
    private volatile long value;
}

Counter counter = new Counter();
VALUE.getAndAdd(counter, 1L);
```

# 常用操作
- `get`, `set`, `getVolatile`, `setRelease`, `compareAndSet`, `getAndAdd`；
- 数组访问：`MethodHandles.arrayElementVarHandle(long[].class)`；
- 内存屏障：`getAcquire`, `setRelease`, `getOpaque`, `setOpaque`。

# 应用场景
- 自定义并发容器、锁；
- 性能优化：在高频路径替代 `Atomic*`；
- 与 Fences 组合实现高性能队列（如 JEP 266 Flow API）。

# 注意事项
- VarHandle 使用需处理 `ReflectiveOperationException`；
- 对私有字段需在同一模块内或使用 `privateLookupIn`；
- 仍需遵守内存模型规则，正确选择访问模式；
- 与 JPMS 结合时注意 `opens` 权限。

# 自检清单
- 是否选择合适的内存语义方法（Acquire/Release/Opaque）？
- 是否避免不必要的反射成本，如缓存 VarHandle？
- 是否在模块化环境下配置 `opens` 以允许访问？

# 参考资料
- VarHandle API 文档：https://docs.oracle.com/javase/17/docs/api/java.base/java/lang/invoke/VarHandle.html
- JEP 193: Variable Handles：https://openjdk.org/jeps/193
- Java Concurrency Performance Tuning (VarHandle章节)
