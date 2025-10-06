---
title: 蓝绿发布与金丝雀发布对比：何时选择哪一种？
date: 2019-09-26
lang: zh-CN
tags: ['#DevOps', '#Release', '#SRE']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 蓝绿发布
- 同时维护两套环境（Blue/Green），切换流量；
- 切换简单且回滚快速；
- 成本较高，需要双倍资源；
- 适合小规模服务或重构版本发布。

# 金丝雀发布
- 逐步放量（1%→5%→20%），监控指标；
- 更细粒度控制风险；
- 需要完善监控、流量管理能力；
- 适合频繁发布、数据敏感服务。

# 对比表
| 维度 | 蓝绿 | 金丝雀 |
|---|---|---|
| 资源消耗 | 高 | 中等 | 
| 回滚速度 | 快 | 中等（需切回旧版本） |
| 风险控制 | 粗粒度 | 精细放量 |
| 监控要求 | 一般 | 较高 |
| 需要支持 | 负载均衡切换 | 流量路由、指标监控 |

# 混合策略
- 基线蓝绿 + 金丝雀：先部署新环境，然后在新环境内放量；
- 蓝绿用于架构变更/数据库升级，日常发布使用金丝雀；
- 配合 Feature Flag，实现功能级别开关。

# 实践建议
- 监控：Prometheus、Datadog、AWS CloudWatch；
- 网关：Istio、NGINX、AWS ALB；
- 回滚：自动化脚本 + Runbook；
- 观测窗口：设定观测期（10~30 分钟）并记录指标。

# 自检清单
- 是否根据服务规模、SLO 选择发布策略？
- 是否设置充分的观察指标与告警？
- 是否在演练中验证回滚流程？

# 参考资料
- Google SRE Workbook：https://sre.google/workbook/canarying-releases/
- AWS 蓝绿部署指南：https://docs.aws.amazon.com/whitepapers/latest/blue-green-deployments/bluegreen-deployments.html
- LaunchDarkly Feature Flag 最佳实践：https://launchdarkly.com/blog/feature-flag-best-practices/
