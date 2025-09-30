---
title: 最大流 Dinic 算法的工程优化
date: 2021-10-19
tags: ['#Algorithms', '#MaxFlow', '#Optimization']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 背景
Dinic 算法在网络流问题中广泛应用，工程环境需要控制内存占用并提升并发性能。

# 优化策略
- 使用邻接数组与结构体池，减少对象分配；
- 层次图构建采用双端队列，快速跳过饱和边；
- 并行构建分层图，利用多线程分割顶点集合。

# 工程实践
- 对残量网络设置断言，保证流量守恒；
- 使用 `LLD` 记录关键路径，便于复现性能瓶颈；
- 引入 `gap` 优化，在层次图出现空层时提前终止。

# 自检清单
- 是否验证重边与自环处理正确？
- 是否在随机与极端图上进行压力测试？
- 是否提供可视化工具检查残量网络？

# 参考资料
- Dinic 原论文：《Algorithm for Solution of a Problem of Maximum Flow in Networks》
- Stanford CS97SI 网络流讲义：https://web.stanford.edu/class/cs97si/08-network-flow-problems.pdf
- cp-algorithms 最大流总结：https://cp-algorithms.com/graph/dinic.html
