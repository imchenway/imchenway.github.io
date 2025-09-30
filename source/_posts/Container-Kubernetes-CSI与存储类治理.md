---
title: Kubernetes CSI 与存储类治理
date: 2024-10-31
tags: ['#Container']
---

### 本文目录
<!-- toc -->

# 引言
> Container Storage Interface (CSI) 标准化了存储插件。本文介绍 CSI 架构、StorageClass 策略与容量治理。

# CSI 架构
- CSI Driver：Controller + Node 插件；
- Provisioner、Attacher、Resizer、Snapshotter；
- Sidecar 组件通过 gRPC 调用；
- 支持动态卷、快照、扩容。

# StorageClass 策略
- 参数 (`parameters`) 定义存储特性（IOPS、AZ）；
- `allowVolumeExpansion` 控制扩容；
- `volumeBindingMode`：Immediate vs WaitForFirstConsumer；
- 多 StorageClass 满足不同工作负载。

# 治理实践
- 标准命名规则（gold/silver/bronze）；
- 自动化审批流程；
- 配额：ResourceQuota、LimitRange 控制 PVC；
- 监控存储使用，定期回收。

# 快照与备份
- VolumeSnapshot CRD；
- SnapshotClass 选择快照类型；
- Velero/Restic 集成异地备份；
- 保留策略与自动删除。

# 总结
CSI 提供云原生存储扩展能力。通过合理设计 StorageClass、容量治理与备份策略，可构建可靠的容器存储体系。

# 参考资料
- [1] Kubernetes CSI Docs. https://kubernetes-csi.github.io/docs/
- [2] Volume Snapshot Documentation. https://kubernetes.io/docs/concepts/storage/volume-snapshots/
