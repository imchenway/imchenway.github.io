---
title: 重链剖分（Heavy-Light Decomposition）与树上路径查询
date: 2018-11-19
tags: ['#Algorithm', '#Tree']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 问题背景
在树上需要频繁查询与更新路径或子树信息时，常用重链剖分 (Heavy-Light Decomposition, HLD) 将树转化为若干线段树/树状数组处理的链。

# 基本步骤
1. **第一次 DFS**：计算每个节点子树大小、父节点、重儿子。
2. **第二次 DFS**：为每个节点分配链顶与 dfs 序，重儿子继续当前链，其他儿子开启新链。
3. **线段树/树状数组**：在 dfs 序上构建数据结构，实现区间更新/查询。

```java
class HLD {
    private final List<List<Integer>> graph;
    private final int[] parent, depth, heavy, head, pos;
    private final int[] value; // 节点权值
    private int currentPos;
    private final SegmentTree seg;

    HLD(List<List<Integer>> graph, int[] value) {
        int n = graph.size();
        this.graph = graph;
        this.value = value;
        parent = new int[n];
        depth = new int[n];
        heavy = new int[n];
        Arrays.fill(heavy, -1);
        head = new int[n];
        pos = new int[n];
        dfs(0, -1);
        decompose(0, 0);
        long[] arr = new long[n];
        for (int i = 0; i < n; i++) arr[pos[i]] = value[i];
        seg = new SegmentTree(arr);
    }

    private int dfs(int v, int p) {
        int size = 1;
        int maxSubtree = 0;
        for (int u : graph.get(v)) {
            if (u == p) continue;
            parent[u] = v;
            depth[u] = depth[v] + 1;
            int subtree = dfs(u, v);
            if (subtree > maxSubtree) {
                maxSubtree = subtree;
                heavy[v] = u;
            }
            size += subtree;
        }
        return size;
    }

    private void decompose(int v, int h) {
        head[v] = h;
        pos[v] = currentPos++;
        if (heavy[v] != -1) decompose(heavy[v], h);
        for (int u : graph.get(v)) {
            if (u != parent[v] && u != heavy[v]) {
                decompose(u, u);
            }
        }
    }

    long queryPath(int a, int b) {
        long res = 0;
        while (head[a] != head[b]) {
            if (depth[head[a]] < depth[head[b]]) {
                int tmp = a; a = b; b = tmp;
            }
            res += seg.query(pos[head[a]], pos[a]);
            a = parent[head[a]];
        }
        if (depth[a] > depth[b]) {
            int tmp = a; a = b; b = tmp;
        }
        res += seg.query(pos[a], pos[b]);
        return res;
    }
}
```

# 应用场景
- 路径求和/最大值；
- 支持区间更新（配合懒标记线段树）；
- 与差分结合处理边权问题。

# 自检清单
- 是否正确选择重儿子并维护 dfs 序？
- 是否注意边权 vs 点权的差异？
- 是否优化数据结构以支持所需操作？

# 参考资料
- CP-Algorithms Heavy-Light Decomposition：https://cp-algorithms.com/graph/hld.html
- MIT OCW 6.851 Advanced Data Structures（树分解章节）
- 《Competitive Programming 3》相关章节
