---
title: Java 17 LTS 升级检查清单
date: 2021-12-12
lang: zh-CN
tags: ['#Java', '#Upgrade', '#Checklist']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 背景
升级到 Java 17 需要覆盖语言特性、运行时参数、依赖兼容与运维策略，避免上线后出现兼容性问题。

# 检查条目
- 构建工具：Gradle/Maven 插件版本、编译选项兼容；
- 运行参数：废弃与移除的 JVM Flags 替代方案；
- 第三方依赖：确认 ASM、ByteBuddy、Netty 等库支持 JDK 17；
- 安全策略：确认 TLS、JCE、Root CA 变更。

# 验证计划
- 建立回归测试矩阵，覆盖核心 API；
- 在预生产环境运行长时间稳定性测试；
- 更新监控与告警阈值，匹配 JDK 17 行为。

# 自检清单
- 是否准备回滚脚本与证书同步方案？
- 是否更新容器基础镜像与探针？
- 是否执行性能基准并记录对比数据？

# 参考资料
- Oracle JDK 17 Migration Guide：https://docs.oracle.com/en/java/javase/17/migrate/index.html
- OpenJDK 17 Release Notes：https://openjdk.org/projects/jdk/17/
- Gradle JDK 17 支持说明：https://docs.gradle.org/current/userguide/compatibility.html
