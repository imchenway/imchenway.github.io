---
title: 二进制提升（Binary Lifting）求最近公共祖先（LCA）
date: 2019-06-19
tags: ['#Algorithm', '#Tree']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 算法思路
Binary Lifting 通过预处理 `up[k][v]` 表示节点 v 向上跳 2^k 层的祖先，以 O(log N) 时间回答 LCA 查询。预处理复杂度 O(N log N)。

# 预处理
```java
class LCA {
    private final int LOG;
    private final int[][] up;
    private final int[] depth;
    private final List<List<Integer>> tree;

    LCA(List<List<Integer>> tree, int root) {
        this.tree = tree;
        int n = tree.size();
        LOG = 32 - Integer.numberOfLeadingZeros(n);
        up = new int[LOG][n];
        depth = new int[n];
        dfs(root, root);
    }

    private void dfs(int v, int p) {
        up[0][v] = p;
        for (int k = 1; k < LOG; k++) {
            up[k][v] = up[k - 1][up[k - 1][v]];
        }
        for (int u : tree.get(v)) {
            if (u == p) continue;
            depth[u] = depth[v] + 1;
            dfs(u, v);
        }
    }

    int lca(int a, int b) {
        if (depth[a] < depth[b]) { int tmp = a; a = b; b = tmp; }
        int diff = depth[a] - depth[b];
        for (int k = 0; k < LOG; k++) {
            if (((diff >> k) & 1) == 1) a = up[k][a];
        }
        if (a == b) return a;
        for (int k = LOG - 1; k >= 0; k--) {
            if (up[k][a] != up[k][b]) {
                a = up[k][a];
                b = up[k][b];
            }
        }
        return up[0][a];
    }
}
```

# 扩展
- 支持求第 k 个祖先；
- 结合差分与前缀处理路径问题（如路径和/权值统计）；
- 在动态图中可配合重链剖分或 Link-Cut Tree。

# 自检清单
- 是否正确初始化根节点的祖先（`up[0][root] = root`）？
- 是否处理深度差和跳跃过程中的边界？
- 是否根据树规模合理选择 LOG？

# 参考资料
- CP-Algorithms LCA：https://cp-algorithms.com/graph/lca_binary_lifting.html
- MIT OCW 6.006 Tree Algorithms 讲义
- Competitive Programming 4 LCA 章节
