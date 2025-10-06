---
title: Spring Cloud LoadBalancer 智能路由策略
date: 2021-08-26
lang: zh-CN
tags: ['#Spring', '#LoadBalancer', '#Resilience']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 背景
Spring Cloud 2020.x 引入新的 LoadBalancer 组件，需要配置权重、可观测性与熔断策略，替代 Ribbon。

# 策略设计
- 自定义 `RequestData` 与 `ServiceInstanceListSupplier`，实现标签路由；
- 结合 Resilience4j，设置重试、熔断与限流策略；
- 集成 Micrometer 输出成功率、响应时间与重试次数。

# 实施建议
- 在 Discovery Client 返回的实例上绑定权重与元数据；
- 使用 `RetryLoadBalancerInterceptor` 管控请求放大因子；
- 配置 `CachingServiceInstanceListSupplier` 减少注册中心压力。

# 自检清单
- 是否验证实例权重更新的实时性？
- 是否评估重试带来的流量放大与重入问题？
- 是否在压测中复盘熔断恢复策略？

# 参考资料
- Spring Cloud LoadBalancer 官方文档：https://docs.spring.io/spring-cloud-commons/docs/current/reference/html/#spring-cloud-loadbalancer
- Resilience4j 官方指南：https://resilience4j.readme.io/docs
- Spring Cloud 2020 Release Notes：https://spring.io/blog/2020/12/22/spring-cloud-2020-0-released
