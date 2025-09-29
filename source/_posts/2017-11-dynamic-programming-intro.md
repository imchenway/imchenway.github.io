---
title: 动态规划入门：状态定义与转移套路
date: 2017-11-19
tags: ['#Algorithm']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 动态规划核心要素
1. **重叠子问题**：问题可拆分为重复子问题。
2. **最优子结构**：全局最优由局部最优组成。
3. **状态定义**：明确状态含义与维度，如 `dp[i][j]`。
4. **转移方程**：描述状态之间的关系。
5. **初始条件 & 边界**：提供递推起点。

# 典型题型
- **线性 DP**：爬楼梯、打家劫舍、一维背包。
- **区间 DP**：戳气球、石子合并。
- **树形 DP**：求树的最大独立集、路径和。
- **状态压缩**：旅行商问题、集合覆盖。

# 示例：最长上升子序列 (LIS)
```java
int lengthOfLIS(int[] nums) {
    int n = nums.length;
    int[] dp = new int[n];
    Arrays.fill(dp, 1);
    int ans = 1;
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[i] > nums[j]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        ans = Math.max(ans, dp[i]);
    }
    return ans;
}
```

# 常见误区
- 状态定义不完整，缺少维度导致无法转移。
- 未考虑边界（如空数组、单元素），造成数组越界。
- 重复计算：未使用记忆化或优化的递推方式。

# 优化策略
- **空间优化**：若转移只依赖上一行，可降为一维数组（如 01 背包、路径 DP）。
- **二分优化**：LIS 可使用二分+tails，将复杂度降为 O(n log n)。
- **滚动数组**：控制内存占用，尤其在多维状态时。

# 自检清单
- 是否明确列出状态含义与维度？
- 是否写出转移方程并验证样例？
- 是否分析时间、空间复杂度并考虑优化？

# 参考资料
- MIT OCW 6.006 DP 讲义：https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/resources/lecture-11-dynamic-programming-i/ 
- 《CLRS》动态规划章节：https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/
- LeetCode 动态规划专题：https://leetcode.com/tag/dynamic-programming/
