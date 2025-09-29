---
title: 并查集（Union-Find）应用与优化
date: 2018-02-19
tags: ['#Algorithm', '#DataStructure']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 核心理念
并查集用于维护动态连通性，支持合并集合与查询是否连通。通过路径压缩与按秩合并，操作复杂度接近 O(α(n))。

# 经典实现
```java
class UnionFind {
    private final int[] parent;
    private final int[] rank;
    private int count;

    UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        count = n;
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    void union(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        if (rootX == rootY) return;
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        count--;
    }

    boolean connected(int x, int y) {
        return find(x) == find(y);
    }

    int count() { return count; }
}
```

# 应用场景
- **网络连通性**：判断图是否连通、统计连通分量。
- **最小生成树**：Kruskal 算法中检测环。
- **冗余连接/朋友圈问题**：动态群组管理。
- **图像处理**：连通域标记。
- **离线查询**：Tarjan 并查集解决 LCA（最近公共祖先）。

# 进阶技巧
- 重构 ID：处理字符串或坐标时使用 `Map` 映射。
- 带权并查集：维护额外信息（差值、比率），用于方程约束问题（LeetCode 399）。
- 可撤销并查集：在回溯或分治场景（如 CDQ 分治）中使用。

# 自检清单
- 是否实现路径压缩与按秩合并？
- 是否考虑动态变化导致的节点映射？
- 是否根据题目需要扩展带权或可撤销特性？

# 参考资料
- MIT OCW 6.006 Union-Find：https://ocw.mit.edu/.../lecture-6-union-find-data-structure/
- 《Algorithms, 4th Edition》Section 1.5 Dynamic Connectivity：https://algs4.cs.princeton.edu/15uf/
- Tarjan Offline LCA 原始论文：《Finding Lowest Common Ancestors》
