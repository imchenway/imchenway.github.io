---
title: 拓扑排序与 DAG 动态规划
date: 2018-03-19
lang: zh-CN
tags: ['#Algorithm', '#Graph']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 拓扑排序基础
拓扑排序适用于有向无环图（DAG），提供线性序列使得每条有向边 (u, v) 中 u 都在 v 之前。典型算法包括 Kahn 算法（入度法）与 DFS 递归法。

# Kahn 算法模板
```java
List<Integer> topoSort(int n, List<List<Integer>> graph) {
    int[] indegree = new int[n];
    for (int u = 0; u < n; u++) {
        for (int v : graph.get(u)) indegree[v]++;
    }
    Deque<Integer> queue = new ArrayDeque<>();
    for (int i = 0; i < n; i++) if (indegree[i] == 0) queue.offer(i);
    List<Integer> order = new ArrayList<>();
    while (!queue.isEmpty()) {
        int u = queue.poll();
        order.add(u);
        for (int v : graph.get(u)) {
            if (--indegree[v] == 0) queue.offer(v);
        }
    }
    if (order.size() != n) throw new IllegalStateException("graph has cycle");
    return order;
}
```

# DAG 动态规划
拓扑序可用于在 DAG 上进行 DP 或最短路径计算：
- **最长路径**：在拓扑序上更新 `dist[v] = max(dist[v], dist[u] + w)`；
- **任务调度**：计算最早完成时间；
- **课程安排**：检测环并给出学习顺序。

# 常见问题
- 冲突检测：拓扑排序失败说明存在环。
- 多解性：若有多个入度为 0 的节点，可使用优先队列输出字典序最小序列。
- 边带权：单源最短路径问题可通过拓扑序实现 O(V+E) 算法。

# 自检清单
- 是否正确构建有向图并统计入度？
- 是否在拓扑排序失败时提示环存在？
- 是否利用拓扑序进行后续 DP 或调度计算？

# 参考资料
- MIT OCW 6.006 Lecture 19 DAG Algorithms：https://ocw.mit.edu/.../lecture-19-dag-algorithms/
- CLRS Chapter 22.4 Topological Sort
- LeetCode Graph 专题：https://leetcode.com/tag/topological-sort/
