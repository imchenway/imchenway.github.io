---
title: Segment Tree Beats：处理复杂区间操作的高级技巧
date: 2019-08-19
tags: ['#Algorithm', '#DataStructure']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# Segment Tree Beats 是什么
Segment Tree Beats 是在传统线段树基础上增加维护信息与懒标记的先进技巧，适用于区间最小值赋值、最大值限制、加法等复杂操作。通过“暴力下推 + 强制维护”达到平均可行的复杂度。

# 典型问题
- 区间 `chmin`/`chmax`：将区间内元素限制在上（下）界；
- 区间加法 + 最大最小查询；
- 「最小值第二小 + 统计数量」的维护。

# 节点维护信息
- `max`, `smax`, `maxCount`；
- `min`, `smin`, `minCount`；
- `sum`；
- 懒标记 `add`、`assign`。

# 操作流程
1. 在 `pushDown` 中根据节点信息判断是否需要深入子节点；
2. `chmin` 操作示例：如果当前节点最大值 <= 限制值，直接跳过；若次大值 < 限制值 < 最大值，只需更新最大值与 sum；否则下推至子节点；
3. 通过这些条件控制递归深度，避免退化。

# 代码框架参考
实现较长，推荐阅读以下资源中的模板，并在维护信息时谨慎处理次大值/次小值逻辑。

# 自检清单
- 是否正确维护 `smax/smin` 与计数？
- 是否确保在「无需下推」的条件下就地更新节点？
- 是否在测试中覆盖边界情况（全部相等等）？

# 参考资料
- AtCoder Library 「Segment Tree Beats」教程：https://atcoder.jp/posts/518
- CF 讨论帖：https://codeforces.com/blog/entry/57319
- "Competitive Programming 4" Advanced Segment Tree 章节
