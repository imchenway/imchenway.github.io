---
title: 二分查找与高频变体题型精讲
date: 2017-08-19
tags: ['#Algorithm']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 二分查找复盘
二分查找适用于单调序列或满足判定函数单调性的集合。通过缩小搜索区间，它将时间复杂度降到 O(log n)。但边界处理不当容易出现死循环或越界。

# 模板对照
```java
int binarySearch(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + ((right - left) >>> 1);
        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}
```

| 变体 | 特点 | 边界处理 |
|---|---|---|
| **lower_bound** | 找到第一个 ≥ target 的位置 | 循环条件 `left < right`，mid 偏左，收缩右边界 |
| **upper_bound** | 找到第一个 > target 的位置 | mid 偏右，收缩左边界 |
| **旋转数组查找** | 数组分为两个有序段 | 判断 mid 所在段与 target 的关系 |
| **答案二分** | 判定函数 `check(x)` 单调 | 在整数区间上二分最小可行解 |

# 高频问题示例
1. **搜索插入位置**（LeetCode 35）：`lower_bound` 模板。
2. **寻找峰值**（LeetCode 162）：利用 mid 与 mid+1 比较决定方向。
3. **平方根/开根号**：在 `[0, x]` 上二分，终止条件控制误差。
4. **木板分割问题**：判定函数检查在给定限制下是否可完成分割。

# 调试技巧
- 使用闭区间 `[left, right]` 或半开区间 `[left, right)`，保持一致；
- 计算 mid 时使用移位避免整型溢出；
- 记录循环不变式，例如“答案一定在 `[left, right]` 内”。

# 自检清单
- 是否明确判定函数的单调性？
- 是否考虑 target 不存在或重复元素的情况？
- 是否在循环退出后检查 `left/right` 是否越界？

# 参考资料
- MIT OCW 6.006 Lecture 2：https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/resources/lecture-2-binary-search-sorting-and-tree-data-structures/
- 《Algorithms, 4th Edition》Binary Search 章节：https://algs4.cs.princeton.edu/11model/
