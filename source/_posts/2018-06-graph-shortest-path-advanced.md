---
title: 有向图权重挑战：Johnson 算法与 SPFA 评估
date: 2018-06-19
tags: ['#Algorithm', '#Graph']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 需求场景
- 多源最短路径且存在负权边：Johnson 算法通过重标记后运行 Dijkstra。
- 稀疏图与负边：SPFA（Shortest Path Faster Algorithm）常用于工程实践，但最坏 O(VE)。

# Johnson 算法步骤
1. 向图中添加虚拟源点 q，与所有顶点相连边权 0。
2. 运行 Bellman-Ford 获取每个顶点的潜在函数 h(v)。若存在负环则终止。
3. 调整边权：`w'(u,v) = w(u,v) + h(u) - h(v)`，保证非负。
4. 对每个顶点作为源，运行 Dijkstra 得到距离，再还原实际距离：`dist(u,v) = dist'(u,v) - h(u) + h(v)`。

# SPFA 简介
- 基于队列的松弛算法，采用 Bellman-Ford 优化。
- 常用优化：SLF（Small Label First）、LLL（Large Label Last）。
- 存在最坏情况，例如队列选择不当或图呈现链状，导致性能退化。

# 实战比较
| 算法 | 复杂度 | 适用场景 | 注意事项 |
|---|---|---|---|
| Johnson | O(VE log V) | 多源、稀疏图、负权、无负环 | 需运行 Bellman-Ford 预处理 |
| SPFA | 平均优秀，最坏 O(VE) | 工程中可快速实现 | 需检测性能退化，可加循环次数限制 |
| Dijkstra | O(E log V) | 非负权 | 不适用于负权边 |

# 自检清单
- 是否检测负环？
- 是否评估图结构，选择合适算法？
- 是否在 SPFA 中添加优化与超时保护？

# 参考资料
- MIT OCW 6.006 Shortest Paths 高级篇：https://ocw.mit.edu/.../lecture-15-all-pairs-shortest-paths/
- CLRS Chapter 25 All-Pairs Shortest Paths
- CP-Algorithms Johnson & SPFA：https://cp-algorithms.com/graph/johnson.html
