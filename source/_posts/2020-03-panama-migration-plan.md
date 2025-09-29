---
title: 从 JNI 迁移至 Project Panama 的路线图
date: 2020-03-05
tags: ['#Java', '#Panama', '#JNI']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 迁移动机
JNI 提供 Java 与本地库互操作，但存在开发复杂度高、性能开销大、安全性差的问题。Project Panama 的外部函数与内存 API（JEP 424）提供类型安全、零拷贝访问，使得迁移后可以提升可维护性与性能。

# 迁移步骤
1. **依赖盘点**：列出现有 JNI 入口、头文件、Native 实现。
2. **生成函数描述**：利用 `jextract` 从头文件生成 Panama 绑定：
```bash
jextract \
  --output generated \
  --source \
  --target-package com.example.native \
  /usr/include/libsample.h
```
3. **替换 JNI 调用**：使用 `Linker.downcallHandle` 获得 `MethodHandle`。
4. **内存管理**：使用 `Arena`、`MemorySegment` 管理生命周期，替代 `NewDirectByteBuffer`。
5. **性能验证**：通过 JMH/JFR 对比 JNI 与 Panama；
6. **安全评估**：确认 `--enable-native-access=...` 配置与 sandbox 策略。

# 并行策略
- 可先将 JNI 封装在接口背后，通过 Feature Flag 切换；
- 对不可迁移的部分保留 JNI，逐步替换；
- 使用 GraalVM Native Image 时，配置 `--initialize-at-build-time` 与反射配置文件。

# 自检清单
- 是否评估目标平台支持 Panama API？
- 是否通过 jextract 自动生成绑定并避免手写错误？
- 是否利用 JMH/JFR 验证性能与内存占用？

# 参考资料
- JEP 424: Foreign Function & Memory API：https://openjdk.org/jeps/424
- jextract 文档：https://openjdk.org/projects/panama/jextract
- Panama Early-Access Guide：https://wiki.openjdk.org/display/panama
