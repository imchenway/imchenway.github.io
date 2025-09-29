---
title: 弦图算法综述：最小顶点覆盖与最优着色
date: 2020-02-19
tags: ['#Algorithm', '#Graph', '#Chordal']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 弦图特点
弦图（Chordal Graph）是任意长度 ≥ 4 的环都存在弦的图。弦图拥有完美消除序列（Perfect Elimination Ordering, PEO），基于该序列可以在线性时间内求解最小顶点覆盖、最大团、图着色等 NP 完全问题的特例。

# 构造 PEO
- **Lexicographic BFS (Lex-BFS)**：在 O(n + m) 时间构造 PEO；
- 验证：对每个顶点，检查其邻居在 PEO 中形成团。

```java
List<Integer> lexBfs(int n, List<List<Integer>> graph) {
    List<List<Integer>> buckets = new ArrayList<>();
    buckets.add(new ArrayList<>());
    buckets.get(0).addAll(IntStream.range(0, n).boxed().toList());
    List<Integer> order = new ArrayList<>();
    List<List<Integer>> labels = new ArrayList<>(n);
    for (int i = 0; i < n; i++) labels.add(new ArrayList<>());
    while (!buckets.isEmpty()) {
        List<Integer> bucket = buckets.remove(buckets.size() - 1);
        int v = bucket.remove(bucket.size() - 1);
        order.add(v);
        for (int u : graph.get(v)) {
            if (!order.contains(u)) {
                labels.get(u).add(order.size());
            }
        }
        // 省略重新划分桶的实现，参考 CP-Algorithms
    }
    return order;
}
```

# 基于 PEO 的算法
- **最大团/最小着色**：按 PEO 逆序着色，着色数 = 最大团大小。
- **最小顶点覆盖**：由最大团与 PEO 可以在 O(n + m) 求得，利用 Gallai 定理（最小顶点覆盖 = |V| - 最大独立集）。
- **树分解**：弦图的 clique tree 可在 O(n + m) 构造。

# 自检清单
- 是否使用 Lex-BFS 生成并验证 PEO？
- 是否根据 PEO 逆序实现着色而非使用贪心？
- 是否利用 clique tree 解决动态规划问题？

# 参考资料
- CP-Algorithms Chordal Graphs：https://cp-algorithms.com/graph/chordal-graphs.html
- "Algorithm Design" (Kleinberg & Tardos) Chordal Graph 章节
- Stanford CS168 Lecture Notes on Chordal Graphs
