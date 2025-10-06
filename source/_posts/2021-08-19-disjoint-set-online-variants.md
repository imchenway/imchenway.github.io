---
title: 并查集在线算法变体汇总
date: 2021-08-19
lang: zh-CN
tags: ['#Algorithms', '#DisjointSet', '#Online']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 背景
在线处理的并查集需要同时兼顾合并、回滚与查询效率，常用于动态连通性与版本管理场景。

# 关键变体
- 可回滚并查集：利用栈记录合并操作，支持时间旅行；
- 带权并查集：维护差分值，解决方程约束问题；
- DSU on Tree：结合重链或 Euler Tour，处理子树查询。

# 工程落地
- 通过结构共享持久化合并结果，减少复制开销；
- 对回滚操作增加断言，确保操作顺序正确；
- 在高并发环境中使用分区锁或任务分片，避免全局锁竞争。

# 自检清单
- 是否提供调试工具输出合并轨迹？
- 是否评估路径压缩对回滚实现的影响？
- 是否准备大规模随机测试验证正确性？

# 参考资料
- 可回滚并查集介绍（CP-Algorithms）：https://cp-algorithms.com/data_structures/disjoint_set_union.html#toc-tgt-9
- DSU on Tree 指南：https://codeforces.com/blog/entry/44351
- Tarjan 并查集原论文：https://doi.org/10.1137/0208012
