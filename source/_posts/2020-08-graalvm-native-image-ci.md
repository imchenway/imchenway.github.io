---
title: GraalVM Native Image 在 CI/CD 中的加速技巧
date: 2020-08-26
tags: ['#GraalVM', '#CI/CD', '#Performance']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 构建痛点
Native Image 构建耗时常达数分钟，且依赖反射配置。为了在 CI/CD 中高效使用，需要缓存构建产物、分层优化镜像、使用构建服务器。

# 加速策略
- **Docker 多阶段**：将 GraalVM 与应用依赖缓存为基础镜像；
- **artifact 缓存**：利用 Gradle/Maven cache、SCC（Shared Classes Cache）缩短编译；
- **Build Server**：使用 GraalVM `--shared-engine` 或 Buildpacks（Paketo）利用 buildpacks 缓存；
- **配置生成**：`native-image-agent` 收集反射配置并存入版本库。

# CI 示例（GitHub Actions）
```yaml
- uses: actions/cache@v3
  with:
    path: |
      ~/.m2
      ~/.gradle
    key: ${{ runner.os }}-native-${{ hashFiles('**/pom.xml') }}
- run: gu install native-image
- run: ./mvnw -Pnative native:compile
- uses: actions/upload-artifact@v3
  with:
    name: demo-native
    path: target/demo
```

# 自检清单
- 是否缓存构建工具与 GraalVM 组件？
- 是否在构建后运行集成测试验证 Native 产物？
- 是否记录构建耗时并持续优化？

# 参考资料
- GraalVM Native Image 手册：https://www.graalvm.org/latest/reference-manual/native-image/
- Paketo Buildpacks for Native Image：https://paketo.io/docs/howto/java/#native-image
- GraalVM Build Server：https://www.graalvm.org/latest/reference-manual/native-image/OptimizingImageBuildTime/
