---
title: 后缀自动机与后缀数组联合解题套路
date: 2020-03-19
tags: ['#Algorithm', '#String']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 为什么要联合使用 SAM 与 SA
后缀自动机（SAM）适合处理在线子串匹配、不同子串计数，而后缀数组（SA+LCP）在处理区间查询、字典序问题更强。通过两者互补，可以在竞赛与工程中覆盖更广泛的字符串需求。

# 典型组合场景
1. **最长公共子串**：使用 SAM 处理一串，再以 SA+LCP 验证多串交集，减少重复计算；
2. **第 k 小子串**：在 SAM 上根据 `endPos` 统计数量，再利用 SA 提供有序遍历；
3. **子串出现次数范围查询**：SAM 提供出现次数，SA 利用 LCP/二分快速定位子串；
4. **多模式匹配**：SAM 构建 pattern 自动机，SA 用于目标文本快速定位候选区间。

# 实践建议
- 先根据问题特征选择主结构；
- 共享预处理：如 Z-Algorithm/前缀函数用于验证结果；
- 统计出现次数时，SAM 需拓扑序遍历；
- SA 查询时，利用 RMQ 处理 LCP 区间。

# 自检清单
- 是否在 SAM 终态上拓扑累加 `occurrence`？
- 是否对 SA 结果使用 LCP 验证边界？
- 是否在多字符串场景下统一编码（如分隔符 #）避免跨串串联？

# 参考资料
- CP-Algorithms Suffix Automaton：https://cp-algorithms.com/string/suffix-automaton.html
- CP-Algorithms Suffix Array：https://cp-algorithms.com/string/suffix-array.html
- 《Competitive Programming 4》字符串综合章节
