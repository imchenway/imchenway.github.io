---
title: 状态压缩动态规划：位运算技巧与案例
date: 2018-10-19
lang: zh-CN
tags: ['#Algorithm', '#DynamicProgramming']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 状态压缩 DP 场景
当状态数可表示为位掩码（subset、排列），可利用位运算压缩存储与转移。典型问题：旅行商（TSP）、分配问题、子集优化。

# 基本套路
- 状态 `dp[mask][i]`：表示访问子集 `mask`，最后停在节点 i 的最优值；
- 枚举子集与末尾节点，利用 `mask & -mask`、`mask ^ (1 << i)` 等操作；
- 使用 `Integer.bitCount(mask)` 判断子集大小。

# 示例：旅行商问题 (TSP)
```java
int solveTSP(int n, int[][] dist) {
    int SIZE = 1 << n;
    int INF = 1_000_000_000;
    int[][] dp = new int[SIZE][n];
    for (int[] row : dp) Arrays.fill(row, INF);
    dp[1][0] = 0; // 起点 0

    for (int mask = 1; mask < SIZE; mask++) {
        for (int u = 0; u < n; u++) {
            if ((mask & (1 << u)) == 0) continue;
            int prevMask = mask ^ (1 << u);
            if (prevMask == 0 && u == 0) continue;
            for (int v = 0; v < n; v++) {
                if ((prevMask & (1 << v)) == 0) continue;
                dp[mask][u] = Math.min(dp[mask][u], dp[prevMask][v] + dist[v][u]);
            }
        }
    }

    int ans = INF;
    int full = SIZE - 1;
    for (int u = 1; u < n; u++) {
        ans = Math.min(ans, dp[full][u] + dist[u][0]);
    }
    return ans;
}
```

# 优化技巧
- 枚举子集：`for (int sub = mask; sub > 0; sub = (sub - 1) & mask)`；
- 记忆化搜索：减少无效状态；
- 预计算权重或距离矩阵，减少重复计算。

# 自检清单
- 是否正确初始化基础状态？
- 是否考虑 mask 为 0 或单个元素的边界？
- 是否评估时间复杂度（O(n * 2^n)）并合理设定 n？

# 参考资料
- MIT OCW 6.006 Lecture 18 DP & Bitmask：https://ocw.mit.edu/.../lecture-18-subsets-dp/
- CP-Algorithms Bitmask DP：https://cp-algorithms.com/algebra/all-submasks.html
- LeetCode 状态压缩题单：https://leetcode.com/tag/bit-manipulation/
