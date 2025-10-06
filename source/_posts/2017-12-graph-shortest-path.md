---
title: 图最短路径算法：Dijkstra、Bellman-Ford 与 Floyd-Warshall
date: 2017-12-19
lang: zh-CN
tags: ['#Algorithm']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 问题定义
给定带权图，求某个源点到其他节点的最短路径。根据边权是否存在负数、是否需要多源最短路径选择不同算法。

# 算法对比
| 算法 | 复杂度 | 适用场景 | 特点 |
|---|---|---|---|
| Dijkstra + 堆 | O(E log V) | 非负权单源 | 使用优先队列优化，适合稀疏图 |
| Bellman-Ford | O(VE) | 包含负权边、检测负环 | 每轮松弛所有边 |
| Floyd-Warshall | O(V^3) | 多源最短路径 | 动态规划，简单但耗时 |

# Dijkstra 模板
```java
int[] dijkstra(int n, List<int[]>[] graph, int source) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[source] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
    pq.offer(new int[]{source, 0});
    while (!pq.isEmpty()) {
        int[] curr = pq.poll();
        int u = curr[0];
        int d = curr[1];
        if (d > dist[u]) continue;
        for (int[] edge : graph[u]) {
            int v = edge[0];
            int w = edge[1];
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.offer(new int[]{v, dist[v]});
            }
        }
    }
    return dist;
}
```

# Bellman-Ford 与负环
- 进行 V-1 轮松弛；
- 第 V 轮仍有更新则存在负环；
- 可用于货币套利、时序依赖等问题。

# Floyd-Warshall
- 使用三层循环更新 `dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`；
- 支持路径重建与传递闭包计算；
- 可扩展到求解所有点的最短路径或判断图是否包含负环。

# 自检清单
- 是否根据权值特性选择合适算法？
- 是否正确初始化距离、处理不可达情况？
- 是否检测并处理负环（Bellman-Ford/Floyd）？

# 参考资料
- MIT OCW 6.006 Shortest Paths：https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/resources/lecture-12-shortest-paths/ 
- 《Algorithms, 4th Edition》Graphs Shortest Paths：https://algs4.cs.princeton.edu/44sp/ 
- CLRS Chapter 24 最短路径算法：https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/
