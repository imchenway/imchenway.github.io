---
title: 异步日志对 GC 与延迟的影响评估
date: 2019-10-12
tags: ['#Java', '#Logging', '#Performance']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 背景
异步日志（Logback AsyncAppender、Log4j2 Async Logger）通过队列将日志写入与业务线程解耦，降低延迟。然而，缓冲区大小、事件堆积可能影响 GC 与内存占用，需要仔细评估。

# 配置要点
- **Logback**：
```xml
<appender name="ASYNC" class="ch.qos.logback.classic.AsyncAppender">
  <discardingThreshold>0</discardingThreshold>
  <queueSize>16384</queueSize>
  <includeCallerData>false</includeCallerData>
  <appender-ref ref="FILE"/>
</appender>
```
- **Log4j2**：使用 `RandomAccessFile` + `AsyncLoggerContextSelector`；
- 队列建议使用 LMAX Disruptor（Log4j2）。

# 性能与 GC 考量
- 较大的队列降低阻塞，但增加堆占用；
- 记录日志对象量大可能触发频繁分配，需配合 GC 日志观察；
- JFR 事件 `Thread Park`, `Java Monitor Blocked` 可确认是否仍出现阻塞。

# 监控指标
- 队列利用率（Logback `appender.queue.size`）；
- 日志耗时 & 后端写入延迟；
- GC 停顿，尤其是年轻代；
- 应用响应时间变化。

# 自检清单
- 是否对高频日志做采样或限速？
- 是否评估磁盘 IO，避免写入瓶颈导致队列堆积？
- 是否结合 GC/JFR 数据验证异步日志收益？

# 参考资料
- Logback 异步日志文档：http://logback.qos.ch/manual/appenders.html#AsyncAppender
- Log4j2 Async Logger：https://logging.apache.org/log4j/2.x/manual/async.html
- Quarkus Logging 性能测试：https://quarkus.io/guides/logging
