---
title: Kubernetes HPA 与 VPA 联合弹性策略
date: 2020-11-19
tags: ['#Kubernetes', '#Autoscaling', '#DevOps']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 动态扩缩容挑战
单独使用 HPA（Horizontal Pod Autoscaler）或 VPA（Vertical Pod Autoscaler）难以适应复杂负载。将 HPA + VPA 结合，可以同时调整实例数量与单实例资源，但需防止互相干扰。

# 方案
- 使用 VPA「推荐模式」生成 CPU/内存建议，结合 HPA 指标手动调整；
- 云平台提供的 HPA/VPA 联动（如阿里云 AHPA）；
- 自研控制器：定时读取 VPA 推荐值，更新 HPA 目标；
- 关键指标：请求延迟、CPU/内存利用率、错误率。

# 配置示例
```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
spec:
  updatePolicy:
    updateMode: "Off" # 推荐模式
  resourcePolicy:
    containerPolicies:
      - containerName: app
        minAllowed:
          cpu: "100m"
          memory: "256Mi"
```

# 自检清单
- 是否防止 VPA 直接修改 Deployment（建议 Off 模式）？
- 是否保证 HPA 指标准确（自定义指标需要 Prometheus Adapter）？
- 是否记录扩缩容事件并与业务指标对照？

# 参考资料
- Kubernetes Autoscaling：https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/
- VPA 项目：https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler
- 阿里云/谷歌云 AHPA 白皮书
