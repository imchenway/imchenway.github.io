---
title: Spring Data R2DBC 踩坑与优化手记
date: 2020-10-12
tags: ['#Spring', '#R2DBC', '#Reactive']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 常见问题
- R2DBC 驱动不支持 JPA 风格懒加载；
- 连接池、事务语义与阻塞 JDBC 不同；
- 批量操作和分页需要额外实现。

# 解决方案
- 选择成熟驱动（PostgreSQL、MySQL 官方 R2DBC）；
- 使用 `ConnectionFactoryOptions` 配置连接池（`maxSize`、`validationQuery`）；
- 通过 `DatabaseClient` 或自定义 Repository 执行复杂 SQL；
- 使用 Reactor `Context` 维护事务：`@Transactional` 在 R2DBC 中依赖 `R2dbcTransactionManager`。

# 性能调优
- 对高频查询使用缓存或 Materialized View；
- 监控 `r2dbc.connection.creation` 与 `reactor.netty.tcp.client.connections`; 
- 结合 Micrometer + Prometheus 观察响应时间。

# 自检清单
- 是否评估 R2DBC 对事务与批量写入的限制？
- 是否在业务代码中避免阻塞调用（`block()`）？
- 是否建立连接池监控与告警？

# 参考资料
- Spring Data R2DBC 文档：https://docs.spring.io/spring-data/r2dbc/docs/current/reference/html/
- R2DBC SPI：https://r2dbc.io/spec/0.9.0.RELEASE/spec/html/
- Reactor 官方文档：https://projectreactor.io/docs/core/release/reference/
