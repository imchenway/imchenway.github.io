---
title: 基于 JFR 的实时告警实践
date: 2020-10-05
lang: zh-CN
tags: ['#JFR', '#Observability', '#Automation']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 目标
利用 JFR Streaming API 将事件实时推送至告警系统，实现对 GC 停顿、死锁、异常率等指标的秒级告警。

# 实现步骤
- 使用 `RecordingStream` 订阅高优事件：
```java
try (RecordingStream stream = new RecordingStream()) {
    stream.onEvent("jdk.JavaMonitorEnter", event -> {/* ... */});
    stream.onEvent("jdk.GarbageCollection", event -> notifyIfPause(event));
    stream.startAsync();
    Thread.currentThread().join();
}
```
- 将事件写入 Kafka/Redis Stream；
- 在告警服务中设置规则（GC 停顿 > 500ms，死锁事件 > 0）。

# 自检清单
- 是否限制订阅的事件范围避免性能开销？
- 是否配置断线重连与缓冲机制？
- 是否在告警系统中关联 Trace/日志便于定位？

# 参考资料
- JEP 349: JFR Streaming：https://openjdk.org/jeps/349
- JDK Flight Recorder 使用手册：https://docs.oracle.com/javacomponents/jmc-8/jfr-runtime-guide/jfr-runtime-guide.pdf
- 阿里巴巴 JFR 告警实践分享
