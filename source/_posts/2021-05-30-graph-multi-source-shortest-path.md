---
title: 图算法：多源最短路的工程化实践
date: 2021-05-30
lang: zh-CN
tags: ['#Algorithms', '#Graph', '#ShortestPath']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 背景
多源最短路常用于风控、推荐路径扩散等场景，需要在高并发下快速响应并便于增量更新。

# 方案对比
- 多源 BFS：适用于无权图，结合分层队列实现批量并行；
- Dijkstra + 超级源：对正权图构建虚拟源，合并初始边权；
- Johnson 重权重：负边权但无负环时采用，需预处理 Bellman-Ford。

# 实施要点
- 预先对静态路网生成分区索引，减少堆操作；
- 融合 `distance` 与 `parent` 存储，便于重建路径与调试；
- 结合异步刷新队列与增量更新，降低重算成本；
- 引入可视化日志，记录层次扩散与边松弛情况。

# 自检清单
- 是否对负权边进行了校验与隔离？
- 是否提供路径重建与回放接口支持排障？
- 是否对增量更新与批量重建编写性能基准？

# 参考资料
- 多源最短路算法综述（CP-Algorithms）：https://cp-algorithms.com/graph/multi-source-shortest-path.html
- Dijkstra 算法原论文（Edsger W. Dijkstra, Numerische Mathematik 1959）
- Johnson 算法介绍（MIT 6.006）https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/
