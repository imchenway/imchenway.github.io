---
title: 区间动态规划模板与案例实战
date: 2018-01-19
tags: ['#Algorithm', '#DynamicProgramming']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 适用场景
区间 DP 处理需要在区间上决策的问题，如石子合并、戳气球、矩阵链乘法。其特点是状态依赖于较小区间的结果。

# 状态设计
- 定义 `dp[i][j]` 表示闭区间 `[i, j]` 的最优值。
- 枚举区间长度 `len`，从小到大递推。
- 对于拆分点 `k`，通常形式为 `dp[i][j] = min/max(dp[i][k] + dp[k+1][j] + cost)`。

# 示例：矩阵链乘法
```java
int matrixChainOrder(int[] dims) {
    int n = dims.length - 1;
    int[][] dp = new int[n][n];
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            dp[i][j] = Integer.MAX_VALUE;
            for (int k = i; k < j; k++) {
                int cost = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
                dp[i][j] = Math.min(dp[i][j], cost);
            }
        }
    }
    return dp[0][n - 1];
}
```

# 优化技巧
- 枚举顺序：外层长度、内层起点，保证依赖已计算。
- 前缀和/差分加速：如石子合并需要快速计算区间和。
- Knuth 优化、四边形不等式：满足特定条件可将枚举拆分点复杂度降为 O(n^2)。

# 练习清单
- `LeetCode 312` 戳气球：记忆化搜索或区间 DP。
- `POJ 1953` 石子合并：前缀和 + 区间 DP。
- `HDU 1003` Max Sum：可转化为区间问题。

# 自检清单
- 是否正确初始化单元素区间 `dp[i][i]`？
- 是否使用前缀和降低区间开销？
- 是否分析是否满足 Knuth 优化条件？

# 参考资料
- MIT OCW 6.046 Lecture 12 Dynamic Programming II：https://ocw.mit.edu/.../lecture-12-dynamic-programming-ii/
- CLRS Chapter 15.2 Matrix-Chain Multiplication
- LeetCode Dynamic Programming Solutions：https://leetcode.com/tag/dynamic-programming/
