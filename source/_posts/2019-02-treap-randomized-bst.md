---
title: Treap 随机平衡二叉搜索树：实现与应用
date: 2019-02-19
lang: zh-CN
tags: ['#Algorithm', '#DataStructure']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 原理
Treap = Tree + Heap。每个节点包含键值 key 与随机优先级 priority，满足：
- 二叉搜索树性质：左子树 key < 节点 < 右子树；
- 堆性质：父节点 priority < 子节点（最小堆）。

插入/删除使用旋转保证堆性质，从而实现期望平衡。

# 数据结构
```java
class Treap {
    static class Node {
        int key, priority;
        Node left, right;
        int size;
        Node(int key, int priority) {
            this.key = key;
            this.priority = priority;
            this.size = 1;
        }
    }

    private final Random random = new Random();
    private Node root;

    private int size(Node node) { return node == null ? 0 : node.size; }
    private void update(Node node) { if (node != null) node.size = 1 + size(node.left) + size(node.right); }

    private Node rotateRight(Node y) {
        Node x = y.left;
        Node beta = x.right;
        x.right = y;
        y.left = beta;
        update(y); update(x);
        return x;
    }

    private Node rotateLeft(Node x) {
        Node y = x.right;
        Node beta = y.left;
        y.left = x;
        x.right = beta;
        update(x); update(y);
        return y;
    }

    private Node insert(Node node, int key) {
        if (node == null) return new Node(key, random.nextInt());
        if (key < node.key) {
            node.left = insert(node.left, key);
            if (node.left.priority < node.priority) node = rotateRight(node);
        } else {
            node.right = insert(node.right, key);
            if (node.right.priority < node.priority) node = rotateLeft(node);
        }
        update(node);
        return node;
    }

    public void insert(int key) { root = insert(root, key); }

    public boolean contains(int key) {
        Node node = root;
        while (node != null) {
            if (key == node.key) return true;
            node = key < node.key ? node.left : node.right;
        }
        return false;
    }
}
```

# 应用场景
- 有序集合操作（插入、删除、秩统计）；
- 动态区间问题（Treap + 延迟标记）；
- 结合分裂/合并实现 Rope、可持久结构。

# 自检清单
- 是否使用随机优先级确保平衡？
- 是否在操作后更新节点 size 等附加数据？
- 是否根据需求扩展为可持久 Treap 或带懒标记 Treap？

# 参考资料
- CP-Algorithms Treap：https://cp-algorithms.com/data_structures/treap.html
- emaxx.ru Treap 文章
- 《Competitive Programming 3》随机化数据结构章节
