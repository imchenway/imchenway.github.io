---
title: 二叉树遍历模板：递归与迭代一网打尽
date: 2017-10-19
lang: zh-CN
tags: ['#Algorithm']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 三种深度优先遍历
| 类型 | 顺序 | 典型应用 |
|---|---|---|
| 前序 Preorder | 根 → 左 → 右 | 拷贝树、表达式前缀表示 |
| 中序 Inorder | 左 → 根 → 右 | 二叉搜索树有序输出 |
| 后序 Postorder | 左 → 右 → 根 | 删除树、表达式求值 |

递归写法简洁，但在深度较大时可能造成栈溢出；迭代写法易于控制栈空间。

# 递归模板
```java
void preorder(TreeNode root, List<Integer> res) {
    if (root == null) return;
    res.add(root.val);
    preorder(root.left, res);
    preorder(root.right, res);
}
```

# 迭代模板
```java
List<Integer> inorder(TreeNode root) {
    List<Integer> res = new ArrayList<>();
    Deque<TreeNode> stack = new ArrayDeque<>();
    TreeNode curr = root;
    while (curr != null || !stack.isEmpty()) {
        while (curr != null) {
            stack.push(curr);
            curr = curr.left;
        }
        curr = stack.pop();
        res.add(curr.val);
        curr = curr.right;
    }
    return res;
}
```

# 广度优先遍历（层序）
使用队列保存节点：
```java
List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> res = new ArrayList<>();
    if (root == null) return res;
    Queue<TreeNode> queue = new ArrayDeque<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        int size = queue.size();
        List<Integer> level = new ArrayList<>(size);
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            level.add(node.val);
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        res.add(level);
    }
    return res;
}
```

# Morris 遍历与空间优化
Morris 前序/中序遍历通过线索化树结构，将空间复杂度降为 O(1)，适合节省内存，但会暂时修改树的右指针，使用后需恢复。

# 练习清单
- `LeetCode 94` 中序遍历：迭代模板。
- `LeetCode 102` 层序遍历：队列分层。
- `LeetCode 145` 后序遍历：双栈或反向前序。
- `LeetCode 236` 最近公共祖先：自底向上的递归。

# 自检清单
- 是否区分 DFS 与 BFS 的适用场景？
- 是否考虑极端高度的二叉树导致递归栈溢出？
- 是否使用迭代/尾递归优化来降低空间占用？

# 参考资料
- MIT OCW 6.006 Lecture 4 Trees：https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/resources/lecture-4-trees/ 
- 《Algorithms, 4th Edition》Chapter 4 Trees：https://algs4.cs.princeton.edu/32bst/
- LeetCode 官方探索：二叉树专题 https://leetcode.com/explore/learn/card/data-structure-tree/
