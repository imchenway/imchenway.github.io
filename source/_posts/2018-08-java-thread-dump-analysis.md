---
title: Java 线程转储（Thread Dump）分析指南
date: 2018-08-26
tags: ['#Java', '#Troubleshooting']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 获取线程转储
- `jstack <pid>`
- `jcmd <pid> Thread.print`（包含锁占用信息）
- `kill -3 <pid>`（Linux，将 dump 输出到标准输出）
- JFR 事件 `Thread Dump` 或 JDK Mission Control 在线查看。

# 关键字段
- **线程名称/ID**：`"http-nio-8080-exec-10" #32`。
- **优先级/daemon 状态**：`prio=5 os_prio=0 daemon`。
- **状态**：`java.lang.Thread.State: RUNNABLE/BLOCKED/WAITING/TIMED_WAITING/TERMINATED`。
- **栈帧**：调用路径，关注自定义代码。
- **锁信息**：`- waiting to lock <0x...> (a java.lang.Object)`。

# 常见问题定位
- **死锁**：`Found one Java-level deadlock:` 段落，列出互相等待的线程。
- **阻塞/锁竞争**：大量线程处于 `BLOCKED`，查看持有锁的线程栈。
- **线程池饱和**：线程命名规则显示是否超出预期。
- **GC/Finalizer**：`GC Thread`、`Finalizer`、`Reference Handler` 等线程状态分析。

# 工具辅助
- `TDA` (Thread Dump Analyzer)、`fastThread`、`IBM Thread and Monitor Dump Analyzer`。
- IntelliJ IDEA Monitoring 插件可可视化分析。

# 最佳实践
- 收集多份线程转储：连续采集 3~5 份，间隔数秒；
- 与 GC 日志、CPU 使用率、系统监控结合；
- 保留 dump 与事件时间线，供复盘使用。

# 自检清单
- 是否确认线程状态与锁等待关系？
- 是否标记关键业务线程并分析调用栈？
- 是否将线程转储纳入故障应急流程？

# 参考资料
- Oracle Thread Dump 文档：https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/thread_dump001.html
- JDK Command jcmd Thread.print：https://docs.oracle.com/javase/8/docs/technotes/tools/unix/jcmd.html
- fastThread 在线分析：https://fastthread.io/
