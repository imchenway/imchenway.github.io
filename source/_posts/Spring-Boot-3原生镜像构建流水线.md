---
title: Spring Boot 3原生镜像构建流水线
date: 2022-02-24
lang: zh-CN
tags: ['#Spring']
---

### 本文目录
<!-- toc -->

# 引言
> Spring Boot 3 基于 AOT 处理与 GraalVM Native Image 提供官方支持，可大幅缩短启动时间并降低内存占用。本文从构建流水线角度出发，梳理如何将传统 Jar 部署迁移到原生镜像，包括代码要求、依赖分析、CI/CD 实践。

# 原生镜像原理概览
- Spring AOT 插件在构建阶段生成优化后的 bean 定义、代理与反射元数据；
- GraalVM Native Image 通过静态分析和提前编译生成可执行文件；
- 构建时需要提供反射、资源、动态代理、序列化的配置，Spring Boot 3 借助 `spring-aot-maven-plugin` 自动生成。

# 项目改造步骤
## 依赖与插件
```xml
<plugin>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-maven-plugin</artifactId>
  <configuration>
    <image>
      <builder>paketobuildpacks/builder-jammy-tiny</builder>
      <env>
        <BP_NATIVE_IMAGE>true</BP_NATIVE_IMAGE>
      </env>
    </image>
  </configuration>
</plugin>
<plugin>
  <groupId>org.graalvm.buildtools</groupId>
  <artifactId>native-maven-plugin</artifactId>
  <version>0.10.1</version>
</plugin>
```

## 代码约束
- 避免未声明的反射（使用 `RuntimeHintsRegistrar` 注册）；
- 使用 `@NativeHint` 提供资源/代理信息；
- 避免动态类加载、`Class.forName`；
- 校验第三方依赖是否兼容（参考 Spring Native compatibility matrix）。

# 构建流水线设计
1. **预检阶段**：运行单元测试，执行 `mvn -PnativeTest test`；
2. **AOT 生成**：`mvn -Pnative spring-boot:process-aot`，产出 `META-INF/native-image`；
3. **Native Image 编译**：使用 Paketo Buildpacks (`pack build`) 或 `native-image` 工具；
4. **镜像瘦身**：选择 `bellsoft/liberica` 或 `distroless` 基础镜像；
5. **部署策略**：在 Kubernetes 中使用 `readinessProbe` 缩短调度时间，关注容器内存上限；
6. **性能基线**：对比 JVM 模式与 native 模式的启动、内存、吞吐指标。

# CI/CD 示例
- GitHub Actions：使用 `actions/setup-java` 安装 GraalVM，缓存 Maven 目录，构建原生镜像后推送镜像仓库；
- Jenkins：提供 `Native Build` stage，支持并行构建 Linux/ARM 环境；
- 推荐在流水线中加入 `native-image-agent` 离线配置收集步骤，避免遗漏反射。

# 监控与运维建议
- 原生镜像缺少 JIT，需要通过 `Micrometer`、`Prometheus` 监控性能；
- 无法使用常规 `jcmd` 工具，可依赖 `JFR` 轻量化事件记录或 `async-profiler --all`；
- 注意 glibc 与 musl 兼容性，构建与运行环境需一致。

# 总结
Spring Boot 3 提供了原生镜像的“官方路线”。通过 AOT 配合 GraalVM，企业可以在微服务、Serverless 场景获取更佳冷启动性能。关键在于完善的流水线、兼容性测试与监控体系。

# 参考资料
- [1] Spring Boot 3 Reference Guide, Native Image support. https://docs.spring.io/spring-boot/docs/current/reference/html/native-image.html
- [2] GraalVM Native Image User Guide. https://www.graalvm.org/latest/reference-manual/native-image/
- [3] Spring AOT & Native Samples. https://github.com/spring-projects/spring-boot/tree/main/samples
- [4] Paketo Buildpacks, Java Native Image Builder. https://paketo.io/docs/buildpacks/language-family-buildpacks/java/
