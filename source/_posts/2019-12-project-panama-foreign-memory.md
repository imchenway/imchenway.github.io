---
title: Project Panama 外部内存 API 初探
date: 2019-12-05
tags: ['#Java', '#Panama', '#ForeignMemory']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# Project Panama 简介
Project Panama 旨在改进 Java 与本地代码互操作。外部内存 API（JEP 370/383）提供类型安全的内存访问与释放机制，替代 `sun.misc.Unsafe`。JDK 19 起作为预览特性。

# MemorySegment 与 MemoryLayout
```java
try (Arena arena = Arena.ofConfined()) {
    MemorySegment segment = arena.allocate(4 * ValueLayout.JAVA_INT.byteSize());
    segment.setAtIndex(ValueLayout.JAVA_INT, 0, 42);
    int value = segment.getAtIndex(ValueLayout.JAVA_INT, 0);
}
```
- `Arena` 管理生命周期；
- `MemoryLayout` 描述结构体布局；
- 支持字节序、对齐等特性。

# 与本地函数交互
- 使用 `Linker`、`SymbolLookup`：
```java
Linker linker = Linker.nativeLinker();
SymbolLookup lookup = linker.defaultLookup();
MethodHandle strlen = linker.downcallHandle(
    lookup.find("strlen").orElseThrow(),
    FunctionDescriptor.of(ValueLayout.JAVA_LONG, ValueLayout.ADDRESS)
);
```

# 应用场景
- 高性能 IO（Zero Copy）；
- FFI 调用（与 C 库交互）；
- 替代 JNI 简化接口。

# 自检清单
- 是否使用 `Arena` 保证内存及时释放？
- 是否处理结构体对齐与字节序？
- 是否评估 Panana API 预览状态及版本差异？

# 参考资料
- JEP 370/383 外部内存访问 API：https://openjdk.org/jeps/370
- Project Panama 文档：https://openjdk.org/projects/panama/
- Java Magazine: Foreign Memory Access API
