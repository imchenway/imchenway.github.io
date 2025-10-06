---
title: Spring Security OAuth2 资源服务器实践
date: 2018-06-26
lang: zh-CN
tags: ['#Spring', '#Security']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 架构
资源服务器负责验证访问令牌并保护 REST API。常见组合：Spring Boot + Spring Security OAuth2 + 授权服务器（Keycloak、Auth0、自建）。

# 快速配置
```java
@EnableWebSecurity
public class ResourceServerConfig {
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/health", "/public/**").permitAll()
                .anyRequest().authenticated())
            .oauth2ResourceServer(oauth2 -> oauth2.jwt());
        return http.build();
    }

    @Bean
    JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withJwkSetUri("https://auth.example.com/.well-known/jwks.json").build();
    }
}
```
- 在 `application.yml` 配置 `spring.security.oauth2.resourceserver.jwt.jwk-set-uri`。

# 自定义鉴权
- `JwtAuthenticationConverter` 解析自定义角色；
- `@PreAuthorize("hasAuthority('SCOPE_read')")` 控制方法级权限；
- 结合 `MethodSecurityExpressionHandler` 扩展业务逻辑。

# Token 与缓存
- 支持 JWT 或 Opaque Token；
- 对 Opaque Token 建议使用 Token Introspection + 缓存；
- JWT 需定期轮替密钥与处理失效策略。

# Observability
- 暴露认证失败、权限拒绝日志；
- 指标：认证成功率、令牌校验耗时；
- 与 Micrometer + Prometheus 集成，监控安全事件。

# 自检清单
- 是否正确配置 JWK/JWT Decoder 并验证签名？
- 是否按最小权限原则设计 scope/authority？
- 是否处理令牌过期、撤销策略与密钥轮换？

# 参考资料
- Spring Security 官方文档：https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/index.html
- RFC 6750 Bearer Token Usage：https://www.rfc-editor.org/rfc/rfc6750
- Keycloak 文档：https://www.keycloak.org/documentation
