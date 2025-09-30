---
title: GC 案例分析：一次生产环境停顿事件的排查记录
date: 2018-06-12
tags: ['#JVM', '#GC', '#CaseStudy']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 事件背景
- 服务：实时推荐系统
- 症状：延迟突增，响应时间 > 3s，GC 停顿频繁且超过 800ms
- 时间：2018-05-28 14:10~14:25
- 环境：JDK 11，G1 GC，8 核 CPU，32GB 堆

# 数据收集
1. GC 日志：`-Xlog:gc*:file=gc.log`，观察 `Pause Young (Mixed)` 停顿时间。
2. JFR 录制：`jcmd PID JFR.start duration=10m filename=incident.jfr settings=profile`。
3. 线程/堆 dump：`jcmd PID Thread.print`、`jmap -dump:live,format=b,file=heap.hprof`。
4. Prometheus 指标：`jvm_gc_pause_seconds_sum`, `jvm_memory_used_bytes`。

# 分析过程
- GC 日志显示并发周期后混合 GC 回收收益低，老年代存活率 ~92%。
- JFR 指示新建对象主要来自 JSON 解析与临时缓存，分配速率 2 GB/s。
- Heap dump 显示 `List<byte[]>` 缓存未及时清理，导致老年代占用增加。
- Thread dump 无死锁，但线程池队列堆积，说明请求处理变慢。

# 解决方案
1. 调整对象缓存策略，改用 Caffeine + 最大容量；
2. 优化 JSON 序列化：复用 `ObjectMapper`、使用 `ByteArrayOutputStream` 池；
3. 调整 G1 参数：`-XX:G1MixedGCLiveThresholdPercent=75`、`-XX:G1HeapWastePercent=10`；
4. 增加监控：GC 日志告警、新增 `jvm_gc_pause_seconds` 告警阈值。

# 结果与复盘
- 优化后 GC 停顿 < 200ms，平均响应时间恢复到 120ms；
- 建立 GC 健康检查与每周 GC 日志审查流程；
- 复盘文档记录，纳入工程回顾会议。

# 自检清单
- 是否收集并保存所有原始数据（GC 日志、JFR、dump）？
- 是否验证修复措施效果并持续监控？
- 是否输出复盘报告并跟进改进项？

# 参考资料
- JFR 官方指南：https://docs.oracle.com/javacomponents/jmc-8/jfr-runtime-guide/jfr-runtime-guide.pdf
- G1 GC 调优文档：https://docs.oracle.com/en/java/javase/17/gctuning/garbage-first-garbage-collector.html
- Caffeine 缓存文档：https://github.com/ben-manes/caffeine/wiki
