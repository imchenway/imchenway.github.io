---
title: G1 GC 日志实时可视化方案
date: 2020-07-12
lang: zh-CN
tags: ['#JVM', '#GC', '#Observability']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 目标
通过 promtail + Loki + Grafana 实现 G1 GC 日志的实时分析，及时发现停顿异常、Humongous 对象和混合回收效率问题。

# 实施步骤
1. **统一日志格式**：`-Xlog:gc*,gc+heap=info,tags,uptime:file=/var/log/gc.log:time`；
2. **Promtail 收集**：配置 label `app="payment"`, `component="gc"`；
3. **Grafana Dashboard**：
   - 使用 LogQL 统计 `Pause Young` 总时长：`sum by (app) (rate({component="gc"} |= "Pause Young" | unwrap duration[5m]))`；
   - 生成 Humongous 报告图；
4. **告警**：Alertmanager 针对停顿超过阈值发送通知。

# 自检清单
- 是否统一 GC 日志格式并确保 promtail 正确解析时间戳？
- 是否建立停顿、吞吐、Humongous 指标告警？
- 是否在发布流程中验证新版本 GC 表现？

# 参考资料
- Loki LogQL：https://grafana.com/docs/loki/latest/logql/
- G1 GC 调优指南：https://docs.oracle.com/en/java/javase/17/gctuning/garbage-first-garbage-collector.html
- Promtail 配置示例：https://grafana.com/docs/loki/latest/clients/promtail/
