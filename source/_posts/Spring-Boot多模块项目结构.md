---
title: Spring Boot多模块大型项目结构
date: 2022-08-03
tags: ['#Spring']
---

### 本文目录
<!-- toc -->

# 引言
> 大型企业应用通常需要模块化以提升可维护性。Spring Boot 支持多模块 Maven/Gradle 结构，结合领域划分与共用组件可以构建清晰的工程体系。本文介绍多模块设计、依赖管理与构建优化。

# 模块划分
- **core-domain**：领域模型、服务接口；
- **application-service**：用例逻辑、事件处理；
- **infrastructure**：数据库、消息、外部系统适配；
- **api**：REST/GraphQL 接口；
- **batch**：批处理任务；
- **common-libs**：共享工具、契约。

# Maven 结构示例
```
parent
 ├─ pom.xml (dependencyManagement)
 ├─ core-domain
 ├─ application-service
 ├─ infrastructure
 ├─ api-gateway
 └─ batch-jobs
```
- 使用 `spring-boot-starter-parent` 管理版本；
- `dependencyManagement` 统一依赖版本；
- `spring-boot-maven-plugin` 在最终可执行模块启用。

# 模块依赖治理
- 通过 `enforcer-plugin` 防止循环依赖；
- 隔离 `implementation` 与 `api` 依赖；
- 使用 `ArchUnit` 编写架构规则测试；
- 在 Gradle 中使用 `java-platform` 发布 BOM。

# 配置与资源管理
- 模块化配置：`application-core.yml`、`application-infra.yml`；
- 使用 `spring.config.import` 合并；
- 对敏感配置使用 Vault/Consul；
- 统一日志、监控 starter。

# 构建优化
- 采用 incremental build、Maven Build Cache；
- 在 CI 中使用并行构建 `mvn -T 1C`；
- 使用 Tekton/GitHub Actions 缓存依赖；
- 对测试模块化，保持执行效率。

# 实战经验
- 在保险核心系统中，实现 40+ 模块工程通过 BOM 管理依赖，避免版本冲突；
- 对外部接口模块使用契约测试，保证模块边界稳定；
- 借助 `spring-modulith` 检查模块依赖与文档。

# 总结
多模块结构帮助我们管理大型 Spring Boot 项目。通过合理的模块划分、依赖治理与自动化构建，可以提升可维护性与交付效率。

# 参考资料
- [1] Spring Boot Reference, Build Systems. https://docs.spring.io/spring-boot/docs/current/reference/html/build-tool-plugins.html
- [2] Spring Modulith. https://spring.io/projects/spring-modulith
- [3] Maven Enforcer Plugin. https://maven.apache.org/enforcer/maven-enforcer-plugin/
