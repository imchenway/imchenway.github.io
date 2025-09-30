---
title: Li Chao Tree：动态维护线性函数的最小值
date: 2019-09-19
tags: ['#Algorithm', '#DataStructure']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# Li Chao Tree 简介
Li Chao Tree 维护一组线性函数 `f(x) = ax + b` 的最小值（或最大值）。通过分治划分区间并比较两条线的交点，实现 O(log C) 插入和查询（C 为 x 的取值范围）。

# 数据结构
- 节点维护当前最佳直线与左右区间；
- 插入新直线时比较当前区间端点值并递归分裂。

```java
class LiChaoTree {
    static class Line {
        long a, b;
        long eval(long x) { return a * x + b; }
    }

    static class Node {
        Line line;
        Node left, right;
    }

    private final long leftBound, rightBound;
    private final Node root = new Node();

    LiChaoTree(long leftBound, long rightBound) {
        this.leftBound = leftBound;
        this.rightBound = rightBound;
    }

    public void addLine(long a, long b) {
        addLine(root, new Line(a, b), leftBound, rightBound);
    }

    private void addLine(Node node, Line line, long l, long r) {
        if (node.line == null) {
            node.line = line;
            return;
        }
        long mid = (l + r) >>> 1;
        boolean leftBetter = line.eval(l) < node.line.eval(l);
        boolean midBetter = line.eval(mid) < node.line.eval(mid);
        if (midBetter) {
            Line tmp = node.line;
            node.line = line;
            line = tmp;
        }
        if (r - l == 0) return;
        if (leftBetter != midBetter) {
            if (node.left == null) node.left = new Node();
            addLine(node.left, line, l, mid);
        } else {
            if (node.right == null) node.right = new Node();
            addLine(node.right, line, mid + 1, r);
        }
    }

    public long query(long x) { return query(root, x, leftBound, rightBound); }

    private long query(Node node, long x, long l, long r) {
        if (node == null || node.line == null) return Long.MAX_VALUE;
        long res = node.line.eval(x);
        if (l == r) return res;
        long mid = (l + r) >>> 1;
        if (x <= mid) return Math.min(res, query(node.left, x, l, mid));
        return Math.min(res, query(node.right, x, mid + 1, r));
    }
}
```

# 应用
- 动态规划优化：`dp[i] = min_j (a_j * x_i + b_j)`；
- 凸包与直线集合；
- 在 Li Chao Tree 上处理区间添加、离散化 x 范围。

# 自检清单
- 是否处理 long 溢出与坐标离散化？
- 是否根据范围选择合适的区间（含负值）？
- 是否区分最小值与最大值（取反系数）？

# 参考资料
- CP-Algorithms Li Chao Tree：https://cp-algorithms.com/geometry/convex-hull.html#lichao
- emaxx.ru 文章
- AtCoder Library Li Chao Tree 模板
