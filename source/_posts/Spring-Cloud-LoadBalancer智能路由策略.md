---
title: Spring Cloud LoadBalancer智能路由策略
date: 2022-03-26
lang: zh-CN
tags: ['#Spring']
---

### 本文目录
<!-- toc -->

# 引言
> Spring Cloud LoadBalancer 自 Hoxton 版本起逐步替代 Ribbon。它不仅提供轮询、随机等基础策略，也允许我们结合服务指标、权重、灰度规则实现智能路由。本文分享策略扩展和动态感知实践。

# 基础概念
- LoadBalancer 服务发现接口 `ServiceInstanceListSupplier`；
- 负载均衡策略接口 `ReactorServiceInstanceLoadBalancer`；
- 结合 Spring Cloud Discovery Client，如 Eureka、Consul、Nacos；
- 可与 Spring Retry、Resilience4j 联动。

# 自定义策略实现
```java
@Component
class WeightedLoadBalancer implements ReactorServiceInstanceLoadBalancer {
    private final ServiceInstanceListSupplier supplier;
    WeightedLoadBalancer(ServiceInstanceListSupplier supplier) {
        this.supplier = supplier;
    }
    @Override
    public Mono<Response<ServiceInstance>> choose(Request request) {
        return supplier.get().next().map(instances -> {
            ServiceInstance selected = pickByWeight(instances);
            return new DefaultResponse(selected);
        });
    }
}
```
- 权重可来自注册中心元数据、Prometheus 指标；
- 使用 `@LoadBalancerClients` 注册。

# 智能路由场景
1. **金丝雀发布**：在 `ServiceInstance` 的 metadata 中标记 `version=canary`，基于请求 Header 选择；
2. **流量倾斜**：结合业务优先级，将高价值请求指向高性能实例；
3. **多活就近**：根据 `X-Region` 或 Geo-IP，将用户路由至最近机房；
4. **混合云**：根据实例标签区分云厂商，控制跨云流量比例。

# 动态感知与健康检查
- 使用 `ReactiveDiscoveryClient` 定期刷新实例列表；
- 集成 Micrometer 注册指标，如实例响应时间；
- 结合 `Health Indicator`，过滤健康状态不佳的实例；
- 配合 `Spring Cloud CircuitBreaker`，对失败实例执行熔断隔离。

# 监控与可观测
- 将选择结果、权重写入 `TraceContext`，方便链路追踪；
- 暴露自定义指标：选择次数、失败率、平均响应；
- 借助 Sleuth/Zipkin 查看路由分布；
- 在调试阶段开启 `logging.level.org.springframework.cloud.loadbalancer=DEBUG`。

# 总结
Spring Cloud LoadBalancer 提供了灵活的扩展点。结合元数据、指标和熔断策略，可以构建动态、智能的流量路由体系，满足金丝雀、多活等场景需求。

# 参考资料
- [1] Spring Cloud LoadBalancer Reference. https://docs.spring.io/spring-cloud-commons/docs/current/reference/html/#spring-cloud-loadbalancer
- [2] Spring Cloud CircuitBreaker. https://docs.spring.io/spring-cloud-circuitbreaker/docs/current/reference/html/
- [3] Micrometer Metrics. https://micrometer.io/docs
