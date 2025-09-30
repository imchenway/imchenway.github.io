---
title: GraalVM Native Image 构建流水线实践
date: 2018-12-05
tags: ['#Java', '#GraalVM', '#Performance']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# Native Image 优势
GraalVM Native Image 将 Java 应用提前编译为静态可执行文件，具备低启动延迟、低内存占用的特性，适合函数计算、CLI 工具、微服务冷启动优化。

# 前置条件
- GraalVM 发行版（Community/Enterprise）；
- 安装 `native-image` 组件：`gu install native-image`；
- 应用需避免动态类加载、反射、JIT 依赖，或通过配置显式声明。

# 构建流程
1. **准备配置**：
   - `reflect-config.json`、`resource-config.json` 等，使用 `native-image-agent` 自动生成：
   ```bash
   java -agentlib:native-image-agent=config-output-dir=./META-INF/native-image -jar app.jar
   ```
2. **执行构建**：
   ```bash
   native-image \
     --no-fallback \
     --enable-http \
     --enable-https \
     -H:Name=demo-service \
     -H:+ReportExceptionStackTraces \
     -jar app.jar
   ```
3. **优化参数**：`-H:+PrintAnalysisCallTree`、`-H:Optimize=2`、`--initialize-at-build-time`。

# CI/CD 集成
- Dockerfile：
```dockerfile
FROM ghcr.io/graalvm/graalvm-ce:22.3.1 AS builder
RUN gu install native-image
COPY . /workspace
RUN ./mvnw -Pnative -DskipTests package

FROM busybox:1.36-glibc
COPY --from=builder /workspace/target/demo-service /app/demo-service
ENTRYPOINT ["/app/demo-service"]
```
- 在 CI 中缓存依赖、并行执行测试与 Native 构建；
- 产物体积可通过 `strip`、UPX 压缩。

# 监控与调试
- `-H:+ReportUnsupportedElementsAtRuntime` 定位仍需配置的反射；
- 使用 `gdb` 或 VisualVM Native Image plugin 调试；
- 与 Micrometer 集成输出指标，确认无遗漏。

# 自检清单
- 是否使用 agent 自动生成配置并人工校验？
- 是否对 Native Image 构建耗时建立缓存策略？
- 是否验证启动时间、内存占用与功能一致性？

# 参考资料
- GraalVM Native Image 文档：https://www.graalvm.org/latest/reference-manual/native-image/
- Oracle GraalVM Dev Guide：https://docs.oracle.com/en/graalvm/enterprise/22/docs/getting-started/native-image/
- Spring Native/GraalVM 示例：https://docs.spring.io/spring-framework/docs/current/reference/html/native-image.html
