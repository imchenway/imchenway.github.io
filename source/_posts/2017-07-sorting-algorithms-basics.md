---
title: 排序算法基础与复杂度对照表
date: 2017-07-19
tags: ['#Algorithm']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 学习目标
排序是算法入门的基础。掌握比较排序与线性排序的复杂度、稳定性及空间开销，有助于应对数组、链表及大数据量场景。

# 对照表
| 算法 | 时间复杂度 (平均/最坏) | 空间复杂度 | 稳定性 | 备注 |
|---|---|---|---|---|
| 冒泡排序 | O(n²) / O(n²) | O(1) | 稳定 | 适合教学与少量数据 |
| 选择排序 | O(n²) / O(n²) | O(1) | 不稳定 | 每轮选择最小值 |
| 插入排序 | O(n²) / O(n²) | O(1) | 稳定 | 对近乎有序数组效率高 |
| 希尔排序 | O(n log n)~O(n¹·³) | O(1) | 不稳定 | 通过 gap 减少逆序 |
| 归并排序 | O(n log n) / O(n log n) | O(n) | 稳定 | 适合链表与大数据排序 |
| 快速排序 | O(n log n) / O(n²) | O(log n) | 不稳定 | 合理选取枢轴可规避最坏情况 |
| 堆排序 | O(n log n) / O(n log n) | O(1) | 不稳定 | 适合需要原地排序 |
| 计数排序 | O(n + k) / O(n + k) | O(n + k) | 稳定 | k 为值域；适合整数范围较小 |

# 实战策略
1. **小规模数据**：插入排序在数组近乎有序时优势明显，可嵌入快排优化（`Arrays.sort` 在小规模切换为插入排序）。
2. **大规模数组**：归并排序稳定，适合集合框架与外部排序；堆排序保证 O(n log n) 与常数空间。
3. **值域有限**：计数、桶、基数排序可降到线性复杂度，但需额外内存。
4. **并行化**：JDK 8 `Arrays.parallelSort` 利用 Fork/Join 加速大数组排序。

# 练习题单
- 实现带插入排序优化的快速排序。
- 设计稳定的原地 partition。
- 在链表上实现归并排序。
- 使用计数排序统计考试成绩分布。

# 参考资料
- MIT OCW 6.006 Introduction to Algorithms（Lecture 1-4）https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/
- 《Java SE 8 Collections Framework - Arrays》文档：https://docs.oracle.com/javase/8/docs/api/java/util/Arrays.html
