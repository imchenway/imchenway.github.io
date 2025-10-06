---
title: 树状数组（Binary Indexed Tree）原理与实现
date: 2018-07-19
lang: zh-CN
tags: ['#Algorithm', '#DataStructure']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 原理回顾
树状数组（Fenwick Tree）支持区间前缀和查询与单点更新，复杂度 O(log n)。通过利用二进制最低位 `lowbit(x) = x & -x` 将数组索引映射为树结构。

# 数据结构实现
```java
class FenwickTree {
    private final long[] tree;

    FenwickTree(int n) {
        tree = new long[n + 1];
    }

    FenwickTree(long[] nums) {
        this(nums.length);
        for (int i = 0; i < nums.length; i++) {
            add(i + 1, nums[i]);
        }
    }

    void add(int index, long delta) {
        for (int i = index; i < tree.length; i += i & -i) {
            tree[i] += delta;
        }
    }

    long prefixSum(int index) {
        long sum = 0;
        for (int i = index; i > 0; i -= i & -i) {
            sum += tree[i];
        }
        return sum;
    }

    long rangeSum(int left, int right) {
        return prefixSum(right) - prefixSum(left - 1);
    }
}
```

# 应用场景
- **区间求和**：动态数组求前缀和；
- **逆序对统计**：离散化 + Fenwick；
- **树状数组二维拓展**：处理二维区间；
- **差分数组**：配合更新操作实现区间加、区间和。

# 与线段树比较
| 特性 | 树状数组 | 线段树 |
|---|---|---|
| 实现复杂度 | 简洁 | 相对复杂 |
| 支持操作 | 前缀和 / 单点更新 | 多类型区间操作 |
| 空间 | O(n) | O(4n) |
| 扩展性 | 较弱 | 强 |

# 自检清单
- 是否正确处理索引从 1 开始的约定？
- 是否在离散化后保持索引范围？
- 是否考虑 long 防止大数溢出？

# 参考资料
- MIT OCW 6.006 Fenwick Tree 讲义：https://ocw.mit.edu/.../lecture-16-range-queries-segment-trees/
- CP-Algorithms Fenwick Tree：https://cp-algorithms.com/data_structures/fenwick.html
- Competitive Programming Handbook Fenwick Tree 章节
