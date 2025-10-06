---
title: Java Flight Recorder 事件订阅拓展
date: 2021-07-12
lang: zh-CN
tags: ['#JFR', '#Observability', '#Java']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 背景
JFR Event Streaming 允许在运行时订阅事件流，需要结合业务指标实现诊断自动化。

# 实施步骤
- 使用 `jdk.jfr.consumer.RecordingStream` 订阅自定义配置文件；
- 将 JFR 数据写入 OpenTelemetry，关联 Trace 与 Metrics；
- 设定阈值触发器，对 GC 停顿、线程阻塞事件自动报警。

# 工程实践
- 通过 `event.setThreshold` 控制采样频率与开销；
- 引入 RingBuffer 缓冲器，避免下游消费阻塞；
- 在 CI 中增加兼容性测试，确保 JDK 更新后事件字段未变。

# 自检清单
- 是否评估事件订阅对应用带来的额外开销？
- 是否保证敏感数据（如 SQL 参数）脱敏存储？
- 是否在演练环境验证报警策略？

# 参考资料
- JFR Event Streaming 官方指南：https://docs.oracle.com/en/java/javase/16/docs/api/jdk.jfr/jdk/jfr/consumer/RecordingStream.html
- OpenJDK JMC 文档：https://docs.oracle.com/javacomponents/jmc-8-1/jfr-runtime-guide/toc.htm
- OpenTelemetry Java Agent：https://github.com/open-telemetry/opentelemetry-java-instrumentation
