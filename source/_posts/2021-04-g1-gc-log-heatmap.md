---
title: 利用热力图展示 G1 GC 停顿曲线
date: 2021-04-12
tags: ['#JVM', '#GC', '#Visualization']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 热力图的价值
通过热力图展示不同时间段的 GC 停顿长度，可以快速识别热点时段、混合回收连续失败等问题。适用于展示多个实例、长期趋势。

# 实现方案
- 使用 Loki/Elastic 存储 GC 日志；
- Grafana LogQL 提取停顿时间与事件类型；
- 使用 Heatmap Panel 配置 bucket（停顿时长）和时间轴；
- 结合阈值设置告警提示。

# 自检清单
- 是否统一 GC 日志格式并提取停顿字段？
- 是否对热力图进行归一化，避免极端值干扰？
- 是否从热力图分析结果驱动参数调优？

# 参考资料
- Grafana Heatmap 教程：https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/heatmap/
- G1 GC Log 结构：https://docs.oracle.com/en/java/javase/17/gctuning/garbage-collector-logging.html
- Netflix 可视化案例
