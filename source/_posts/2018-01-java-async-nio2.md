---
title: Java 异步 I/O (NIO.2) 实战指南
date: 2018-01-05
lang: zh-CN
tags: ['#Java', '#NIO']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# NIO.2 异步模型概览
Java 7 引入 `AsynchronousSocketChannel`、`AsynchronousServerSocketChannel` 与 `AsynchronousFileChannel`，在支持的平台上利用操作系统异步 I/O 能力（Windows IOCP、Linux AIO/epoll 模拟）。它通过回调或 `Future` 获取结果，减少线程阻塞。

# 核心 API
- **连接**：`AsynchronousServerSocketChannel#accept`、`AsynchronousSocketChannel#connect`
- **读写**：`read(ByteBuffer dst, A attachment, CompletionHandler<Integer, ? super A>)`
- **文件传输**：`AsynchronousFileChannel#read/#write`、`transferTo` 搭配 `CompletionHandler`
- **线程池**：默认使用系统线程池，可通过 `AsynchronousChannelGroup` 自定义。

# 示例：异步 Echo 服务器
```java
AsynchronousChannelGroup group = AsynchronousChannelGroup.withFixedThreadPool(4, Executors.defaultThreadFactory());
AsynchronousServerSocketChannel server = AsynchronousServerSocketChannel.open(group)
    .bind(new InetSocketAddress(8080));
server.accept(null, new CompletionHandler<AsynchronousSocketChannel, Void>() {
    @Override
    public void completed(AsynchronousSocketChannel client, Void att) {
        server.accept(null, this); // 接受下一连接
        ByteBuffer buffer = ByteBuffer.allocate(1024);
        client.read(buffer, buffer, new CompletionHandler<Integer, ByteBuffer>() {
            public void completed(Integer result, ByteBuffer buf) {
                buf.flip();
                client.write(buf, buf, new CompletionHandler<Integer, ByteBuffer>() {
                    public void completed(Integer r, ByteBuffer b) {
                        if (b.hasRemaining()) {
                            client.write(b, b, this);
                        } else {
                            b.clear();
                            client.read(b, b, this);
                        }
                    }
                    public void failed(Throwable exc, ByteBuffer b) { closeQuietly(client); }
                });
            }
            public void failed(Throwable exc, ByteBuffer buf) { closeQuietly(client); }
        });
    }
    @Override
    public void failed(Throwable exc, Void att) {
        exc.printStackTrace();
    }
});
```

# 调优建议
- 使用 `AsynchronousChannelGroup` 控制线程数，避免与 CPU 核心失衡；
- 大量小 I/O 操作仍可考虑 Netty 等 Reactor 框架，异步文件适合大文件复制；
- 在 Linux 上，NIO.2 异步文件操作内部可能退化为线程池模拟，需评估性能。

# 自检清单
- 是否理解 CompletionHandler 的生命周期，避免重复触发？
- 是否正确处理异常与关闭通道？
- 是否根据工作负载调整异步通道组线程池？

# 参考资料
- Oracle Java Tutorials - Asynchronous I/O：https://docs.oracle.com/javase/tutorial/essential/io/file.html#async
- Java SE 8 API - java.nio.channels 包：https://docs.oracle.com/javase/8/docs/api/java/nio/channels/package-summary.html
- Netty 使用指南：https://netty.io/wiki/user-guide-for-4.x.html
