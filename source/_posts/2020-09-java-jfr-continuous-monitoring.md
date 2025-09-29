---
title: JFR 持续监控流水线搭建指南
date: 2020-09-05
tags: ['#JVM', '#JFR', '#Monitoring']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 持续监控的必要性
将 JFR 纳入持续监控可以在不影响性能的前提下追踪长期趋势（GC、CPU、锁、IO）。通过自动化采集与分析，可以提前发现性能回退。

# 架构方案
- **采集**：使用 `jcmd JFR.start` 定期录制短文件（5~10 分钟）；
- **上传**：Sidecar 挂载采集目录，使用 Fluent Bit 上传至对象存储；
- **分析**：后台任务将 JFR 转换为 JSON（`jfr print --json`）并写入 ClickHouse/Parquet；
- **可视化**：Grafana/Metabase 展示趋势，结合告警。

# 自检清单
- 是否控制 JFR 文件大小并清理过期文件？
- 是否在采集脚本失败时提供告警？
- 是否对敏感事件做好脱敏处理？

# 参考资料
- JFR 命令行参考：https://docs.oracle.com/javacomponents/jmc-8/jfr-runtime-guide/jfr-runtime-guide.pdf
- JDK Mission Control 自动化脚本实例
- Netflix JFR 持续监控实践
