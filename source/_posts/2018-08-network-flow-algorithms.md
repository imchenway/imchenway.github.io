---
title: 最大流与最小割：Edmonds-Karp、Dinic 与 ISAP
date: 2018-08-19
lang: zh-CN
tags: ['#Algorithm', '#Graph']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 网络流问题
给定有向网络 G = (V, E)，边容量 `c(u,v)`，求源点 s 到汇点 t 的最大流量。最小割定理说明最大流量等于最小割容量。

# 三种算法比较
| 算法 | 复杂度 | 特点 | 实战建议 |
|---|---|---|---|
| Edmonds-Karp | O(VE^2) | BFS 搜索增广路径，易实现 | 小规模或教学 |
| Dinic | O(V^2E) (一般性能好) | 分层网络 + 阻塞流 | 工程常用，适合稀疏图 |
| ISAP | O(V^2E) | 基于最短增广路的改进 | 在密集图或高容量问题表现优 |

# Dinic 代码骨架
```java
class Dinic {
    static class Edge { int to, rev; long cap; }
    private final List<List<Edge>> graph;
    private final int n;
    private int[] level;
    private int[] it;

    Dinic(int n) {
        this.n = n;
        graph = new ArrayList<>(n);
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
    }

    void addEdge(int u, int v, long cap) {
        Edge a = new Edge(); a.to = v; a.cap = cap; a.rev = graph.get(v).size();
        Edge b = new Edge(); b.to = u; b.cap = 0; b.rev = graph.get(u).size();
        graph.get(u).add(a); graph.get(v).add(b);
    }

    boolean bfs(int s, int t) {
        level = new int[n]; Arrays.fill(level, -1);
        Queue<Integer> q = new ArrayDeque<>();
        level[s] = 0; q.offer(s);
        while (!q.isEmpty()) {
            int v = q.poll();
            for (Edge e : graph.get(v)) if (e.cap > 0 && level[e.to] < 0) {
                level[e.to] = level[v] + 1;
                q.offer(e.to);
            }
        }
        return level[t] >= 0;
    }

    long dfs(int v, int t, long f) {
        if (v == t) return f;
        for (; it[v] < graph.get(v).size(); it[v]++) {
            Edge e = graph.get(v).get(it[v]);
            if (e.cap > 0 && level[v] + 1 == level[e.to]) {
                long d = dfs(e.to, t, Math.min(f, e.cap));
                if (d > 0) {
                    e.cap -= d;
                    graph.get(e.to).get(e.rev).cap += d;
                    return d;
                }
            }
        }
        return 0;
    }

    long maxFlow(int s, int t) {
        long flow = 0;
        while (bfs(s, t)) {
            it = new int[n];
            long f;
            while ((f = dfs(s, t, Long.MAX_VALUE)) > 0) flow += f;
        }
        return flow;
    }
}
```

# 实战注意
- 选择 long 处理大容量；
- 处理有向边反向边索引；
- 对多源/多汇场景，引入超级源/汇；
- 在 Dinic 中可添加当前弧优化（`it` 数组）。

# 自检清单
- 是否检测残量网络更新正确？
- 是否对重复边或多重边做合并或扩展？
- 是否评估算法复杂度与数据规模？

# 参考资料
- MIT OCW 6.046 Lecture 19 (Network Flow)：https://ocw.mit.edu/.../lecture-19-network-flow/
- CLRS Chapter 26 Maximum Flow
- Competitive Programming 3 网络流章节
