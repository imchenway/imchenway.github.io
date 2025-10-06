---
title: 可持久化线段树（Persistent Segment Tree）实现与应用
date: 2019-05-19
lang: zh-CN
tags: ['#Algorithm', '#DataStructure']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 可持久化的意义
可持久化线段树允许在每次更新后保留历史版本，支持在不同版本间查询而无需拷贝整个树。常用于离线查询、可回溯数据结构与带时间戳的区间统计。

# 数据结构设计
- 每个节点存储左右子指针与区间值；
- 更新时仅复制路径上的节点，其余节点复用；
- 版本指针存储根节点地址。

```java
class PersistentSegmentTree {
    static class Node {
        Node left, right;
        long value;
        Node(Node left, Node right, long value) {
            this.left = left;
            this.right = right;
            this.value = value;
        }
    }

    private final int n;
    private final List<Node> versions = new ArrayList<>();

    PersistentSegmentTree(long[] initial) {
        this.n = initial.length;
        versions.add(build(0, n - 1, initial));
    }

    private Node build(int l, int r, long[] arr) {
        if (l == r) return new Node(null, null, arr[l]);
        int m = (l + r) >>> 1;
        Node left = build(l, m, arr);
        Node right = build(m + 1, r, arr);
        return new Node(left, right, left.value + right.value);
    }

    public void update(int version, int index, long delta) {
        versions.add(update(versions.get(version), 0, n - 1, index, delta));
    }

    private Node update(Node node, int l, int r, int idx, long delta) {
        if (l == r) return new Node(null, null, node.value + delta);
        int m = (l + r) >>> 1;
        Node left = node.left;
        Node right = node.right;
        if (idx <= m) {
            left = update(node.left, l, m, idx, delta);
        } else {
            right = update(node.right, m + 1, r, idx, delta);
        }
        return new Node(left, right, left.value + right.value);
    }

    public long query(int version, int L, int R) {
        return query(versions.get(version), 0, n - 1, L, R);
    }

    private long query(Node node, int l, int r, int L, int R) {
        if (L <= l && r <= R) return node.value;
        int m = (l + r) >>> 1;
        long sum = 0;
        if (L <= m) sum += query(node.left, l, m, L, R);
        if (R > m) sum += query(node.right, m + 1, r, L, R);
        return sum;
    }

    public int versions() { return versions.size(); }
}
```

# 应用场景
- 离线查询历史区间和；
- 统计第 k 小（Persistent Segment Tree + 离散化）；
- 带时间戳的日志/库存查询；
- 结合二分查找解决「第 k 小」等问题。

# 自检清单
- 是否控制节点数量（O((n + q) log n)）防止内存爆炸？
- 是否对版本索引进行有效管理与回收？
- 是否离散化数据以减少树高度？

# 参考资料
- CP-Algorithms Persistent Segment Tree：https://cp-algorithms.com/data_structures/segment_tree/persistent.html
- 洛谷可持久化题单：https://www.luogu.com.cn/tag/95
- Competitive Programming Handbook 数据结构章节
