---
title: 树上莫队算法应用笔记
date: 2020-06-19
lang: zh-CN
tags: ['#Algorithm', '#Tree', '#Mo']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 树上莫队的思路
树上莫队将树问题转化为欧拉序列，然后在数组上应用莫队算法。通过添加/删除节点时更新统计信息，可在 O((n + q) √n) 时间内处理诸如节点颜色统计、路径权值等查询。

# 实施步骤
1. **欧拉序列与 LCA**：对树进行 DFS 记录进入与离开时间，利用 `firstOccurrence` + RMQ 计算 LCA；
2. **查询转换**：每个查询 `(u, v)` 转为欧拉区间 `[tin[u], tin[v]]`，若 LCA 不在区间内额外处理；
3. **莫队排序**：按照块号排序查询，处理时维护当前路径节点；
4. **维护函数**：`add(node)`、`remove(node)` 更新统计；
5. **答案输出**：考虑 LCA 节点贡献。

# 自检清单
- 是否正确处理 LCA 节点追加/删除逻辑？
- 是否使用离散化或计数数组提升常数？
- 是否对块大小设置为 `sqrt(2n)` 以平衡复杂度？

# 参考资料
- CP-Algorithms Tree Mo：https://cp-algorithms.com/data_structures/sqrt_decomposition.html#tree-mo-s-algorithm
- Codeforces Educational  Round  创建的题解
- Competitive Programming 4 高级章节
