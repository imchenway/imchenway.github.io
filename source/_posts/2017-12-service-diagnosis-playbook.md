---
title: Java 服务故障诊断手册：GC、线程与慢查询
date: 2017-12-26
tags: ['#Java', '#Observability']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 故障分类
1. **内存异常**：堆 OOM、元空间泄漏、GC 停顿过长。
2. **线程问题**：死锁、线程池饱和、阻塞队列堆积。
3. **慢查询/IO**：数据库慢查询、外部服务延迟。
4. **配置错误**：限流、超时参数失效。

# 快速定位流程
1. **报警信息**：通过 APM、日志、监控告警确定故障类型与时间。
2. **采集线程/堆转储**：`jstack`, `jmap`, `jcmd`。
3. **分析工具**：MAT、Async-profiler、JFR、Arthas。
4. **验证修复**：调整参数、发布补丁或降级策略。

# 常用命令
```bash
jcmd <pid> GC.heap_info
jcmd <pid> GC.class_histogram
jstack <pid> > thread_dump.log
jcmd <pid> JFR.dump filename=recording.jfr
```

# GC 故障
- 通过 GC 日志分析停顿、晋升失败；
- 检查大对象分配与字符串重复；
- 调整堆大小、停顿目标或回收器类型。

# 线程故障
- 线程数飙升：检查线程池配置与拒绝策略；
- 死锁：`jstack` 查找 `Found one Java-level deadlock`；
- 队列堆积：监控 `ThreadPoolExecutor` 指标。

# 慢查询
- 打开 SQL 慢日志或 APM；
- 检查连接池、超时配置；
- 缓存与索引优化。

# 自检清单
- 是否建立故障分类与对应排查脚本？
- 是否保存并分析 JFR/堆/线程转储？
- 是否形成演练流程与文档化经验？

# 参考资料
- Oracle Troubleshooting Guide：https://docs.oracle.com/en/java/javase/17/troubleshoot/troubleshooting-guide.pdf
- Java Flight Recorder 官方文档：https://docs.oracle.com/javacomponents/jmc-8/jfr-runtime-guide/jfr-runtime-guide.pdf
- Async-profiler 项目主页：https://github.com/async-profiler/async-profiler
