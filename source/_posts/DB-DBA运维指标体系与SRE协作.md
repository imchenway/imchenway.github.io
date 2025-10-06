---
title: DBA运维指标体系与SRE协作
date: 2024-07-13
lang: zh-CN
tags: ['#Database']
---

### 本文目录
<!-- toc -->

# 引言
> 数据库运维需要与 SRE 协同构建指标体系，保障稳定性。本文介绍关键指标、协作流程与工具。

# 指标体系
- 可用性：故障率、恢复时间（MTTR）；
- 性能：QPS/TPS、慢查询、锁等待；
- 资源：CPU、IO、Buffer Pool；
- 变更：DDL 次数、成功率；
- 安全：审计日志、权限变更。

# 协作流程
- DBA 提供指标定义，SRE 负责监控平台；
- 成立数据库战情室，处理重大事件；
- 定期复盘，优化告警；
- 建立 Runbook 与自动化脚本。

# 工具
- Prometheus + Grafana Dashboard；
- 慢 SQL 分析（pt-query-digest、AWR）；
- 自动化平台（Ansible、DBA 工具）；
- 事件管理平台（PagerDuty、Opsgenie）。

# 总结
完善的指标体系与 SRE 协作机制可以提升数据库运维效率，降低故障风险。

# 参考资料
- [1] Google SRE Book, Monitoring Chapter.
- [2] Percona Monitoring and Management (PMM).
