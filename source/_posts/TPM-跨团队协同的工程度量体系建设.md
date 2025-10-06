---
title: 跨团队协同的工程度量体系建设
date: 2025-03-20
lang: zh-CN
tags: ['#TPM']
---

### 本文目录
<!-- toc -->

# 引言
> 多团队协作需要统一的工程度量（Engineering Metrics）来对齐目标。本文介绍 DORA 指标、业务指标与协同流程。

# 度量框架
- DORA 四指标：部署频率、变更交付时间、变更失败率、恢复时间；
- 工程效率指标：Lead Time、Review 时间、UT覆盖率；
- 业务指标：功能上线影响、客户满意度。

# 指标体系设计
- 指标池 -> 指标树 -> Dashboard；
- 设计目标：可执行、可对齐、可对比；
- 使用 OKR 连接指标与目标；
- 保持指标数量适中，避免 KPI 化。

# 数据采集
- Jira、Git、CI/CD、Monitoring 系统；
- 数据仓库或 DataMart；
- 自动化同步与数据清洗；
- 数据可视化（Grafana、Looker）。

# 协同机制
- 建立工程效率小组（EEF）；
- 例会讨论指标波动、优化动作；
- 与 SRE、产品、业务团队共用数据；
- 完成闭环：指标 -> 行动 -> 结果 -> 复盘。

# 总结
统一的工程度量体系让跨团队协作更透明。通过 DORA 指标与业务指标结合，打造可衡量的工程管理平台。

# 参考资料
- [1] Accelerate: The Science of DevOps.
- [2] GitLab Engineering Analytics.
