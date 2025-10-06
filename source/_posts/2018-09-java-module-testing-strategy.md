---
title: JPMS 模块化项目的测试策略
date: 2018-09-05
lang: zh-CN
tags: ['#Java', '#JPMS', '#Testing']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 测试面临的挑战
- 模块封装导致默认无法访问非导出包；
- 反射测试需要 `opens`；
- 多模块项目的依赖树与启动配置更复杂。

# 单元测试策略
1. **测试模块**：为测试代码创建独立模块（如 `module com.example.tests { requires com.example.core; }`）。
2. **open module**：在被测模块使用 `open module` 或 `opens` 给特定包以允许反射（JUnit、Mockito）。
3. **测试运行器配置**：Maven Surefire/Gradle Test 需要传入 `--module-path`、`--add-opens` 参数。
4. **服务测试**：对 `provides/uses` 服务进行集成测试，测试模块通过 ServiceLoader 验证实现。

# 示例配置（Maven）
```xml
<plugin>
  <artifactId>maven-surefire-plugin</artifactId>
  <configuration>
    <argLine>--add-opens com.example.core/com.example.internal=ALL-UNNAMED</argLine>
  </configuration>
</plugin>
```

# 集成测试
- 使用 `jlink` 打包模块化运行时，执行端到端测试；
- `jdeps` 分析测试覆盖的依赖；
- 利用 Testcontainers 或模块化 Mock 服务验证跨模块交互。

# 自检清单
- 是否为测试开放必要包且遵循最小暴露原则？
- 是否配置构建工具在测试时正确传入模块参数？
- 是否验证服务提供者在模块模式下的可见性？

# 参考资料
- JPMS 官方教程：https://docs.oracle.com/javase/9/migrate/toc.htm
- Maven Surefire 模块化指南：https://maven.apache.org/surefire/maven-surefire-plugin/examples/modulepath.html
- Gradle + JPMS 测试示例：https://docs.gradle.org/current/userguide/java_module_projects.html
