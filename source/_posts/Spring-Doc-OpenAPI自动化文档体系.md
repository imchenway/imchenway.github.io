---
title: Spring Doc(OpenAPI)自动化文档体系
date: 2022-09-22
lang: zh-CN
tags: ['#Spring']
---

### 本文目录
<!-- toc -->

# 引言
> Springdoc-openapi 为 Spring Web/ WebFlux 自动生成 OpenAPI 3 规范。结合 CI/CD、Mock、契约测试，可以构建完整的 API 文档体系。本文分享实践步骤与工具链。

# Springdoc 配置
```yaml
springdoc:
  api-docs:
    path: /v3/api-docs
  swagger-ui:
    path: /swagger-ui.html
  packages-to-scan: com.example.api
```
- 支持注解 `@Operation`, `@Schema`, `@Parameter`；
- 可生成 JSON/YAML；
- 支持多模块聚合。

# 文档自动化
1. **生成**：在 CI 中运行 `mvn spring-boot:run -Dspringdoc.api-docs.enabled=true` 并导出 JSON；
2. **校验**：使用 `openapi-generator-cli validate`；
3. **Mock**：结合 `Prism`, `WireMock` 进行契约测试；
4. **发布**：上传至 API Portal (Redoc, Stoplight)。

# 版本管理
- 按环境/版本存储：`v1`, `v2`；
- 对变更进行 Review，防止破坏兼容性；
- 使用 Git LFS 或 Object Storage 存储历史文档；
- 设置 Deprecation Policy。

# 与前端协同
- 生成 TypeScript SDK：`openapi-generator-cli generate -g typescript-fetch`; 
- 使用 Swagger UI 或 Redoc 提供交互式文档；
- 结合 Storybook 演示 API 交互。

# 监控与测试
- 契约测试：Spring Cloud Contract / Pact；
- Schema diff 自动检查；
- 在 Gateway 层校验请求/响应符合 Schema；
- 记录 API 调用数据，检查文档与实际一致。

# 实战经验
- 金融开放平台中，每次提交合并前必须通过文档验证；
- 构建 API Portal，提供多语言 SDK；
- 结合权限控制，为不同合作伙伴提供定制文档。

# 总结
Springdoc-openapi 简化了 Spring 应用的 API 文档管理。配合 CI、契约测试和门户发布，可以构建可靠的自动化文档体系。

# 参考资料
- [1] Springdoc OpenAPI Documentation. https://springdoc.org
- [2] OpenAPI Specification 3.1. https://spec.openapis.org/oas/v3.1.0
- [3] OpenAPI Generator. https://openapi-generator.tech
