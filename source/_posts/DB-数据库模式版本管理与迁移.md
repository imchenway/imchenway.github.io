---
title: 数据库模式版本管理与迁移
date: 2024-04-04
tags: ['#Database']
---

### 本文目录
<!-- toc -->

# 引言
> 数据库模式（Schema）演进频繁，缺乏版本管理易导致线上冲突。本文总结迁移策略、工具链与回滚机制。

# 版本管理原则
- DDL 与应用版本同步；
- 向后兼容优先，避免破坏性变更；
- 使用迁移脚本记录版本；
- 审核流程与自动化检测。

# 工具链
- Flyway、Liquibase、Alembic；
- GitOps 管理 SQL；
- 在 CI 中执行迁移测试；
- 多环境自动同步。

# 迁移流程
1. 编写迁移脚本（Up/Down）；
2. 在测试环境执行并验证；
3. 生产环境灰度执行；
4. 监控指标与日志；
5. 如需回滚执行 Down 脚本或准备回滚脚本。

# 最佳实践
- 对大表采用 Online DDL（Gh-ost、pt-online-schema-change）；
- DDL 与代码解耦，先发布兼容版本；
- 使用 Feature Flag 控制新列；
- 记录 Schema 版本表 `schema_version`。

# 总结
系统化的模式版本管理可降低数据库变更风险。通过工具链、自动化与回滚策略，保证迁移安全可控。

# 参考资料
- [1] Flyway Documentation. https://documentation.red-gate.com/fd
- [2] GitHub gh-ost 项目.
