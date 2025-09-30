---
title: JDK 17 GC 演进与变化前瞻
date: 2021-08-05
tags: ['#JDK17', '#GC', '#JVM']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 背景
JDK 17 作为 LTS 版本，GC 组件进行了多项改进，需要提前评估升级影响。

# 关键变化
- ZGC 并发类卸载与压缩堆指针提升；
- Shenandoah 默认启用分代模式实验特性；
- G1 并发标记优化，降低 Remembered Set 成本。

# 评估方法
- 在预生产环境启用 JDK 17，录制 JFR 对比 GC 事件；
- 关注 `gc_pause_seconds`, `heap_usage`, `promotion_failed` 指标；
- 验证第三方库对 JDK 17 字节码与 API 的兼容性。

# 自检清单
- 是否确认所需 JVM 参数在 JDK 17 中仍然可用？
- 是否更新构建链路（Gradle/Maven 插件）兼容 JDK 17？
- 是否制定回滚策略与兼容性测试计划？

# 参考资料
- JDK 17 Release Notes：https://www.oracle.com/java/technologies/javase/17-relnotes.html
- OpenJDK JDK 17 Features：https://openjdk.org/projects/jdk/17/
- Shenandoah GC 文档：https://docs.oracle.com/en/java/javase/17/gctuning/shenandoah-garbage-collector.html
