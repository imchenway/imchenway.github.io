---
title: Kubernetes 成本优化与资源回收策略
date: 2025-02-08
lang: zh-CN
tags: ['#Container']
---

### 本文目录
<!-- toc -->

# 引言
> 随着集群规模增长，成本控制成为重要议题。本文总结节点与 Pod 层的成本优化、资源回收与监控策略。

# 成本驱动因素
- 节点实例费用（计算、GPU）；
- 存储与网络；
- 空闲资源（资源碎片）；
- 过期镜像与无用对象。

# 优化策略
- 自动扩缩容（Cluster Autoscaler、Karpenter）；
- Spot/Preemptible 混合；
- Pod requests/limits 调优；
- 清理未使用的 PVC、ConfigMap；
- 节点池按工作负载分类。

# 成本监控
- Kubecost、OpenCost；
- 标签/注释标记成本归属；
- 监控闲置资源率；
- 结合 FinOps 流程。

# 资源回收
- 定期执行 `kubectl get pvc --all-namespaces` 清理；
- 生命周期管理（TTL Controller）；
- 镜像垃圾回收（kubelet + registry）；
- 任务容器（Job/CronJob）清理。

# 总结
通过自动化扩缩容、资源精细化与成本监控，可显著降低 Kubernetes 运维开销，确保资源高效使用。

# 参考资料
- [1] OpenCost. https://www.opencost.io/
- [2] Karpenter Documentation. https://karpenter.sh/
