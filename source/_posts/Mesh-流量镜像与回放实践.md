---
title: Mesh流量镜像与回放实践
date: 2023-01-10
tags: ['#ServiceMesh']
---

### 本文目录
<!-- toc -->

# 引言
> 流量镜像与回放是稳定性保障手段，可用于灰度验证、故障演练。Service Mesh 提供透明的流量复制能力。本文以 Istio 为例，介绍镜像配置与回放策略。

# 流量镜像
```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
spec:
  hosts:
    - api.example.com
  http:
    - route:
        - destination:
            host: service
            subset: v1
      mirror:
        host: service
        subset: shadow
      mirrorPercentage:
        value: 10
```
- 将 10% 流量镜像到 shadow 服务；
- 不影响主流程响应；
- Shadow 服务需隔离数据写入。

# 回放策略
- 采集真实请求（日志、消息队列）；
- 清洗、脱敏；
- 在测试环境或 Shadow 服务回放；
- 对比响应，发现差异。

# 注意事项
- 数据隔离：防止写入生产数据库；
- 时间差异：使用 Mock 时间或时间偏移；
- 日志关联：保留 traceId；
- 监控：记录 shadow 服务指标。

# 实战经验
- 灰度发布前回放高风险 API；
- 故障复现：抓取错误请求回放分析；
- 结合 Chaos 工具制造异常场景；
- 对高价值服务启用长期镜像监控。

# 总结
流量镜像与回放是 Mesh 提供的强大能力。通过合理配置与数据治理，可以在不影响线上用户的情况下验证新版本或定位问题。

# 参考资料
- [1] Istio Traffic Management. https://istio.io/latest/docs/tasks/traffic-management/mirroring/
- [2] Envoy Traffic Shadowing. https://www.envoyproxy.io/docs/
- [3] Chaos Engineering 相关资料.
