---
title: 金丝雀发布与 Feature Flag 协同流程
date: 2018-12-26
lang: zh-CN
tags: ['#DevOps', '#Release', '#FeatureFlag']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 目标
通过金丝雀发布逐步放量新版本，同时利用 Feature Flag 控制开关，实现快速回滚与 A/B 实验，提升发布安全性与可观测性。

# 流程设计
1. **准备阶段**：
   - 定义实验指标（成功率、延迟、错误预算消耗）；
   - 确定放量计划（1%、5%、20%、50%、100%）。
2. **发布执行**：
   - 部署金丝雀实例，使用服务发现/网关分流；
   - 打开 Feature Flag 仅对金丝雀生效；
   - 监控关键指标与日志。
3. **放量与回滚策略**：
   - 指标健康 → 提升流量并扩大 Feature Flag 覆盖；
   - 指标异常 → 关闭 Flag、回滚版本、触发复盘。
4. **全量发布**：完成放量后，将 Feature Flag 设置为默认开启，可逐步删除旧代码。

# 技术实现
- **路由**：Istio/Envoy、Spring Cloud Gateway、Nginx；
- **Feature Flag 平台**：LaunchDarkly、Unleash、FF4J；
- **配置**：使用 GitOps 管理发布配置，支持回滚；
- **监控**：Prometheus + Grafana、Datadog，关联金丝雀标签。

# 数据与告警
- 关键 SLI：错误率、P95 延迟、资源使用；
- 日志：kibana/ELK 按版本或 flag 维度过滤；
- 告警策略：指标越过阈值立即回滚，错误预算消耗预警。

# 自检清单
- 是否定义清晰的放量策略与成功标准？
- 是否建立 Feature Flag 生命周期管理（上线、灰度、清理）？
- 是否确保日志、指标、追踪包含版本/flag 标签？

# 参考资料
- Google SRE Workbook - Canarying Releases：https://sre.google/workbook/canarying-releases/
- LaunchDarkly Feature Flag 指南：https://launchdarkly.com/blog/feature-flag-best-practices/
- Istio 金丝雀发布示例：https://istio.io/latest/docs/tasks/traffic-management/traffic-shifting/
