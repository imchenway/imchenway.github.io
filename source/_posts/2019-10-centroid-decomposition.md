---
title: 树的重心分解（Centroid Decomposition）实战
date: 2019-10-19
lang: zh-CN
tags: ['#Algorithm', '#Tree']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 重心分解简介
Centroid Decomposition 将树递归拆分为重心与子树，可用于距离统计、路径查询、动态树问题。每次选择当前子树的重心作为根，递归处理剩余部分。

# 算法步骤
1. DFS 计算子树大小；
2. 找到重心：所有子树大小不超过 n/2；
3. 标记重心，递归处理其余子树；
4. 在递归过程中维护路径信息（例如距离数组）。

# 应用案例
- 距离统计：计算满足距离限制的点对数量；
- 树上 K 最近邻：通过重心层级维护最近距离；
- 动态更新：配合位掩码/距离多段数组处理查询。

# 模板框架
```java
class CentroidDecomposition {
    private final List<List<Integer>> tree;
    private final boolean[] removed;
    private final int[] size;

    CentroidDecomposition(List<List<Integer>> tree) {
        this.tree = tree;
        int n = tree.size();
        removed = new boolean[n];
        size = new int[n];
        decompose(0, -1);
    }

    private int dfsSize(int v, int p) {
        size[v] = 1;
        for (int u : tree.get(v)) if (u != p && !removed[u]) {
            size[v] += dfsSize(u, v);
        }
        return size[v];
    }

    private int findCentroid(int v, int p, int total) {
        for (int u : tree.get(v)) if (u != p && !removed[u]) {
            if (size[u] > total / 2) return findCentroid(u, v, total);
        }
        return v;
    }

    private void decompose(int v, int p) {
        int total = dfsSize(v, -1);
        int centroid = findCentroid(v, -1, total);
        removed[centroid] = true;
        // TODO: 处理重心相关逻辑（距离统计等）
        for (int u : tree.get(centroid)) if (!removed[u]) {
            decompose(u, centroid);
        }
    }
}
```

# 自检清单
- 是否正确重置 DFS 状态，避免跨子树污染？
- 是否在递归中维护距离时防止重复计数？
- 是否评估时间复杂度 O(n log n) 与内存开销？

# 参考资料
- CP-Algorithms Centroid Decomposition：https://cp-algorithms.com/graph/centroid_decomposition.html
- emaxx.ru 相关教程
- Competitive Programming 4 高级树算法章节
