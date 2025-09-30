---
title: 最小生成树算法：Kruskal 与 Prim 的工程实践
date: 2018-04-19
tags: ['#Algorithm', '#Graph']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 问题定义
最小生成树（MST）在连通无向加权图中选择总权值最小的边集，使得所有节点互通且无环。常见算法：Kruskal、Prim、Boruvka。

# Kruskal 算法
- 按边权排序；
- 逐条选择最小边，使用并查集判断是否成环；
- 时间复杂度 O(E log E)。
```java
int kruskal(int n, List<Edge> edges) {
    Collections.sort(edges);
    UnionFind uf = new UnionFind(n);
    int weight = 0, count = 0;
    for (Edge e : edges) {
        if (uf.union(e.u, e.v)) {
            weight += e.w;
            if (++count == n - 1) break;
        }
    }
    if (count != n - 1) throw new IllegalStateException("graph not connected");
    return weight;
}
```

# Prim 算法
- 从任意节点出发，使用最小堆维护可达边；
- 每次选择权值最小的边扩展节点。
- 适合稠密图或使用邻接矩阵表示的场景。

# 工程注意事项
- 数据结构：Kruskal 需高效排序 + 并查集；Prim 使用 `PriorityQueue`。
- 溢出处理：权值相加需注意 long 类型。
- 图连通性：确保输入为连通图，否则需返回多个生成树或报告错误。

# 自检清单
- 是否正确实现并查集防止成环？
- 是否考虑权值范围并使用合适数据类型？
- 是否根据图稀疏/稠密选择算法？

# 参考资料
- MIT OCW 6.006 Lecture 13 Minimum Spanning Trees：https://ocw.mit.edu/.../lecture-13-minimum-spanning-trees/
- CLRS Chapter 23 Minimum Spanning Trees
- Algorithms, 4th Edition MST 章节：https://algs4.cs.princeton.edu/43mst/
