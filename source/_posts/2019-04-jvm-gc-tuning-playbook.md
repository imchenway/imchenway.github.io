---
title: JVM GC 调优手册：方法论与检查清单
date: 2019-04-12
lang: zh-CN
tags: ['#JVM', '#GC', '#Tuning']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 调优方法论
1. **设定目标**：延迟、吞吐或内存；
2. **收集数据**：GC 日志、JFR、指标；
3. **分析问题**：分配速率、晋升失败、停顿；
4. **制定方案**：调整堆、回收器、参数；
5. **验证与回滚**：压测、灰度、上线；
6. **记录与复盘**：形成知识库。

# 关键指标
- GC 停顿时间、频率、吞吐比；
- 堆使用率（Eden/Survivor/Old）与 Humongous 占比；
- 分配速率、TLAB 使用；
- Safepoint 次数与原因。

# 调优策略
- **堆布局**：设置 `-Xms=-Xmx`、调整新生代比率；
- **回收器选择**：G1、ZGC、Shenandoah 根据延迟需求；
- **对象分配**：减少短命对象、启用逃逸分析；
- **字符串与缓存**：启用 String Deduplication、合理缓存大小；
- **监控与告警**：Prometheus 指标 + GC 日志采集。

# 调整示例
- `-XX:MaxGCPauseMillis=200`、`-XX:InitiatingHeapOccupancyPercent=40`；
- `-XX:+UseStringDeduplication`、`-XX:G1MixedGCLiveThresholdPercent=75`；
- `-Xlog:gc*,gc+heap=debug:file=gc.log`。

# 自检清单
- 是否基于数据而非猜测调整参数？
- 是否评估新参数对 CPU/内存的影响？
- 是否记录调优前后对比数据并复盘？

# 参考资料
- Java HotSpot VM GC 调优指南：https://docs.oracle.com/en/java/javase/17/gctuning/index.html
- GC 日志分析工具 GCViewer：https://github.com/chewiebug/GCViewer
- Google SRE 性能优化经验
