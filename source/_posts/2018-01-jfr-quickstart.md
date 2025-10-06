---
title: Java Flight Recorder 快速入门与常用分析
date: 2018-01-26
lang: zh-CN
tags: ['#JVM', '#Observability']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# JFR 概览
Java Flight Recorder（JFR）是 HotSpot 内置的低开销事件采集框架，可记录线程、GC、内存、锁、I/O 等运行时信息。JDK 11 起对所有用户开放（JEP 328）。

# 启动方式
- **命令行**：`java -XX:StartFlightRecording=duration=60s,filename=app.jfr`。
- **动态开启**：`jcmd <pid> JFR.start name=profile settings=profile duration=120s`。
- **配置文件**：`profile`、`default` 两套预设，可自定义 `.jfc` 文件。

# 关键事件
- `Java Application`：CPU 栈样本、执行热点；
- `Garbage Collection`：GC 停顿、阶段、堆使用；
- `Thread Dump`：线程状态、锁持有；
- `Exceptions`：异常统计；
- `Allocation in New TLAB/Outside TLAB`：对象分配热点。

# 分析流程
1. 使用 JDK Mission Control 打开 `.jfr` 文件；
2. 查看 Overview 了解 CPU、内存、GC 的总体情况；
3. 在 Threads、Locks 视图定位阻塞；
4. 在 Memory/Allocation 分析热点对象；
5. 导出报告或与基线对比。

# CLI 处理
- `jfr print --events FlightRecorder jfr-file.jfr` 查看元数据；
- `jfr summary` 输出主要指标；
- `jfr view` 支持筛选事件范围。

# 最佳实践
- 在线上以短时采样方式使用，避免长时间记录产生大文件；
- 与监控系统结合，建立故障复盘流程；
- 自定义事件可扩展业务指标（JEP 328）。

# 自检清单
- 是否掌握 `jcmd` 启停 JFR 命令？
- 是否能快速定位 GC、锁、I/O 等瓶颈？
- 是否将 JFR 集成到故障复盘与性能分析流程？

# 参考资料
- JEP 328: Flight Recorder：https://openjdk.org/jeps/328
- Java Flight Recorder Runtime Guide：https://docs.oracle.com/javacomponents/jmc-8/jfr-runtime-guide/jfr-runtime-guide.pdf
- JDK Mission Control 用户指南：https://docs.oracle.com/javacomponents/jmc-8/jmc-user-guide/toc.htm
