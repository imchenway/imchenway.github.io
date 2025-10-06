---
title: 基于 JFR 的 G1 GC 告警体系
date: 2021-03-19
lang: zh-CN
tags: ['#JVM', '#G1', '#JFR']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 告警需求
G1 停顿与混合回收异常需要实时发现。通过 JFR Streaming 捕获 `GarbageCollection`, `AllocationRequiringGC`, `G1HeapSummary` 事件可构建秒级告警。

# 实施方案
- 使用 `RecordingStream` 订阅事件并推送至 Kafka；
- 通过告警服务检测：
  - 单次停顿 > 400ms；
  - 连续 3 次混合回收收益 < 5%；
  - Humongous Region 占比 > 15%；
- 告警消息包含 Trace ID、堆信息与 GC 日志链接。

# 自检清单
- 是否限制事件频率避免数据量过大？
- 是否提供回看能力（保存 JFR 文件）？
- 是否与错误预算联动暂停发布？

# 参考资料
- JFR Streaming 文档：https://openjdk.org/jeps/349
- G1 GC 调优指南：https://docs.oracle.com/en/java/javase/17/gctuning/
- Netflix JFR 告警实践案例
