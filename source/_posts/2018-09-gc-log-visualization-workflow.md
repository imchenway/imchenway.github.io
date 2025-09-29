---
title: GC 日志可视化工作流：从收集到洞察
date: 2018-09-12
tags: ['#JVM', '#GC', '#Observability']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 收集策略
- JDK 8：`-XX:+PrintGCDetails -XX:+PrintGCDateStamps -Xloggc:/var/log/gc.log`
- JDK 9+：`-Xlog:gc*,safepoint:file=gc.log:time,uptime,level,tags`
- 保留滚动日志，使用 logrotate 或 jcmd `GC.rotate_log`。

# 工具链
| 工具 | 用途 | 特点 |
|---|---|---|
| **GCViewer** | 可视化停顿、吞吐 | 开源、支持多种 GC 格式 |
| **GCEasy** | 在线解析 | 自动生成图表与建议 |
| **Grafana + Loki** | 中央存储 | 结合 Promtail 收集 GC 日志 |
| **Elastic Stack** | 日志集中 | Kibana Dashboard 自定义 |

# 工作流程
1. **预处理**：收集 GC 日志并确认完整性；
2. **解析**：使用 GCViewer/GCEasy 生成停顿分布图、堆使用曲线；
3. **指标对照**：与 Prometheus `jvm_gc_pause_seconds`、`memory_used` 指标对比；
4. **问题定位**：识别年轻代、混合 GC、Full GC 异常；
5. **调优验证**：调整参数后再次收集对比。

# 自动化建议
- 使用脚本（Python/Logstash）提取关键字段（停顿时间、堆大小）；
- Grafana Loki Dashboard：实时查看 GC 事件频率与停顿；
- 告警门槛：`pause > 500ms`、`Full GC > 0`、`堆使用率 > 90%`。

# 自检清单
- 是否定期收集 GC 日志并做统一存储？
- 是否使用可视化工具对比不同版本或环境？
- 是否将停顿指标纳入监控与告警体系？

# 参考资料
- GCViewer 项目：https://github.com/chewiebug/GCViewer
- GCEasy 文档：https://gceasy.io
- Unified GC Logging 手册：https://docs.oracle.com/en/java/javase/17/gctuning/garbage-collector-logging.html
