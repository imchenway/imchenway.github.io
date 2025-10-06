---
title: 日志采样策略：降低成本并保持可见性
date: 2019-10-26
lang: zh-CN
tags: ['#Logging', '#Observability']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 为什么需要日志采样
高吞吐服务产生大量日志，导致存储成本和检索时间增加。通过采样可以降低日志量，同时保留关键信息用于故障诊断与审计。

# 采样方法
1. **固定比例采样**：按请求或类别，记录 1/N；
2. **动态采样**：根据错误率、流量动态调整比例；
3. **基于特征采样**：对失败、慢请求、重要租户保留全部日志；
4. **哈希采样**：对 Trace ID 或用户 ID 取哈希，保证同一会话一致采样；
5. **分层采样**：逐级采样（网关、服务、数据库）。

# 实现技巧（Logback + Sleuth）
- 使用 `TurboFilter` 判断是否记录；
- 搭配 MDC 添加 `sampled` 标记；
- 对 `ERROR` 级别永不采样；
- 与分布式追踪联动：Samper 决定 Trace 采样，同时控制日志输出。

# 监控与审计
- 统计采样前后日志量与成本；
- 确认告警仍能触发（重要日志不采样）；
- 定期抽查采样策略覆盖情况。

# 自检清单
- 是否对关键事件（错误、审计）禁用采样？
- 是否记录采样率，便于估算真实数量？
- 是否与 Trace 采样策略保持一致？

# 参考资料
- Google SRE Logging Best Practices：https://sre.google/sre-book/monitoring-distributed-systems/
- Elastic Observability 日志采样：https://www.elastic.co/guide/en/observability/current/log-sampling.html
- Spring Cloud Sleuth 采样策略：https://docs.spring.io/spring-cloud-sleuth/docs/current/reference/htmlsingle/#sampling
