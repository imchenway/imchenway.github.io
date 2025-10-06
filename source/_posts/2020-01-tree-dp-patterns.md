---
title: 树形动态规划典型题与模板
date: 2020-01-19
lang: zh-CN
tags: ['#Algorithm', '#Tree', '#DynamicProgramming']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 树形 DP 的关键思路
树形 DP 处理树结构上的最优子结构问题，常见技巧包括：先 dfs 统计子树信息、利用父节点信息进行二次 dfs、配合重心或重链剖分优化复杂度。典型状态有「选与不选」「子树贡献」「路径与跨越节点」等。

# 四大模板
1. **树的独立集**：`dp[u][0/1]` 表示选/不选 u 的最大权值；
2. **树的直径**：维护子树最大路径与次大路径，合并得到答案；
3. **树上背包**：遍历儿子时进行状态转移；
4. **reroot 技术**：在第一次 dfs 获得子树答案后，二次 dfs 利用父节点贡献（例如节点距离和）。

```java
void dfs1(int u, int p) {
    dp[u][1] = weight[u];
    for (int v : tree[u]) if (v != p) {
        dfs1(v, u);
        dp[u][0] += Math.max(dp[v][0], dp[v][1]);
        dp[u][1] += dp[v][0];
    }
}
```

# 实战建议
- 使用 `long` 防止溢出；
- 为 reroot 算法准备父边转移公式，避免重复计算；
- 对多次查询的问题结合离线算法（如差分、树链剖分）。

# 自检清单
- 是否正确初始化叶子节点状态？
- 是否确保在二次 dfs 时回退父节点贡献？
- 是否为大数据输入使用迭代栈或优化 I/O？

# 参考资料
- CP-Algorithms Tree DP：https://cp-algorithms.com/graph/tree_dp.html
- Competitive Programming 4 章节
- AtCoder 典型树形 DP 题单
