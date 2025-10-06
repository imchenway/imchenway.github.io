---
title: Java 原生内存泄漏排查流程
date: 2020-11-26
lang: zh-CN
tags: ['#JVM', '#NativeMemory', '#Troubleshooting']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 原生内存泄漏的来源
常见来源包括 JNI/DirectByteBuffer 未释放、第三方库 C++ 分配、libssl/h2 客户端等。由于不受 GC 控制，需要通过工具定位并修复。

# 排查工具
- **NMT**：快速定位占用类型；
- **jemalloc/ld_preload**：替换分配器捕获堆栈；
- **perf mem**, `heaptrack`；
- **pmap**, `/proc/<pid>/smaps` 分析内存段；
- JFR `NativeMemoryUsage`。

# 流程
1. 使用 NMT 获取大类；
2. 若是 `Internal`/`Thread`，检查线程泄漏；
3. 若是 `Class`，检查 ClassLoader；
4. 结合 `jemalloc` 堆栈对照代码定位；
5. 修复并在 CI 中引入内存回归测试。

# 自检清单
- 是否在容器内启用 cgroup 限制并监控 RSS？
- 是否为 JNI/DirectBuffer 设计释放策略？
- 是否在部署前运行内存泄漏测试（pressure + leak detection）？

# 参考资料
- HotSpot NMT 文档：https://docs.oracle.com/javase/8/docs/technotes/guides/vm/nmt-8.html
- jemalloc Profiling：https://jemalloc.net/jemalloc.3.html
- Netflix Native Memory 排查案例
