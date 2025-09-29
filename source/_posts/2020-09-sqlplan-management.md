---
title: SQL 计划管理与自适应优化实践
date: 2020-09-26
tags: ['#Database', '#SQL', '#Performance']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# SQL 计划漂移问题
数据库优化器随着统计信息变化可能选择不同执行计划，导致性能抖动。SQL Plan Management (SPM) 与自适应查询优化（AQP）可帮助稳定性能并自动学习更优计划。

# 方案
- **SPM**：Oracle、PolarDB 支持通过 Baseline 锁定计划；
- **Plan Hint 管理**：通过 MyBatis/Spring JDBC 注入 Hint 并内置灰度策略；
- **自动回归测试**：上线前执行关键 SQL 的计划对比；
- **指标监控**：记录 `latency`, `rows`, `logical_reads`。

# 自检清单
- 是否有 SQL 计划变更审计与回滚机制？
- 是否对热点 SQL 建立基线计划并定期验证？
- 是否监控统计信息刷新导致的计划切换？

# 参考资料
- Oracle SPM 文档：https://docs.oracle.com/en/database/oracle/oracle-database/19/tgsql/sql-plan-management.html
- MySQL Plan Stability 白皮书
- Flipkart SQL Plan Regression 案例
