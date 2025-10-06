---
title: 容器镜像瘦身与多阶段构建技巧
date: 2024-08-22
lang: zh-CN
tags: ['#Container']
---

### 本文目录
<!-- toc -->

# 引言
> 镜像体积直接影响拉取时间与安全风险。多阶段构建、精简基础镜像与文件扫描是镜像瘦身的关键。本文总结常用方法与实践案例。

# 镜像瘦身策略
- 选择轻量基础镜像（distroless、alpine、ubi-minimal）；
- 多阶段构建 `FROM builder` + `FROM runtime`；
- 移除临时文件、构建产物；
- 使用 `.dockerignore` 排除不必要文件；
- 运行时使用非 root 用户。

# 多阶段构建示例
```Dockerfile
FROM golang:1.22 AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o app

FROM gcr.io/distroless/base
COPY --from=build /src/app /app
USER nonroot:nonroot
ENTRYPOINT ["/app"]
```

# 优化技巧
- `--mount=type=cache` 缓存依赖；
- 使用 BuildKit 并行构建；
- 统一基础镜像管理，减少层差异；
- 结合 Docker Slim、SlimToolkit 深度瘦身。

# 安全扫描
- 构建后运行 Trivy、Grype，识别漏洞；
- 记录 SBOM（Syft、CycloneDX）；
- 在 CI 阶段阻断高风险镜像。

# 总结
通过多阶段构建、精简基础镜像、缓存优化与安全扫描，可以大幅降低镜像体积并提升安全性。结合企业镜像仓库策略，实现可控的镜像供应链。

# 参考资料
- [1] Docker Documentation: Use multi-stage builds. https://docs.docker.com/develop/develop-images/multistage-build/
- [2] BuildKit and cache mounts. https://docs.docker.com/build/cache/
