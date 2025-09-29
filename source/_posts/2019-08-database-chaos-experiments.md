---
title: 数据库层混沌实验：连接中断、延迟与主从切换
date: 2019-08-26
tags: ['#ChaosEngineering', '#Database', '#Resilience']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 为什么要针对数据库做混沌实验
数据库是分布式系统的核心依赖，网络抖动、主从切换、慢查询都可能引发应用雪崩。通过混沌实验提前暴露问题，完善超时、重试、熔断策略。

# 常见实验场景
- **网络延迟**：在数据库 Pod/节点注入 200~500ms 延迟；
- **连接中断**：模拟 TCP reset、端口关闭；
- **主从切换**：触发 RDS/CloudSQL failover，验证写入一致性；
- **慢查询**：使用 Proxy 模拟长事务或锁等待；
- **磁盘 IO 限制**：降低 IOPS 观察影响。

# 工具
- Chaos Mesh、LitmusChaos：支持 MySQL/PostgreSQL 故障；
- tc/netem：模拟延迟、丢包；
- ProxySQL / PgBouncer：模拟连接错误；
- 云厂商 FIS（AWS Fault Injection Simulator）。

# 应用侧改进
- 设置 `HikariCP` 超时与最大生命周期，防止连接泄漏；
- 明确重试策略与幂等设计；
- 与 Feature Flag 配合控制写请求降级；
- 指标：数据库错误率、延迟、连接数。

# 自检清单
- 是否在低风险环境演练并设置自动恢复？
- 是否记录实验指标、告警触发情况？
- 是否更新 runbook，确保故障时有标准处理流程？

# 参考资料
- Chaos Mesh 数据库实验：https://chaos-mesh.org/docs/simulate-database-chaos-on-kubernetes/
- Google SRE Workbook - Managing Critical Dependencies：https://sre.google/workbook/managing-critical-dependencies/
- HikariCP 文档：https://github.com/brettwooldridge/HikariCP
