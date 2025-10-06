---
title: StructuredTaskScope 实战笔记
date: 2021-08-12
lang: zh-CN
tags: ['#Java', '#StructuredConcurrency', '#Loom']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 背景
StructuredTaskScope 提供结构化并发模型，用于管理关联任务生命周期，避免线程泄漏与半成功状态。

# 实践步骤
- 使用 `StructuredTaskScope.ShutdownOnFailure` 聚合并行任务；
- 配置 `scope.throwIfFailed()` 统一处理异常与回滚；
- 在服务层实现超时控制，确保内部任务及时终止。

# 工程注意
- 将资源释放逻辑放入 `close()` 钩子中；
- 在日志中记录 Scope ID，便于串联调用链；
- 编写 Contract Test 验证失败情况下是否全部回滚。

# 自检清单
- 是否避免在 Scope 内共享可变状态？
- 是否处理虚拟线程被 Pin 的场景？
- 是否覆盖成功/失败/超时三类路径的测试？

# 参考资料
- Structured Concurrency 官方提案：https://openjdk.org/jeps/428
- Project Loom Early-Access Docs：https://download.java.net/java/early_access/loom/docs/api/jdk.incubator.concurrent/jdk/incubator/concurrent/package-summary.html
- Java 虚拟线程指南：https://docs.oracle.com/en/java/javase/21/core/java-virtual-threads.html
