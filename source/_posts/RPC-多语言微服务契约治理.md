---
title: 多语言微服务的契约治理
date: 2022-12-31
tags: ['#ServiceMesh']
---

### 本文目录
<!-- toc -->

# 引言
> 在多语言微服务中，API 契约（IDL、Schema）是保证互通与演进的基础。本文分享契约治理流程、工具链以及与 Service Mesh/RPC 的协同策略。

# 契约类型
- Protobuf/IDL（gRPC、Dubbo Triple）；
- OpenAPI/REST；
- AsyncAPI（事件驱动）；
- GraphQL Schema。

# 治理流程
1. Contract Repository：集中管理契约；
2. Review & Approval：代码合并前检查契约变更；
3. Code Generation：多语言 SDK；
4. Compatibility Check：向后兼容、版本策略；
5. Deployment & Validation：在测试环境验证；
6. Monitoring：确保运行时遵守契约。

# 工具链
- Buf/Prototool 管理 Protobuf；
- OpenAPI Generator、Swagger Codegen；
- Pact、Spring Cloud Contract；
- Schemathesis、Prism Mock；
- GraphQL Inspector。

# 版本管理
- 语义化版本 SemVer；
- Proto 使用 `reserved` 防止字段重用；
- 增量迭代：添加字段而非删除；
- API Deprecation Policy。

# Mesh/RPC 协同
- 在 Gateway 层校验契约；
- 根据契约生成 Envoy Filter；
- Telemetry 中记录契约版本；
- 在 Rollout 之前运行契约测试。

# 总结
契约治理是多语言微服务的基石。通过流程、工具和 Mesh/RPC 协同，可以保障接口演进的稳定性。

# 参考资料
- [1] Buf Documentation. https://buf.build/docs
- [2] OpenAPI Initiative. https://www.openapis.org
- [3] Pact Contract Testing. https://docs.pact.io
