---
title: JVM Off-heap内存使用策略
date: 2021-11-26
lang: zh-CN
tags: ['#JVM']
---

### 本文目录
<!-- toc -->

# 引言
> 在低延迟、高吞吐系统中，使用堆外内存（Off-heap）可以减少 GC 压力。但堆外内存管理不当同样会引发泄漏与崩溃。本文总结 DirectByteBuffer、Unsafe、Netty Pooled ByteBuf、Chronicle 等常见方案，并给出治理策略。

# Off-heap 的实现方式
## DirectByteBuffer
- 通过 `ByteBuffer.allocateDirect` 分配；
- 由 `Cleaner` 触发释放，依赖 GC ；
- JDK 9 引入 `sun.misc.Unsafe::invokeCleaner`；
- 分配成本高，适合长生命周期缓冲区。

## sun.misc.Unsafe / VarHandle
- `Unsafe.allocateMemory` / `reallocateMemory`，需要手动释放；
- 使用 `VarHandle` 封装读写提高安全性；
- 需要显式 `Unsafe.freeMemory`。

## Netty Pooled ByteBuf
- 维护 Arena、Chunk、Page，使用 `Recycler` 重用；
- 支持直接内存与堆内存；
- 提供内存泄漏检测器（LEAK DETECTOR）。

## Chronicle Queue/Map
- 基于内存映射文件（mmap）；
- 适合超大数据结构，支持持久化；
- 注意操作系统文件句柄与 page cache。

# 管理与监控
- 启用 `-XX:MaxDirectMemorySize` 限制；
- 使用 `jcmd VM.native_memory` 监控 NMT（Native Memory Tracking）；
- JFR 事件：`NativeMemoryUsage`；
- Prometheus 导出 Direct Memory 指标；
- 对关键场景实现内存审计日志。

# 实战经验
1. **Netty 服务泄漏**：`PooledByteBufAllocator` 未正确释放，导致 `OutOfDirectMemoryError`。通过 `-Dio.netty.leakDetection.level=paranoid` 定位调用栈；
2. **Unsafe 手动管理**：内存泄漏导致宿主机 `dmesg` 输出 `Out of memory`。改用 `Cleaner` 注册钩子，在对象 finalize 时释放；
3. **mmap 文件膨胀**：Chronicle Queue 需要定期滚动文件，避免磁盘被占满，使用 `rsync` 做增量备份。

# 最佳实践
- 尽量使用成熟库（Netty、Agrona）；
- 对 Off-heap 资源构建 RAII 风格包装（实现 `AutoCloseable`）；
- 配合 `cgroup`，防止宿主机内存被耗尽；
- 监控 `-XX:MaxDirectMemorySize` 与 `Native Memory` 使用量；
- 在性能测试中加入 NMT 分析，确保扩缩容安全。

# 总结
堆外内存为性能带来更多可能，但也需要严谨的生命周期管理。通过参数限制、监控与成熟库，我们可以安全地利用 Off-heap 优势。

# 参考资料
- [1] Oracle, "Tuning Java SE for Performance". https://docs.oracle.com/javase/
- [2] JEP 370: Foreign-Memory Access API (Incubator). https://openjdk.org/jeps/370
- [3] Netty ByteBuf 文档. https://netty.io/wiki/reference-counted-objects.html
- [4] Chronicle Queue 官方文档. https://github.com/OpenHFT/Chronicle-Queue
