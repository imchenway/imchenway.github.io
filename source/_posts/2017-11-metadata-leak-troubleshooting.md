---
title: JVM 元空间泄漏与 ClassLoader 分析
date: 2017-11-26
tags: ['#JVM', '#Metaspace']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 元空间与类加载
JDK 8 将永久代替换为元空间（Metaspace），存储类元数据、常量池、方法信息，位于本地内存。无限制的类加载或 ClassLoader 泄漏会导致 `OutOfMemoryError: Metaspace`。

# 泄漏场景
- 动态字节码生成（CGLIB、Javassist）未卸载；
- Web 容器重新部署，旧 ClassLoader 未被 GC；
- 线程池持有上下文 ClassLoader，阻止回收。

# 排查步骤
1. **开启日志**：`-XX:+TraceClassLoading`、`-XX:+TraceClassUnloading` 观察加载/卸载情况。
2. **监控元空间**：`jcmd <pid> VM.native_memory summary`，关注 `Metaspace` 与 `Class` 区段。
3. **Dump 元空间**：使用 `jcmd <pid> GC.class_histogram`、`jmap -clstats` 分析类加载器占用。
4. **JFR 分析**：事件 `Class Load`、`Metadata GC Threshold` 可帮助定位热点。

# 解决方法
- 限制元空间大小：`-XX:MaxMetaspaceSize`，配合告警监控；
- 正确释放 ClassLoader：关闭线程、清理静态缓存；
- 对动态代理使用缓存或重新利用 ClassLoader；
- 使用 `WeakReference` 持有可回收资源。

# 自检清单
- 是否对动态生成类的生命周期有明确控制？
- 是否在容器卸载应用时清除上下文 ClassLoader 引用？
- 是否监控元空间使用并设置预警？

# 参考资料
- HotSpot Metaspace 官方说明：https://docs.oracle.com/en/java/javase/17/gctuning/metaspace.html
- JEP 122: Remove the Permanent Generation：https://openjdk.org/jeps/122
- Java Mission Control JFR 分析指南：https://docs.oracle.com/en/java/javase/17/jfapi/index.html
