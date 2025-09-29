---
title: 链表与栈高频题型归纳与模板
date: 2017-09-19
tags: ['#Algorithm']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 链表操作常见技巧
- **双指针**：快慢指针用于检测环、寻找中点；滑动窗口处理固定长度子链。
- **虚拟头节点**：统一删除、插入逻辑，避免单独处理首节点。
- **反转链表**：迭代与递归两种模板，K 组反转可在基础模板上扩展。
- **交叉链表**：使用 `lenA + lenB` 双指针或哈希表定位交点。

# 栈的典型场景
- **括号匹配/表达式求值**：维护符号栈与数值栈；使用优先级或逆波兰表示法。
- **单调栈**：计算下一个更大元素、柱状图最大矩形、每日温度等题型。
- **栈模拟递归**：如二叉树非递归遍历、表达式解析。

# 模板代码示例
```java
ListNode reverseList(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}

int[] nextGreaterElements(int[] nums) {
    int n = nums.length;
    int[] ans = new int[n];
    Arrays.fill(ans, -1);
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && nums[i] > nums[stack.peek()]) {
            ans[stack.pop()] = nums[i];
        }
        stack.push(i);
    }
    return ans;
}
```

# 典型题清单
1. `LeetCode 141` 环形链表：快慢指针。
2. `LeetCode 206` 反转链表：迭代模板。
3. `LeetCode 445` 两数相加 II：栈辅助从低位到高位求和。
4. `LeetCode 739` 每日温度：单调栈求下一个更大值。
5. `LeetCode 25` K 个一组翻转链表：分段使用反转模板。

# 自检清单
- 链表操作是否覆盖头尾边界？
- 是否选择了合适的数据结构（双向链表、栈、队列）降低复杂度？
- 是否分析空间复杂度，必要时使用就地算法？

# 参考资料
- MIT OCW 6.006 Lecture 3（Stacks & Queues）：https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/resources/lecture-3-stacks-and-queues/ 
- LeetCode 官方题解与复杂度分析：https://leetcode.com/problemset/
- 《Algorithms, 4th Edition》Linked Lists & Stack 章节：https://algs4.cs.princeton.edu/13stacks/
