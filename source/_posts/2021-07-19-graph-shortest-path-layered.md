---
title: 图算法：分层图最短路优化
date: 2021-07-19
tags: ['#Algorithms', '#Graph', '#ShortestPath']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 背景
复杂约束下的最短路问题常通过分层图解决，需要关注层间边数膨胀与内存控制。

# 优化策略
- 将状态压缩为位掩码，减少层数与边数量；
- 使用多级优先队列，区分普通边与零权边；
- 引入可视化调试，验证层转换与约束逻辑正确。

# 工程落地
- 对状态转移编写属性测试，防止非法层穿越；
- 提供缓存与剪枝策略，避免指数级爆炸；
- 在部署前运行大规模随机图基准测试。

# 自检清单
- 是否标注层间转换的业务含义与限制？
- 是否检测负权环与不可达状态？
- 是否评估内存使用与 GC 行为？

# 参考资料
- 分层图建模指南（CP-Algorithms）：https://cp-algorithms.com/graph/layered-graph.html
- CLRS 最短路章节：https://mitpress.mit.edu/9780262046305/introduction-to-algorithms-fourth-edition/
- KACTL Graph Library：https://github.com/kth-competitive-programming/kactl
