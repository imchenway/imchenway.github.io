---
title: Kotlin 与 Java 协同开发注意事项清单
date: 2020-07-19
tags: ['#Java', '#Kotlin', '#Interoperability']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 互操作常见问题
在 Java 项目逐步引入 Kotlin 时，需要注意空安全、协程、SAM 转换等差异，否则容易在模块边界产生 `NullPointerException` 或性能开销。

# 核心检查点
- **空安全**：在 Kotlin 暴露给 Java 的 API 上使用 `@NotNull/@Nullable` 注解；
- **协程**：提供 `suspend` 函数的 Java 包装器；
- **默认参数**：为 Java 调用方提供 @JvmOverloads；
- **函数式接口**：使用 `fun interface` 或 `@FunctionalInterface`；
- **数据类与记录**：在 Java 中选择 `componentN` 或 `copy` 方法时注意不可变约束。

# 构建配置
- Maven：在 `maven-compiler-plugin` 中添加 `-parameters` 与 `kotlin-maven-plugin` 顺序；
- Gradle：配置 `kotlinOptions.jvmTarget` 与 `java { toolchain }` 统一；
- 检查模块路径与 `module-info.java` 的 `requires kotlin.stdlib`。

# 自检清单
- 是否为跨语言 API 编写单元测试验证空安全？
- 是否避免在 Kotlin 中频繁创建 SAM 适配器造成装箱？
- 是否在文档中记录协程调度策略与 Java 线程池配合？

# 参考资料
- Kotlin 官方互操作指南：https://kotlinlang.org/docs/java-interop.html
- JetBrains Kotlin Style Guide：https://kotlinlang.org/docs/coding-conventions.html
- Effective Kotlin（跨语言实践章节）
