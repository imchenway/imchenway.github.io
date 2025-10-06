---
title: JVM模块化系统JPMS的落地实践
date: 2022-01-05
lang: zh-CN
tags: ['#JVM']
---

### 本文目录
<!-- toc -->

# 引言
> Java Platform Module System (JPMS) 在 JDK 9 引入，为大型应用提供模块化封装与强封装控制。本文分享在企业项目中落地 JPMS 的经验，包括模块图设计、迁移策略与构建工具。

# 模块化基础
- `module-info.java` 定义 `exports`、`requires`；
- 强封装阻止未导出包被访问；
- `opens` 允许反射访问；
- 读边与服务提供者机制。

# 迁移步骤
1. **分层梳理依赖**：识别领域模块、基础设施模块；
2. **创建模块图**：使用 `jdeps --module-path` 分析；
3. **逐步 modularize**：从核心模块开始，兼容 `Automatic Module`；
4. **处理反射**：对 Spring、Hibernate 需要 `opens`；
5. **构建工具**：Maven `maven-compiler-plugin`，Gradle `java-library`.

# 实战挑战
- **自动模块命名冲突**：第三方 jar 未声明 module-info，需使用 `Automatic-Module-Name`；
- **深反射库**：使用 `--add-opens` 暂时开放；
- **多版本兼容**：通过 Multi-release JAR 或保持兼容模式。

# 监控与运维
- 使用 `jlink` 构建裁剪 runtime；
- 在容器中部署体积小的镜像；
- `jcmd VM.classloaders` 观察模块加载；
- `jdeps --check` 维护模块边界。

# 总结
JPMS 提供了强大的封装能力和更小的运行时镜像。虽然迁移需要投入，但长期有助于治理大型代码库与部署效率。

# 参考资料
- [1] JEP 261: Module System. https://openjdk.org/jeps/261
- [2] Oracle, "Java Platform Module System" Guide. https://docs.oracle.com/javase/9/docs/
- [3] Mark Reinhold, "State of the Module System" 白皮书.
