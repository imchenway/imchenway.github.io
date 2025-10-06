---
title: 混沌实验结合流量影子的闭环体系
date: 2021-02-26
lang: zh-CN
tags: ['#ChaosEngineering', '#TrafficShadow', '#Observability']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 目标
将流量影子与混沌实验结合，可以在真实流量下验证降级策略。需要搭建影子环境、故障注入、指标对比与回滚流程。

# 流程
1. 复制线上流量到影子环境（Istio mirror）；
2. 在影子环境注入故障（延迟、熔断、依赖宕机）；
3. 收集影子环境指标与主环境对比；
4. 根据结果更新降级策略并形成闭环。

# 自检清单
- 是否限制影子环境对真实外部依赖的写入？
- 是否建立影子环境指标看板与异常告警？
- 是否记录实验结果并更新 Runbook？

# 参考资料
- Istio mirror 功能：https://istio.io/latest/docs/tasks/traffic-management/mirroring/
- Chaos Mesh 实验编排：https://chaos-mesh.org/
- Google SRE Workbook
