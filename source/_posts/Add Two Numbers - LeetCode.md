---
date: 2019-11-12
lang: zh-CN
tags: ['#LeetCode']
---

### 本文目录
<!-- toc -->

# 题目描述

> - 两数相加：
>   - 给出两个`非空`的链表用来表示两个非负的整数。其中，它们各自的位数是按照`逆序`的方式存储的，并且它们的每个节点只能存储`一位`数字。
>   - 如果，我们将这两个数相加起来，则会返回一个新的链表来表示它们的和。
>   - 您可以假设除了数字 0 之外，这两个数都不会以 0 开头。
> - 示例：
>   - 输入：(2 -> 4 -> 3) + (5 -> 6 -> 4)
>   - 输出：7 -> 0 -> 8
>   - 原因：342 + 465 = 807


# 题外话
- 上来审题不清楚以为是倒序相加然后进位
例如： 
  - 输入`（2 -> 3 -> 4) + (5 -> 6-> 7)` 时，结果应该是 `234 + 567 = 801`，输出 `8 -> 0 -> 1`;
  - 这样的话咋一看其实也很简单，只需要将两个链表中的数字`234`和`567`取出后再放入链表输出即可；
  - but！！！
    - 将题解放上LeetCode后，官方的测试用例中有类似`（9 -> 9 -> 9 -> 9 -> 9 -> 9 -> 9 -> 9 -> 9 -> 9 -> 9 -> 9 -> 9 -> 9 -> 9 -> 9 -> 9 -> 9) + (5 -> 6-> 7)`的极限测试，将取出的`234`和`567`相加时会抛出整数溢出异常，用`BigDicimal`也无解，况且实际情况中无法知道该数会有多大，放弃。

# 解
- 按题目意思输入`（2 -> 3 -> 4) + (5 -> 6-> 7)` 时，其实应该是 `432 + 765 = 1197` ，输出 `7 -> 9 -> 1 -> 1`;
- 这样的话其实只需要将每位相加，如果有进位，再加上进位后的1即可。
- 直接贴官方的解题思路
![](https://tva1.sinaimg.cn/large/006tNbRwly1g9jibmf51cj318e0ncafl.jpg)
```java
private static ListNode addTwoNumbers(ListNode l1, ListNode l2) {
    ListNode dummyHead = new ListNode(0);
    ListNode result = dummyHead;
    int carry = 0;
    while (l1 != null || l2 != null) {
        int l1Val = (l1 != null) ? l1.val : 0;
        int l2Val = (l2 != null) ? l2.val : 0;
        int sum = l1Val + l2Val + carry;
        carry = sum / 10;
        result.next = new ListNode(sum % 10);
        result = result.next;
        if (l1 != null) {
            l1 = l1.next != null ? l1.next : null;
        }
        if (l2 != null) {
            l2 = l2.next != null ? l2.next : null;
        }
    }
    if (carry > 0) {
        result.next = new ListNode(carry);
    }
    return dummyHead.next;
}
```
# 哑结点
- 这题的精髓就在与哑结点的设置，可以在最后直接将链表头返回；
  - `ListNode result = dummyHead;`将`dummyHead`和`result`指向同一个引用；
  - 随后的`result = result.next;`只是在该引用后添加新的节点；
  - 最终`return dummyHead.next;`返回的是有效的第一个节点；