---
title: Spring Native与容器镜像瘦身
date: 2022-06-24
lang: zh-CN
tags: ['#Spring']
---

### 本文目录
<!-- toc -->

# 引言
> 在容器化场景下，镜像体积直接影响拉取时间与存储成本。Spring Native（基于 GraalVM）不仅加速启动，也为镜像瘦身提供了可能。本文总结镜像优化策略与最佳实践。

# 镜像瘦身策略
1. **基准镜像选择**：`distroless`, `alpine`, `ubi-minimal`；
2. **多阶段构建**：编译阶段安装 GraalVM，发布阶段使用精简基础镜像；
3. **Buildpacks**：`paketobuildpacks/builder-jammy-tiny`；
4. **Jlink/Jdeps**：对 JVM 仍需使用时裁剪模块。

# Spring Native 构建流程
- 使用 `spring-boot-maven-plugin` 配置 Build Image；
- `BP_NATIVE_IMAGE=true` 生成可执行文件；
- 尝试 `--static` 构建静态二进制；
- 镜像体积可降到几十 MB。

# 资源与配置
- 授权/证书数据挂载到外部卷；
- 将配置移动到 ConfigMap/Secrets，避免镜像膨胀；
- 使用层缓存：将依赖和应用分层，减少变更无关层重建。

# 监控与调优
- 在 Kubernetes 中设置 `readinessProbe`，利用快速启动；
- `resources.requests/limits` 根据实际内存占用设定；
- 监控 `container_fs`, `imagePullTime`；
- 结合 `Trivy` 扫描镜像漏洞。

# 实战经验
- 通过 Spring Native + Distroless，将服务镜像从 350MB 降至 55MB，冷启动时间满足 Serverless 需求；
- 对于需要 JIT 的场景，仍采用 JRE 镜像 + Jlink；
- 建立镜像基线构建流水线，每次发布前验证体积与安全。

# 总结
Spring Native 不仅带来性能优势，也显著减少镜像体积。结合多阶段构建、配置外部化与安全扫描，可构建轻量、安全的容器镜像。

# 参考资料
- [1] Spring Native Guide. https://docs.spring.io/spring-boot/docs/current/reference/html/native-image.html
- [2] GraalVM Native Image. https://www.graalvm.org/
- [3] Google Distroless. https://github.com/GoogleContainerTools/distroless
