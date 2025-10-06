---
title: Foreign Memory API (JEP 412) 实践手记
date: 2021-11-12
lang: zh-CN
tags: ['#Java', '#ForeignMemory', '#Performance']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 背景
JEP 412 引入的外部内存 API 提供了更安全的 off-heap 操作，需要探索在高性能组件中的应用方式。

# 实践路径
- 使用 `MemorySegment`/`MemoryAddress` 替代 `ByteBuffer`；
- 配置 `ResourceScope` 管理生命周期，避免泄漏；
- 通过 `VarHandle` 实现结构化访问与内存对齐控制。

# 安全注意
- 在敏感操作前，对 `ResourceScope` 设置 `close` 钩子；
- 对齐数据，避免平台差异导致未定义行为；
- 开启 `Foreign` API 警告，跟踪后续 JDK 变更。

# 自检清单
- 是否为所有外部内存释放路径编写测试？
- 是否评估 GC 与 off-heap 内存的双重监控？
- 是否准备回退到 `sun.misc.Unsafe` 的应急方案？

# 参考资料
- JEP 412: Foreign Function & Memory API：https://openjdk.org/jeps/412
- Panama Foreign Memory API 文档：https://openjdk.org/projects/panama/
- Java Platform Migration Guide：https://docs.oracle.com/en/java/javase/17/migrate/migrating-jdk-16-jdk-17.html
