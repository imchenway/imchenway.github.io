---
title: ZooKeeper 可观测性体系建设
date: 2020-08-12
tags: ['#ZooKeeper', '#Observability', '#DevOps']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 为什么需要 ZooKeeper 可观测性
ZooKeeper 是分布式协调的关键组件，其延迟、会话数量、事务日志性能直接影响上游服务。建立一套可靠的监控、日志与追踪体系能够提前发现脑裂、延迟飙升等风险。

# 指标采集
- 使用 `mntr` 四字命令配合 Prometheus Exporter（如 prometheus-jmx-exporter）；
- 关键指标：`zk_avg_latency`, `zk_watch_count`, `zk_outstanding_requests`, `zk_pending_syncs`；
- 磁盘与 JVM 指标：`jvm_gc_pause`, `io_util`, `disk_fill_rate`。

# 日志与告警
- 审计 `WATCHER`, `SESSION`, `LEADER` 日志；
- Alertmanager 告警规则：延迟超过 10ms、Follower 落后、Session 半数以上断开；
- ELK/Loki 关联日志与业务 Trace ID。

# 自检清单
- 是否在集群升级/配置变更前后观察延迟曲线？
- 是否监控 Leader/Follower 状态变化并记录时间线？
- 是否定期压测磁盘与网络带宽，验证日志同步阈值？

# 参考资料
- Apache ZooKeeper 文档：https://zookeeper.apache.org/doc/current/
- ZooKeeper 可观测性最佳实践：https://medium.com/netflix-techblog/monitoring-zookeeper-at-netflix-1b01d280b08
- Prometheus JMX Exporter：https://github.com/prometheus/jmx_exporter
