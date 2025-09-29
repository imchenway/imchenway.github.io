---
title: JIT Profiling 流水线：JFR + Async-profiler 双维度分析
date: 2020-09-19
tags: ['#JVM', '#JIT', '#Profiling']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 目标
构建一套自动化流水线定期收集 JFR 与 Async-profiler 数据，聚合生成热点报告，帮助开发团队识别高 CPU、高分配、反优化热点。

# 流程设计
1. 定时任务触发采样（5 分钟）：`jcmd JFR.start`, `profiler.sh -e cpu`; 
2. 采样结束后自动转换：`jfr print --json` + Flame Graph HTML；
3. 将结果上传至对象存储并记录版本号；
4. 生成日报（Grafana、Superset）展示热点排名；
5. 针对异常热点发送 Slack/钉钉提醒。

# 自检清单
- 是否对采样开销进行评估，避免生产抖动？
- 是否使用统一脚本，减少手工操作？
- 是否建立热点跟踪流程，推动代码优化？

# 参考资料
- Async-profiler：https://github.com/async-profiler/async-profiler
- JFR Runtime Guide：https://docs.oracle.com/javacomponents/jmc-8/jfr-runtime-guide/jfr-runtime-guide.pdf
- Netflix 性能分析流水线分享
