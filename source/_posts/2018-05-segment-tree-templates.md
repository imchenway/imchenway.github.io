---
title: 线段树与懒惰传播模板
date: 2018-05-19
lang: zh-CN
tags: ['#Algorithm', '#DataStructure']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 线段树基础
线段树（Segment Tree）用于区间查询与更新，支持求和、最大值、最小值等操作，复杂度 O(log n)。通过懒惰标记实现区间更新。

# 结构定义
```java
class SegmentTree {
    private final int[] tree;
    private final int[] lazy;
    private final int n;

    SegmentTree(int[] nums) {
        this.n = nums.length;
        tree = new int[n * 4];
        lazy = new int[n * 4];
        build(1, 0, n - 1, nums);
    }

    private void build(int idx, int l, int r, int[] nums) {
        if (l == r) {
            tree[idx] = nums[l];
            return;
        }
        int mid = (l + r) >>> 1;
        build(idx << 1, l, mid, nums);
        build(idx << 1 | 1, mid + 1, r, nums);
        tree[idx] = tree[idx << 1] + tree[idx << 1 | 1];
    }

    private void pushDown(int idx, int l, int r) {
        if (lazy[idx] != 0) {
            int mid = (l + r) >>> 1;
            apply(idx << 1, l, mid, lazy[idx]);
            apply(idx << 1 | 1, mid + 1, r, lazy[idx]);
            lazy[idx] = 0;
        }
    }

    private void apply(int idx, int l, int r, int delta) {
        tree[idx] += (r - l + 1) * delta;
        lazy[idx] += delta;
    }

    public void update(int L, int R, int delta) { update(1, 0, n - 1, L, R, delta); }

    private void update(int idx, int l, int r, int L, int R, int delta) {
        if (L <= l && r <= R) {
            apply(idx, l, r, delta);
            return;
        }
        pushDown(idx, l, r);
        int mid = (l + r) >>> 1;
        if (L <= mid) update(idx << 1, l, mid, L, R, delta);
        if (R > mid) update(idx << 1 | 1, mid + 1, r, L, R, delta);
        tree[idx] = tree[idx << 1] + tree[idx << 1 | 1];
    }

    public int query(int L, int R) { return query(1, 0, n - 1, L, R); }

    private int query(int idx, int l, int r, int L, int R) {
        if (L <= l && r <= R) return tree[idx];
        pushDown(idx, l, r);
        int mid = (l + r) >>> 1;
        int sum = 0;
        if (L <= mid) sum += query(idx << 1, l, mid, L, R);
        if (R > mid) sum += query(idx << 1 | 1, mid + 1, r, L, R);
        return sum;
    }
}
```

# 应用场景
- 区间加减、区间查；
- 动态区间最大值/最小值；
- 线段树 + 离散化用于范围更新；
- 总和、差分结合处理大数据量。

# 自检清单
- 是否正确处理懒惰标记的传播？
- 是否使用 long 类型防止溢出？
- 是否对离散化/边界做检查？

# 参考资料
- MIT OCW 6.006 Lecture 16 Segment Trees：https://ocw.mit.edu/.../lecture-16-range-queries-segment-trees/
- CP-Algorithms Segment Tree 指南：https://cp-algorithms.com/data_structures/segment_tree.html
- LeetCode 线段树题单：https://leetcode.com/tag/segment-tree/
