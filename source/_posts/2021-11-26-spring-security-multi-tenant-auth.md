---
title: Spring Security 多租户鉴权策略
date: 2021-11-26
lang: zh-CN
tags: ['#Spring', '#Security', '#MultiTenant']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 背景
SaaS 平台需要支持多租户隔离，要求在认证、授权与审计层提供租户上下文。

# 策略设计
- 使用自定义 `Authentication` 携带租户标识；
- 基于 `SecurityContextHolder` + `TenantContext` 传播租户信息；
- 对资源服务器启用租户级别的 Scope 与权限控制。

# 运维与审计
- 对登录/访问日志记录租户 ID，满足审计要求；
- 在缓存与会话存储中分区隔离，防止越权；
- 使用 Spring Authorization Server 支持多租户授权码流。

# 自检清单
- 是否对租户切换编写集成测试？
- 是否验证租户上下文丢失时的失败策略？
- 是否配置审计告警与合规报表？

# 参考资料
- Spring Security 官方文档：https://docs.spring.io/spring-security/reference/
- Spring Authorization Server 指南：https://docs.spring.io/spring-authorization-server/docs/current/reference/html/
- OAuth 2.0 多租户实践（IETF Draft）：https://datatracker.ietf.org/doc/html/draft-ietf-oauth-mtls
