---
title: 树形动态规划性能调优手册
date: 2021-09-19
lang: zh-CN
tags: ['#Algorithms', '#DynamicProgramming', '#Optimization']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 背景
树形 DP 常用于分治与组合优化问题，在大规模图上需要控制堆分配与递归深度。

# 优化策略
- 使用 `int` 数组重用内存，避免频繁装箱；
- 引入 `Euler Tour` 序列，将树 DP 转化为区间问题；
- 对递归深度接近限制的场景，改写为显式栈。

# 工程实践
- 借助 JMH 基准框架评估各优化点收益；
- 对关键算子添加断言与 Profiling 指标；
- 在 CI 中纳入随机大图测试，发现栈溢出风险。

# 自检清单
- 是否控制递归深度与 JVM 栈大小？
- 是否使用缓存避免重复子树计算？
- 是否验证时间与空间复杂度满足 SLA？

# 参考资料
- 树形 DP 综述（OI-wiki）：https://oi-wiki.org/dp/tree/
- JMH 官方文档：https://openjdk.org/projects/code-tools/jmh/
- ACSL Trees and Dynamic Programming：https://usaco.guide/gold/tree-dp?lang=cpp
