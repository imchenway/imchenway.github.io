---
title: 最小费用最大流（Min-Cost Max-Flow）算法实现
date: 2019-12-19
tags: ['#Algorithm', '#Graph', '#Flow']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 问题定义
在给定容量与单位费用的网络中，寻找满足最大流量的同时总费用最小的流。广泛用于任务分配、费用管理、循环流问题。

# 常用算法
- **SPFA + Bellman-Ford**：简单实现，适合小规模；
- **Dijkstra + Potentials (Johnson)**：适合非负边，复杂度 O(FE log V)；
- **Cost Scaling**：更高效但实现复杂。

# 代码框架（Dijkstra + 潜在函数）
```java
class MinCostMaxFlow {
    static class Edge {
        int to, rev, cap;
        long cost;
        Edge(int to, int rev, int cap, long cost) {
            this.to = to; this.rev = rev; this.cap = cap; this.cost = cost;
        }
    }
    private final List<List<Edge>> graph;
    private final long[] potential, dist;
    private final Edge[] parent;

    MinCostMaxFlow(int n) {
        graph = new ArrayList<>(n);
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        potential = new long[n];
        dist = new long[n];
        parent = new Edge[n];
    }

    void addEdge(int u, int v, int cap, long cost) {
        graph.get(u).add(new Edge(v, graph.get(v).size(), cap, cost));
        graph.get(v).add(new Edge(u, graph.get(u).size() - 1, 0, -cost));
    }

    long[] minCostMaxFlow(int s, int t) {
        long flow = 0, cost = 0;
        Arrays.fill(potential, 0);
        while (dijkstra(s, t)) {
            int add = Integer.MAX_VALUE;
            for (int v = t; v != s;) {
                Edge e = parent[v];
                add = Math.min(add, e.cap);
                v = graph.get(v).get(e.rev).to;
            }
            for (int v = t; v != s;) {
                Edge e = parent[v];
                e.cap -= add;
                graph.get(v).get(e.rev).cap += add;
                cost += add * e.cost;
                v = graph.get(v).get(e.rev).to;
            }
            flow += add;
        }
        return new long[]{flow, cost};
    }

    private boolean dijkstra(int s, int t) {
        Arrays.fill(dist, Long.MAX_VALUE);
        dist[s] = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingLong(a -> a[1]));
        pq.offer(new int[]{s, 0});
        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            int v = cur[0];
            if (cur[1] != dist[v]) continue;
            for (Edge e : graph.get(v)) if (e.cap > 0) {
                long nd = dist[v] + e.cost + potential[v] - potential[e.to];
                if (nd < dist[e.to]) {
                    dist[e.to] = nd;
                    parent[e.to] = e;
                    pq.offer(new int[]{e.to, (int) nd});
                }
            }
        }
        if (dist[t] == Long.MAX_VALUE) return false;
        for (int i = 0; i < potential.length; i++) if (dist[i] < Long.MAX_VALUE) potential[i] += dist[i];
        return true;
    }
}
```

# 自检清单
- 是否处理负费用（通过潜在函数）并避免负环？
- 是否考虑容量、费用可能超出 `int` 范围使用 long？
- 是否针对大规模问题选择更高效算法？

# 参考资料
- CP-Algorithms Min Cost Flow：https://cp-algorithms.com/graph/min_cost_flow.html
- CLRS Chapter 29 Network Flow
- Stanford CS97SI 课程
