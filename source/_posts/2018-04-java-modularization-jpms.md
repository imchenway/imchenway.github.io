---
title: Java 9 模块化 (JPMS) 迁移指引
date: 2018-04-05
lang: zh-CN
tags: ['#Java', '#JPMS']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# JPMS 概览
Java 9 引入模块系统（Java Platform Module System），通过 `module-info.java` 定义模块依赖、导出包与服务。目标是提升封装性、降低运行时体积并支持可维护的 API 边界。

# 迁移步骤
1. **分析依赖**：使用 `jdeps` 查看包引用：`jdeps --module-path mods --add-modules ALL-DEFAULT <jar>`。
2. **创建 module-info**：声明 `module com.example.app { requires java.sql; exports com.example.service; }`
3. **自动模块与未命名模块**：未模块化的库会被放入自动模块，需逐步替换或添加 `Automatic-Module-Name`。
4. **拆分包与反射**：确保同一路径只在一个模块；使用 `opens` 允许反射访问。
5. **运行与打包**：`java --module-path mods -m com.example.app/com.example.Main`。

# 常见问题
- **深层反射**：Spring/Hibernate 需使用 `opens` 或 `--add-opens` 兼容；
- **服务定位**：使用 `uses` / `provides ... with ...` 声明服务提供者；
- **多模块工程**：Gradle/Maven 插件支持自动生成 `module-info`。

# 调试工具
- `jdeps`、`jmod`、`jlink` 用于依赖分析、模块打包与裁剪运行时镜像；
- `--add-reads`、`--add-exports` 在迁移期间提供临时桥接。

# 自检清单
- 是否完成依赖分析，确认无拆分包？
- 是否为框架反射访问配置 `opens`？
- 是否评估自动模块与命名模块的兼容策略？

# 参考资料
- JEP 261: Module System：https://openjdk.org/jeps/261
- Oracle JPMS 官方教程：https://docs.oracle.com/javase/9/docs/api/java/lang/module/package-summary.html
- Java 9 Migration Guide：https://docs.oracle.com/javase/9/migrate/toc.htm
