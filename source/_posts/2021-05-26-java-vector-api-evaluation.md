---
title: Java 16 Vector API 落地评估
date: 2021-05-26
tags: ['#Java', '#VectorAPI', '#Performance']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 背景
Vector API 作为孵化特性引入，需要评估其在数值计算、加密等场景下的收益与风险。

# 评估维度
- 支持平台：校验 HotSpot C2 对 AVX2/NEON 的指令映射；
- 代码改造：抽象向量运算接口，降级到标量实现；
- 性能对比：使用 JMH 基线与向量化基线，监控吞吐、尾延迟。

# 工程实践
- 启用 `--add-modules jdk.incubator.vector` 并配置 CI；
- 联动 GraalVM/HotSpot，确认 JIT 是否触发自动向量化；
- 建立回滚开关，监控发布后 CPU 利用率与 GC 行为。

# 自检清单
- 是否覆盖不支持向量指令集的降级路径？
- 是否对关键算子进行基准测试并记录报告？
- 是否在安全审计中确认额外的本地指令风险？

# 参考资料
- JEP 338：Vector API (Incubator)：https://openjdk.org/jeps/338
- OpenJDK Vector API 指南：https://openjdk.org/projects/vector/
- JMH 官方文档：https://openjdk.org/projects/code-tools/jmh/
