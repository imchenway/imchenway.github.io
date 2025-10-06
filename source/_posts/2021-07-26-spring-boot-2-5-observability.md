---
title: Spring Boot 2.5 可观测性新特性
date: 2021-07-26
lang: zh-CN
tags: ['#Spring', '#Observability', '#Micrometer']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 背景
Spring Boot 2.5 引入多项可观测性增强，需要评估对现有指标、日志与追踪方案的影响。

# 新增能力
- Micrometer `ObservationRegistry` 实验特性，统一指标与追踪；
- Actuator 支持多租户指标过滤器；
- Logback 指标整合，引入事件级标签。

# 落地指南
- 升级 `spring-boot-starter-actuator`，同步更新 Prometheus/Sleuth 版本；
- 配置 `management.observations`，确认默认标签策略；
- 在 Dev/Prod 开启 `trace: false` AOP 保护敏感接口，避免过度采样。

# 自检清单
- 是否验证旧版 Micrometer 仪表兼容性？
- 是否在部署前更新 Dashboard 与报警配置？
- 是否评估新增标签对指标存储成本的影响？

# 参考资料
- Spring Boot 2.5 Release Notes：https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.5-Release-Notes
- Micrometer 官方文档：https://micrometer.io/docs
- Spring Actuator 官方文档：https://docs.spring.io/spring-boot/docs/2.5.0/reference/html/actuator.html
