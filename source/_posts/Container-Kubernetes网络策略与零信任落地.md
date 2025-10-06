---
title: Kubernetes 网络策略与零信任落地
date: 2024-10-01
lang: zh-CN
tags: ['#Container']
---

### 本文目录
<!-- toc -->

# 引言
> 零信任理念要求“永不信任、持续验证”。Kubernetes NetworkPolicy 结合服务网格、身份认证实现微分段。本文分享网络策略配置与零信任实践。

# 网络策略基础
- NameSpace 级别隔离；
- Pod Selector + Ingress/Egress 规则；
- 支持 L3/L4 控制；
- 需要 CNI（Calico、Cilium）支持。

# 零信任实现步骤
1. 默认拒绝：为命名空间创建 deny-all 策略；
2. 白名单：按服务通信需求编写策略；
3. 身份验证：结合 SPIFFE/SPIRE 颁发身份；
4. 加密：启用 mTLS；
5. 持续监控：记录流量、异常告警。

# 策略示例
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-api
  namespace: prod
spec:
  podSelector:
    matchLabels:
      app: api
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              env: prod
          podSelector:
            matchLabels:
              role: gateway
      ports:
        - protocol: TCP
          port: 8080
```

# 与 Service Mesh 协同
- Mesh 提供 L7 策略（RBAC、AuthzPolicy）；
- NetworkPolicy 负责 L3/L4 基线；
- 通过 Istio AuthorizationPolicy 实现属性级控制。

# 监控与审计
- Cilium Hubble 或 Calico Flow Visualizer；
- Audit 流量日志，检查违反策略事件；
- 定期回顾策略与业务变化；
- 自动化测试策略生效（Network Policy Tester）。

# 总结
Kubernetes 网络策略是零信任基础。结合身份认证、服务网格与监控，可在集群内实现精细化访问控制。

# 参考资料
- [1] Kubernetes Network Policy Concepts. https://kubernetes.io/docs/concepts/services-networking/network-policies/
- [2] Zero Trust Architecture (NIST SP 800-207).
