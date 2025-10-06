---
title: JVM Metaspace管理与调优
date: 2021-10-27
lang: zh-CN
tags: ['#JVM']
---

### 本文目录
<!-- toc -->

# 引言
> Metaspace 自 JDK 8 取代 PermGen 成为类元数据的存储区域。其默认无限制的设计降低了 OOM 风险，但在容器环境下需要精细管理，以避免无界增长。

# Metaspace 的结构
- **Committed/Reserved**：已提交与已保留内存；
- **VirtualSpaceList**：维护多个虚拟空间块；
- **Chunk**：类元数据分配单位（1KB~64KB）；
- **ClassLoaderData**：每个类加载器持有独立的 Metaspace；
- **Metaspace GC**：类卸载会释放对应 Chunk。

# 关键参数
- `-XX:MetaspaceSize`：初始大小，触发 GC 的阈值；
- `-XX:MaxMetaspaceSize`：最大值；
- `-XX:MinMetaspaceFreeRatio`、`MaxMetaspaceFreeRatio`：控制增长/收缩节奏；
- `-XX:+UseCompressedClassPointers`：启用压缩类指针。

# 调优流程
1. **监控**：`jcmd GC.class_stats`、`jcmd VM.native_memory summary`、JFR `Metaspace` 事件；
2. **分析**：检查类加载数量、ClassLoader，确认是否存在泄漏；
3. **限制**：在容器中设置 `MaxMetaspaceSize` 并配合 `MaxRAMPercentage`；
4. **卸载**：确保类加载器可被回收，避免强引用；
5. **多租户**：拆分 ClassLoader，同时监控每个租户的 Metaspace 占用。

# 实战案例
- 某 SaaS 平台动态加载租户脚本，Metaspace 持续增长。通过定期卸载老租户的 `URLClassLoader` 并清理缓存，将 Metaspace 稳定在 512MB；
- 在 OSGi 系统中使用 `jcmd VM.class_hierarchy` 排查未卸载类加载器；
- 配合 `-XX:+ClassUnloadingWithConcurrentMark` 在 G1 下启用类卸载。

# 总结
Metaspace 虽然摆脱了 PermGen 固定大小的限制，但在动态类加载场景中仍可能失控。通过监控、限制和正确的类加载器设计，可以保持 Metaspace 的健康运行。

# 参考资料
- [1] Oracle, "Java HotSpot VM Memory Management". https://docs.oracle.com/javase/
- [2] JEP 122: Remove the Permanent Generation. https://openjdk.org/jeps/122
- [3] JVM Native Memory Tracking (NMT). https://docs.oracle.com/javase/8/docs/technotes/guides/vm/nmt-8.html
