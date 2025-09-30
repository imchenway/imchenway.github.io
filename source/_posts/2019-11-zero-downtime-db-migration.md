---
title: Java 服务零停机数据库迁移策略
date: 2019-11-26
tags: ['#DevOps', '#Database', '#Migration']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 挑战
数据库 schema 变更是微服务演进中的高风险操作。零停机迁移需要兼容旧新版本代码、保证数据一致性，并提供回滚路径。

# Expand-Contract 模式
1. **Expand 阶段**：添加新字段/表结构，旧代码兼容；
2. **数据回填**：后台任务同步旧字段至新字段；
3. **发布新代码**：读取新字段，同时维持旧字段写入；
4. **Contract 阶段**：确认无回滚需求后删除旧字段。

# 工具与流程
- 使用 Flyway/Liquibase 管理迁移脚本；
- 数据回填可通过 Spring Batch、Debezium、Spark；
- 变更审计：Pull Request + DBA 审核；
- Feature Flag 控制新字段写入逻辑。

# 监控与验证
- 指标：迁移阶段的写入成功率、延迟、复制进度；
- 日志：记录数据回填进度与异常；
- 回滚：保留旧字段与代码路径，必要时快速切换回旧逻辑。

# 自检清单
- 是否制定 Expand → Data Migration → Contract 三阶段计划？
- 是否提供迁移脚本的幂等性与回滚脚本？
- 是否监控迁移期间的数据库压力与延迟？

# 参考资料
- Liquibase/Flyway 文档：https://www.liquibase.org/、https://flywaydb.org/documentation
- Facebook Zero Downtime Schema：https://engineering.fb.com/2013/09/23/data-infrastructure/making-facebook-data-warehouse-faster/
- Google SRE 数据库迁移经验
