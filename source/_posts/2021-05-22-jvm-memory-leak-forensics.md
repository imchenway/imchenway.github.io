---
title: JVM 内存泄漏事后取证流程
date: 2021-05-22
tags: ['#JVM', '#Profiling', '#Memory']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 背景
生产事故发生后，需要在不中断服务的前提下还原 JVM 内存泄漏路径，明确对象增长链路与触发条件。

# 取证流程
- 启用 `jcmd VM.native_memory` 与 JFR 事件，定位泄漏时段的类与线程；
- 使用堆转储 + MAT `Leak Suspects`，分析 Dominator Tree 与引用链；
- 结合 GC 日志中 `ObjectCountAfterFullGC`，验证是否存在长尾对象存活；
- 将线程转储与业务日志关联，重建请求上下文，确认触发入口。

# 处置策略
- 对确认泄漏的缓存/集合，增加定时修剪与容量报警；
- 通过 JMC 触发条件事件，捕获后续类似症状；
- 在回滚或热修后，持续监控 Metaspace、Old Gen 与 NMT 指标。

# 自检清单
- 是否保留事故期间的堆转储、GC 日志与线程快照？
- 是否确认泄漏对象来自业务代码而非第三方库？
- 是否在回归环境复现并验证修复有效？

# 参考资料
- Oracle 官方《Troubleshooting Memory Leaks》：https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/memleaks001.html
- JDK Mission Control 官方站点：https://jdk.java.net/jmc/
- Eclipse MAT 文档：https://help.eclipse.org/latest/topic/org.eclipse.mat.ui.help/welcome.html
