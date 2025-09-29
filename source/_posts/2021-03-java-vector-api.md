---
title: Java 向量 API（Vector API）性能评估
date: 2021-03-05
tags: ['#Java', '#VectorAPI', '#Performance']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# Vector API 概述
JDK 16 引入 Incubator 状态的 Vector API（JEP 338），用于在 Java 层进行 SIMD 向量化计算。适合数值处理、加解密、机器学习前置处理。

# 基本示例
```java
FloatVector va = FloatVector.fromArray(FloatVector.SPECIES_256, a, i);
FloatVector vb = FloatVector.fromArray(FloatVector.SPECIES_256, b, i);
FloatVector vc = va.mul(vb);
vc.intoArray(result, i);
```

# 性能测试
- 使用 JMH 对比普通循环与 Vector API；
- 确认硬件 SIMD 支持（AVX2/AVX-512）；
- 关注 `-XX:UseAVX` 设置。

# 自检清单
- 是否评估目标平台 SIMD 宽度限制？
- 是否在 JITWatch 中查看向量化指令生成？
- 是否在 JDK 升级时验证 API 变化？

# 参考资料
- JEP 338: Vector API：https://openjdk.org/jeps/338
- Oracle Vector API 指南
- JMH 官方文档：https://openjdk.java.net/projects/code-tools/jmh/
