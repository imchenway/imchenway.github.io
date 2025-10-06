---
title: JFR Analytics：利用 Streams & SQL 分析事件数据
date: 2019-04-05
lang: zh-CN
tags: ['#JVM', '#JFR', '#Analytics']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# JFR Analytics 概述
JDK 14 引入 `jdk.jfr.consumer` 包，允许通过 Java API 读取 JFR 事件。JDK 15+ 提供 `jfr print --events ...` 与 Flight Recorder Streaming API，将事件流转为实时分析数据。

# Java API 示例
```java
Path recording = Paths.get("profile.jfr");
try (RecordingFile file = new RecordingFile(recording)) {
    while (file.hasMoreEvents()) {
        RecordedEvent event = file.readEvent();
        if (event.getEventType().getName().equals("jdk.ExecutionSample")) {
            long cpuTime = event.getLong("sampledThread.javaThreadId");
            // 分析逻辑
        }
    }
}
```

# Streaming API
```java
try (var subscription = FlightRecorder.registerEvent(ExecutionSampleEvent.class);
     var stream = new RecordingStream()) {
    stream.onEvent("jdk.ExecutionSample", event -> {
        System.out.println(event.getStackTrace());
    });
    stream.startAsync();
    Thread.sleep(Duration.ofMinutes(5));
}
```

# SQL 方式
- 将 JFR 转换为 JSON/CSV，并导入 ClickHouse/BigQuery；
- 使用 `jfr print --events jdk.GarbageCollection` 输出字段，借助 jq/awk 转换；
- 结合 Grafana Loki/Tempo 形成统一可观测性视图。

# 场景案例
- 热点方法识别（ExecutionSample、ObjectAllocationInNewTLAB）；
- GC 分析（GarbageCollection、AllocationRequiringGC）；
- Safepoint & Lock 分析（JavaMonitorEnter、SafepointBegin）。

# 自检清单
- 是否使用最新 JDK，启用 JFR Streaming API？
- 是否设计事件过滤与聚合逻辑，避免数据洪流？
- 是否与指标/日志联动，形成闭环分析？

# 参考资料
- JFR Streaming API：https://openjdk.org/jeps/349
- JDK Flight Recorder Consumer API：https://docs.oracle.com/en/java/javase/17/docs/api/jdk.jfr/jdk/jfr/consumer/package-summary.html
- JDK Mission Control 博客：https://blogs.oracle.com/javamagazine/post/jdk-flight-recorder-streaming
