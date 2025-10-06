---
title: Spring Cloud Kubernetes与ConfigMap/Secret管理
date: 2022-09-12
lang: zh-CN
tags: ['#Spring']
---

### 本文目录
<!-- toc -->

# 引言
> 在 Kubernetes 环境中，应用配置与密钥需要动态管理。Spring Cloud Kubernetes (SCK) 提供 ConfigMap、Secret、服务发现等集成。本文聚焦配置管理、热更新与安全实践。

# 核心组件
- `ConfigMapPropertySource`：从 ConfigMap 获取配置；
- `SecretsPropertySource`：加载 Secret；
- `ConfigurationWatcher`：监听资源变更；
- `LoadBalancer`：整合服务发现。

# 配置加载
```yaml
spring:
  cloud:
    kubernetes:
      config:
        enabled: true
        sources:
          - name: app-config
      secrets:
        enabled: true
        sources:
          - name: app-secret
```
- 支持 `namespace`, `labels` 选择；
- `profile` 映射：`app-config-prod.yaml`。

# 热更新
- 启用 `spring.cloud.kubernetes.reload.enabled=true`；
- `mode: event` 使用 Kubernetes Informer；
- `strategy: refresh` 触发 Spring 的 `RefreshScope`；
- 对 Bean 结构做好线程安全。

# 安全考虑
- Secret 使用 Base64 编码，应结合 KMS (AWS KMS, HashiCorp Vault)；
- 使用 RBAC 限制 ServiceAccount 权限；
- ConfigMap 不存储敏感信息；
- 审计配置变更，写入 GitOps 仓库。

# GitOps 与管理
- 使用 ArgoCD/Flux 同步 ConfigMap/Secret；
- 通过 `kustomize configMapGenerator` 构建环境差异；
- Spring Boot 结合 `spring.config.import=kubernetes:`；
- 灰度：创建 `app-config-gray`，对应灰度环境。

# 实战经验
- 在多租户集群中，使用命名空间隔离 ConfigMap/Secret；
- 对高频变更通过 `Spring Cloud Bus` 广播；
- 将配置版本写入应用指标，便于监控。

# 总结
Spring Cloud Kubernetes 简化了在 K8s 中的配置与密钥管理。通过热更新、RBAC 和 GitOps，能够构建安全、可控的配置体系。

# 参考资料
- [1] Spring Cloud Kubernetes Reference. https://docs.spring.io/spring-cloud-kubernetes/reference/
- [2] Kubernetes ConfigMap/Secret Docs. https://kubernetes.io/docs/concepts/configuration/
- [3] GitOps Principles. https://opengitops.dev/
