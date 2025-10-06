---
title: GraalVM 与 JFR 集成监控指南
date: 2020-07-26
lang: zh-CN
tags: ['#GraalVM', '#JFR', '#Monitoring']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 背景
GraalVM 作为多语言运行时，同样支持 JDK Flight Recorder (JFR)。通过 JFR 可以低成本记录 CPU、内存、Polyglot 调用信息，对性能调优至关重要。

# 配置步骤
- 启动参数：`-XX:StartFlightRecording=duration=5m,filename=app.jfr,settings=profile`；
- 对 Native Image：使用 `--enable-monitoring=jfr` 构建，并在运行时 `-XX:StartFlightRecording=`；
- 配合 `jfr print` 或 JDK Mission Control 分析事件。

# 关注事件
- `ExecutionSample`、`ObjectAllocationInNewTLAB`：热点方法与分配；
- `FileRead`, `SocketRead`：IO 监控；
- `PolyglotEngine` 自定义事件：分析 JS/Python 调用耗时。

# 自检清单
- 是否在生产环境评估 JFR 文件滚动与磁盘占用？
- 是否对 Native Image 的 JFR 配置进行回归测试？
- 是否将关键事件转化为告警或 Dashboard？

# 参考资料
- GraalVM JFR 文档：https://www.graalvm.org/latest/reference-manual/native-image/Monitoring/#flight-recorder
- JDK Mission Control：https://docs.oracle.com/javacomponents/jmc-8/jmc-user-guide/
- Oracle JFR Runtime Guide：https://docs.oracle.com/javacomponents/jmc-8/jfr-runtime-guide/jfr-runtime-guide.pdf
