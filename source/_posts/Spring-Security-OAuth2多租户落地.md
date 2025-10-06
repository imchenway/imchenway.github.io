---
title: Spring Security OAuth2.1的多租户落地
date: 2022-05-15
lang: zh-CN
tags: ['#Spring']
---

### 本文目录
<!-- toc -->

# 引言
> Spring Security 5.7 之后推荐使用 OAuth2.1 组件构建授权服务器。多租户 SaaS 场景需要针对不同租户的身份源、客户端与策略进行隔离。本文介绍多租户设计、数据模型与安全策略。

# 租户模型
- `Tenant`：租户信息、品牌、配置；
- `IdentityProvider`：OIDC、SAML、企业 AD；
- `ClientRegistration`：为每个租户定义客户端；
- `Authorization`：Token、Refresh Token 存储；
- `Policy`：Scopes、角色与资源映射。

# Spring Authorization Server 配置
```java
@Bean
public RegisteredClientRepository clientRepository(TenantService tenantService) {
    return tenantId -> tenantService.findClient(tenantId)
        .map(MyRegisteredClient::toRegisteredClient)
        .orElse(null);
}
```
- 使用 `TenantContextHolder` 解析请求中的租户标识（域名、Header）；
- 将 `OAuth2TokenCustomizer` 扩展，写入租户 Claim。

# 身份源集成
- 支持租户自带身份源：通过 `DelegatingAuthenticationProvider` 动态路由；
- OIDC 联邦登录：每租户维护 `Issuer URI` 与 `ClientSecret`；
- 内部用户库：使用 `UserDetailsService` + `PasswordEncoder`。

# 授权策略
- 定义租户级 Scope：`tenant:orders.read`；
- 结合 `AuthorizationConsentService` 管理授权；
- 多租户 Resource Server：读取 Token 中租户 ID，使用 `BearerTokenAuthentication` 构建 `Authentication`；
- 在网关层基于租户限制访问。

# 运维与审计
- 档案：记录租户注册、授权操作；
- 监控：Micrometer `spring.security.oauth2.authorization.server` 指标；
- Vault/KMS 管理租户密钥；
- 定期轮换 `ClientSecret`，自动通知租户。

# 实战经验
- 构建多租户 SaaS 平台时，授权服务器部署为独立组件，客户端/令牌存储在 PostgreSQL；
- 对高安全租户启用 mTLS；
- 针对租户定制登录页，实现品牌化。

# 总结
Spring Security OAuth2.1 为构建授权服务器提供了基础。通过多租户设计、动态租户上下文与策略控制，可以满足 SaaS 场景的身份管理需求。

# 参考资料
- [1] Spring Authorization Server Reference. https://docs.spring.io/spring-authorization-server/docs/current/reference/html/
- [2] Spring Security Reference. https://docs.spring.io/spring-security/reference/
- [3] OAuth 2.1 BCP. https://datatracker.ietf.org/doc/draft-ietf-oauth-v2-1/
