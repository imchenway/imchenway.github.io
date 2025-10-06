---
title: 最短路径调试可视化技巧
date: 2021-12-19
lang: zh-CN
tags: ['#Algorithms', '#Visualization', '#Debugging']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 背景
图算法调试困难，需要可视化工具快速定位路径构建、松弛错误与边权异常。

# 可视化方案
- 使用 Graphviz 生成阶段性图形，标注距离与父节点；
- 在调试模式输出 JSON，配合 d3.js 重现路径；
- 借助动画展示 Relax 过程，捕捉错误更新顺序。

# 工程落地
- 构建隔离的调试模块，不影响生产代码；
- 提供断言与异常日志，记录错误边与权重；
- 在 CI 中生成小规模可视化报告，辅助代码评审。

# 自检清单
- 是否确保调试开关在生产环境关闭？
- 是否保护可视化日志中的敏感数据？
- 是否验证可视化输出与算法结果一致？

# 参考资料
- Graphviz 官方文档：https://graphviz.org/doc/
- d3.js 官方站点：https://d3js.org/
- CP-Algorithms 最短路专题：https://cp-algorithms.com/graph/dijkstra.html
