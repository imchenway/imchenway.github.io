---
title: Meet-in-the-Middle 算法设计与典型题目
date: 2018-12-19
lang: zh-CN
tags: ['#Algorithm', '#Search']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 思路概述
Meet-in-the-Middle (MITM) 在指数级问题中常用，将规模 n 的问题拆分为 n/2，两侧枚举后组合，复杂度从 O(2^n) 降至 O(2^{n/2})。

# 常见场景
- 子集和、部分和问题；
- 旅行计划/背包近似；
- 密码学暴力破解（双向搜索）；
- 组合优化（最优分割、最大子集）。

# 子集和计数示例
```java
long countSubsets(int[] nums, int target) {
    int mid = nums.length / 2;
    int[] left = Arrays.copyOfRange(nums, 0, mid);
    int[] right = Arrays.copyOfRange(nums, mid, nums.length);

    List<Integer> leftSums = enumerate(left);
    List<Integer> rightSums = enumerate(right);
    Collections.sort(rightSums);

    long count = 0;
    for (int sum : leftSums) {
        int need = target - sum;
        int l = lowerBound(rightSums, need);
        int r = upperBound(rightSums, need);
        count += r - l;
    }
    return count;
}

List<Integer> enumerate(int[] arr) {
    List<Integer> sums = new ArrayList<>();
    int m = arr.length;
    for (int mask = 0; mask < (1 << m); mask++) {
        int s = 0;
        for (int i = 0; i < m; i++) {
            if ((mask & (1 << i)) != 0) s += arr[i];
        }
        sums.add(s);
    }
    return sums;
}
```

# 优化技巧
- 对右半部分排序并使用二分查找；
- 结合剪枝（如提前判断超出目标）；
- 与位运算/DP 结合处理多个约束；
- 在图搜索中使用双向 BFS。

# 自检清单
- 是否正确处理重复元素与计数？
- 是否考虑负数与超界情况？
- 是否评估空间复杂度 (O(2^{n/2})) 可接受？

# 参考资料
- MIT OCW 6.046 Meeting in the Middle：https://ocw.mit.edu/.../lecture-21-approximation-algorithms/
- CP-Algorithms Meet-in-the-Middle：https://cp-algorithms.com/cp-algorithms/meet-in-the-middle.html
- LeetCode 专题（如 1755, 805）
