---
title: Spring Native 与 GraalVM 原生镜像实践
date: 2021-06-26
tags: ['#Spring', '#GraalVM', '#NativeImage']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 背景
Spring Native 提供了将 Spring 应用编译为 GraalVM 原生镜像的能力，需要评估构建时间、启动速度与内存占用。

# 构建流程
- 使用 Spring Native Build Tools，配置 `native-image.properties`；
- 启用 `--initialize-at-build-time`，减少运行时初始化成本；
- 借助 `spring-native-configuration` 处理反射配置与代理。

# 性能验证
- 对比 JVM 模式与原生镜像的启动耗时和内存占用；
- 利用 `native-image-agent` 收集动态代理与反射需求；
- 配置 CI 缓存 GraalVM 组件，缩短构建时间。

# 自检清单
- 是否补充 GraalVM 所需的反射与资源配置？
- 是否确认原生镜像发布环境的 libc 兼容？
- 是否建立回退方案保留 JVM 版本？

# 参考资料
- Spring Native 官方文档：https://docs.spring.io/spring-native/docs/current/reference/htmlsingle/
- GraalVM Native Image User Guide：https://www.graalvm.org/latest/reference-manual/native-image/
- Spring AOT 官方说明：https://docs.spring.io/spring-boot/docs/current/reference/html/native-image.html
