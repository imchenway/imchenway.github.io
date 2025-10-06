---
title: Service Mesh 弹性治理模式：重试、熔断、限流
date: 2019-07-26
lang: zh-CN
tags: ['#ServiceMesh', '#Resilience', '#Istio']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# Service Mesh 的优势
借助 Istio、Linkerd 等 Service Mesh，可以在侧车层实现弹性治理，无需修改应用代码。常见模式包括重试、熔断、超时、限流、故障注入。

# 关键配置示例（Istio）
```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: payment-api
spec:
  hosts:
    - payment
  http:
    - retries:
        attempts: 3
        perTryTimeout: 2s
        retryOn: gateway-error,connect-failure,refused-stream
      timeout: 5s
      fault:
        abort:
          percentage: { value: 1 }
          httpStatus: 500
      route:
        - destination:
            host: payment
```
- `DestinationRule` 可定义熔断、连接池与负载策略；
- `PeerAuthentication` 控制 mTLS；
- `RateLimit` 可通过 EnvoyFilter 或 Istio ExtensionProvider 实现。

# 监控与告警
- Prometheus 指标：`istio_requests_total`, `istio_request_duration_seconds`；
- Kiali 可视化拓扑与流量；
- 与 Jaeger/Zipkin 集成追踪流量路径。

# 最佳实践
- 明确失败预算与重试策略，避免放大流量；
- 结合应用层 Feature Flag 控制功能启停；
- 利用 `status.port=15020` 侧车探针监控 Envoy 状态；
- 通过混沌实验验证策略有效性。

# 自检清单
- 是否为关键路由配置超时、熔断与重试？
- 是否监控 Service Mesh 指标并设置异常告警？
- 是否将 Mesh 配置纳入 GitOps 管理与审计？

# 参考资料
- Istio 官方文档：https://istio.io/latest/docs/concepts/traffic-management/
- Envoy 速率限制：https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/rate_limit_filter
- Kiali 与可视化指南：https://kiali.io/documentation/latest/overview/
