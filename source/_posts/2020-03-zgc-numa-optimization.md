---
title: ZGC 的 NUMA 优化策略
date: 2020-03-12
lang: zh-CN
tags: ['#JVM', '#GC', '#ZGC']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# NUMA 对 ZGC 的影响
ZGC 支持大堆与低延迟，但在 NUMA 系统上若未合理布局，会出现跨节点访问、内存带宽瓶颈。JDK 17 起 ZGC 默认启用 NUMA 感知，通过 `-XX:+UseNUMA` 与 `-XX:+UseNUMAInterleaving` 控制内存分配策略。

# 优化步骤
1. **启用 NUMA 支持**：`-XX:+UseNUMA -XX:+UseNUMAInterleaving`；
2. **配置大页**：`-XX:+UseLargePages -XX:LargePageSizeInBytes=2m` 提升 TLB 命中；
3. **监控 NUMA 指标**：
   - Linux `numastat`, `perf mem`；
   - JFR 事件 `AllocationInNewTLAB` + `cpuLoad`；
4. **绑定线程**：为 ZGC 并发线程与应用线程设置 `taskset`/CGroup CPU sets，避免跨节点迁移；
5. **堆分配策略**：评估 `-XX:ZAllocationSpikeTolerance`，减少瞬时跨节点分配。

# 验证方法
- 使用 `numactl --hardware` 查看节点内存使用；
- 运行 JMH 或生产压测观察 GC 日志中的 `ZCollectionCycle` 时长；
- 通过 `perf c2c` 检测跨节点缓存一致性延迟。

# 自检清单
- 是否启用 NUMA 并结合操作系统 HugePage 配置？
- 是否监控节点间内存分配比例，避免单节点耗尽？
- 是否结合 CPU 绑定策略减少线程迁移？

# 参考资料
- ZGC 文档：https://docs.oracle.com/en/java/javase/17/gctuning/z-garbage-collector.html
- NUMA 调优指南：https://docs.oracle.com/cd/E37670_01/E75728/html/ol-numa.html
- Red Hat 性能优化手册
