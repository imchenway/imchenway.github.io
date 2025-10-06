---
title: 混沌实验的数据闭环与指标看板
date: 2020-03-26
lang: zh-CN
tags: ['#ChaosEngineering', '#Observability']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 为什么需要数据闭环
混沌实验的核心是验证假设。没有完备的指标与回溯流程，就无法判断实验成功与否，也无法指导后续改进。因此需要建立从实验规划、指标采集、分析复盘到改进任务追踪的闭环体系。

# 指标体系
- **业务指标**：成功率、延迟、吞吐；
- **基础设施指标**：CPU、内存、GC、连接数；
- **错误预算**：燃烧率与剩余额度；
- **实验指标**：注入故障时长、影响范围、恢复时间。

# 看板构建
1. 在 Grafana 建立混沌实验 Dashboard，包含基线对比面板；
2. 使用 Prometheus 标签 `experiment="chaos-<id>"` 标识实验周期；
3. 在 Loki/ELK 中根据 Trace ID、实验 ID 聚合日志；
4. 在 Mimir/Thanos 中长期存储实验数据，用于趋势分析。

# 复盘流程
- 实验结束 24 小时内完成数据导出；
- 编写复盘文档：总结指标、命中/未命中假设、发现的问题；
- 将改进项登记到看板，并在下次演练前验证完成情况；
- 定期审计实验覆盖率，补齐关键场景。

# 自检清单
- 是否在实验前定义清晰的成功/失败阈值？
- 是否将实验 ID 注入到指标、日志、追踪中？
- 是否在复盘中跟踪改进项并闭环？

# 参考资料
- Principles of Chaos Engineering：https://principlesofchaos.org/
- Gremlin Chaos Engineering Guide：https://www.gremlin.com/community/tutorials/
- Google SRE Workbook - Managing Critical Dependencies：https://sre.google/workbook/managing-critical-dependencies/
