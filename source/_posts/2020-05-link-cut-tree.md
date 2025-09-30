---
title: Link-Cut Tree（Splay 动态树）入门指南
date: 2020-05-19
tags: ['#Algorithm', '#DataStructure', '#DynamicTree']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# Link-Cut Tree 的用途
Link-Cut Tree (LCT) 是一种基于 Splay 的动态树结构，支持在森林上执行 `link`、`cut`、`findRoot`、路径加/查询等操作，时间复杂度均为摊还 O(log n)。广泛用于动态图、在线树 DP、网络流水问题。

# 核心概念
- **实链与虚链**：通过 Splay 维护根到节点的首尾路径；
- **Access**：将节点提升为偏右链，为后续 `link/cut` 提供基础；
- **PushUp/PushDown**：维护子树信息与翻转标记；
- **MakeRoot**：将节点设置为所在树的新根。

# 操作流程示例
```java
void access(Node x) {
    Node last = null;
    for (Node y = x; y != null; y = y.father) {
        splay(y);
        y.right = last;
        pushUp(y);
        last = y;
    }
    splay(x);
}

void makeRoot(Node x) {
    access(x);
    x.rev ^= 1;
}

void link(Node x, Node y) {
    makeRoot(x);
    x.father = y;
}

void cut(Node x, Node y) {
    makeRoot(x);
    access(y);
    if (y.left == x) {
        y.left.father = null;
        y.left = null;
        pushUp(y);
    }
}
```

# 自检清单
- 是否实现 `pushDown` 处理翻转标记，保证路径操作正确？
- 是否在 `splay` 中维护父节点关系，防止孤儿节点？
- 是否通过单元测试覆盖 `link-cut`、路径查询等操作？

# 参考资料
- emaxx.ru Link-Cut Tree 教程
- CP-Algorithms Link/Cut Tree：https://cp-algorithms.com/data_structures/link_cut_tree.html
- 《Competitive Programming 4》动态树章节
