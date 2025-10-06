---
title: Java I/O 与 NIO 对比：阻塞、非阻塞与零拷贝
date: 2017-12-05
lang: zh-CN
tags: ['#Java']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# I/O 模型演进
- **传统阻塞 I/O (BIO)**：`InputStream`/`OutputStream`、`Reader`/`Writer`，简单易用但线程占用高。
- **NIO**：`Channel`、`Buffer`、`Selector`，支持非阻塞与事件驱动模型。
- **NIO.2 (AIO)**：`AsynchronousChannel`，在部分平台使用操作系统异步 I/O。

# 核心差异
| 维度 | BIO | NIO |
|---|---|---|
| 模型 | 每连接一线程 | 单线程处理多连接 |
| 缓冲 | 流式，无缓冲 | 基于 `ByteBuffer`，支持直接缓冲区 |
| 阻塞 | 阻塞 I/O | 非阻塞 + Selector 多路复用 |
| 零拷贝 | 不支持 | `FileChannel.transferTo/transferFrom`、`MappedByteBuffer` |

# 使用建议
- 小规模连接、快速开发：BIO + 线程池。
- 高并发服务：NIO + Reactor（Netty、Vert.x）。
- 大文件传输：使用 `FileChannel.transferTo` 实现零拷贝。

# 示例：零拷贝
```java
try (FileChannel in = FileChannel.open(sourcePath, StandardOpenOption.READ);
     FileChannel out = FileChannel.open(targetPath, StandardOpenOption.CREATE, StandardOpenOption.WRITE)) {
    long size = in.size();
    long position = 0;
    while (position < size) {
        position += in.transferTo(position, size - position, out);
    }
}
```

# 调优要点
- 直接缓冲区 (`ByteBuffer.allocateDirect`) 可减少复制，但分配释放成本较高。
- 结合 `Selector` 使用时需处理 `SelectionKey` 生命周期，避免重复注册。
- 使用 Netty 等框架可简化线程模型与协议解析。

# 自检清单
- 是否根据并发量/延迟需求选择合适 I/O 模型？
- 是否处理缓冲区释放与内存占用？
- 是否利用零拷贝优化大文件传输？

# 参考资料
- Oracle Java Tutorials - NIO：https://docs.oracle.com/javase/tutorial/essential/io/file.html
- Java SE 8 API - java.nio 包：https://docs.oracle.com/javase/8/docs/api/java/nio/package-summary.html
- Netty 官方文档：https://netty.io/wiki/user-guide-for-4.x.html
