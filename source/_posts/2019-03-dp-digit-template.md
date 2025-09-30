---
title: 数位 DP 模板：计数问题统一解法
date: 2019-03-19
tags: ['#Algorithm', '#DynamicProgramming']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 数位 DP 的特点
处理与数字位数相关的计数问题（例如统计区间内某种属性的数量）。采用按位递归，携带限制条件（前缀是否等于上界）、状态（前导零、数位和、余数等）。

# 模板结构
```java
class DigitDP {
    private int[] digits;
    private long[][][] memo; // 示例维度

    long solve(long n) {
        digits = extractDigits(n);
        memo = new long[digits.length][2][MAX_STATE];
        for (long[][] layer : memo) for (long[] arr : layer) Arrays.fill(arr, -1);
        return dfs(digits.length - 1, 1, 0, 0);
    }

    private long dfs(int pos, int limit, int leadingZero, int state) {
        if (pos < 0) return check(state) ? 1 : 0;
        if (!limit && memo[pos][leadingZero][state] != -1) return memo[pos][leadingZero][state];
        int up = limit == 1 ? digits[pos] : 9;
        long res = 0;
        for (int d = 0; d <= up; d++) {
            int nextLeadingZero = leadingZero & (d == 0 ? 1 : 0);
            int nextState = transition(state, d, nextLeadingZero);
            if (!isValid(nextState)) continue;
            res += dfs(pos - 1, limit == 1 && d == up ? 1 : 0, nextLeadingZero, nextState);
        }
        if (!limit) memo[pos][leadingZero][state] = res;
        return res;
    }
}
```

# 常见应用
- 统计不含特定数字的数量；
- 计算数字和/积的属性（如数位和模 m = k 的数量）；
- 统计 0-9 频次；
- 处理上下界 `[L, R]`：结果为 `solve(R) - solve(L-1)`。

# 实战技巧
- 状态设计：根据题目需求定义状态（数位和、是否出现指定数字、前导零等）；
- 剪枝：在 `transition` 中提前判定无效状态；
- 记忆化：限制值 `limit=0` 时才缓存；
- 大数：使用 `long` 或 BigInteger 提取位数。

# 自检清单
- 是否正确处理前导零与状态兼容？
- 是否采用 `[L,R]` 方案，避免重复计算？
- 是否在 DFS 中验证状态限制合理？

# 参考资料
- CP-Algorithms Digit DP：https://cp-algorithms.com/dynamic_programming/digit_dp.html
- 洛谷数位 DP 题单： https://www.luogu.com.cn/tag/digit-dp
- 《Competitive Programming 3》数位 DP 章节
