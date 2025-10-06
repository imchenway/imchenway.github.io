---
title: 数据湖与数据仓库融合架构
date: 2024-06-23
lang: zh-CN
tags: ['#Database']
---

### 本文目录
<!-- toc -->

# 引言
> 数据湖与数据仓库的融合（Lakehouse）成为趋势。本文梳理架构模式、关键技术与企业落地案例。

# 融合架构
- 统一存储（对象存储）+ 统一计算；
- 数据湖管理原始数据，数据仓库提供结构化分析；
- 元数据管理（Hive Metastore、Glue）；
- 表格式：Iceberg、Delta Lake、Hudi。

# 关键技术
- ACID Table Format；
- 流批一体处理（Spark、Flink）；
- 数据治理：血缘、质量、权限；
- 查询引擎：Presto/Trino、Athena。

# 应用场景
- 实时分析与历史分析统一；
- 多租户数据平台；
- 数据民主化、API 服务化。

# 实践建议
- 选择合适的表格式；
- 建立数据目录与治理流程；
- 关注成本与性能均衡；
- 自动化数据质量检测。

# 总结
Lakehouse 架构打通数据湖与仓库的边界。通过标准化表格式、治理模块与统一计算引擎，可以构建灵活的数据平台。

# 参考资料
- [1] Databricks Lakehouse Whitepaper.
- [2] Apache Iceberg Project Docs.
