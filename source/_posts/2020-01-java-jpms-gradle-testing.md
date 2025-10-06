---
title: Java 模块化测试流水线最佳实践
date: 2020-01-05
lang: zh-CN
tags: ['#Java', '#JPMS', '#Testing']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 为什么要为 JPMS 建立独立测试流水线
随着 Java 模块化的普及，测试代码本身也需要作为模块参与编译与运行。未做好模块权限与 `--module-path` 管理时，测试将频繁出现 `IllegalAccessError` 或类路径冲突，因此需要为 Gradle/Maven 的测试阶段设计专门的模块化流水线。

# 流程拆解
- **依赖分析**：使用 `jdeps --multi-release 17 --print-module-deps` 生成测试所需模块列表。
- **测试模块声明**：在 `src/test/java/module-info.java` 中显式 `requires` 被测模块，并通过 `opens` 暴露反射访问包。
- **Gradle 配置**：
```kotlin
testing {
    suites {
        val test by getting(JvmTestSuite::class) {
            targets.all {
                testTask.configure {
                    jvmArgs("--enable-preview")
                    modularity.inferModulePath.set(true)
                }
            }
        }
    }
}
```
- **运行参数**：在 CI 中为 `test` 任务追加 `--add-opens 被测模块/内部包=测试模块`，确保 Mockito/JUnit 反射可用。

# 兼容策略
1. **自动模块过渡期**：为尚未模块化的第三方库指定 `Automatic-Module-Name`，降低模块名变化风险。
2. **测试友好 API**：核心模块可提供受保护的测试挂钩或 `ServiceLoader` 实现，以减少 `opens` 范围。
3. **预览特性验证**：当使用 `record`、`sealed` 等预览语法时，需同时在编译与测试阶段加上 `--enable-preview`，避免 CI 环境遗漏。

# 自检清单
- 是否通过 `jdeps` 确认所有依赖模块都已声明？
- 是否只针对测试所需包使用最小粒度的 `opens`？
- 是否在 CI 中统一配置 `--module-path` 与预览开关？

# 参考资料
- 官方 JPMS 指南：https://docs.oracle.com/javase/9/docs/api/java/lang/module/package-summary.html
- Gradle Modular Testing 指南：https://docs.gradle.org/current/userguide/java_testing.html
- `jdeps` 工具文档：https://docs.oracle.com/en/java/javase/17/docs/specs/man/jdeps.html
