---
title: 边缘计算下的 K3s/AKS Edge 部署实践
date: 2025-01-29
lang: zh-CN
tags: ['#Container']
---

### 本文目录
<!-- toc -->

# 引言
> 边缘场景要求轻量、可靠的 Kubernetes。K3s、AKS Edge Essentials、EKS Anywhere Edge 提供方案。本文讨论架构、资源限制与设备管理。

# 轻量发行版
- K3s：单二进制、内置 SQLite/etcd、适配 ARM；
- AKS Edge：Windows/Linux 混合，支持离线更新；
- MicroK8s、k0s 等其他选择。

# 架构与部署
- 集群拓扑：边缘节点 + 中心控制面；
- K3s Server+Agent 模式或全独立集群；
- 离线镜像、空口升级；
- Device Plugin 管理硬件（GPU、TPU）。

# 运维挑战
- 网络不稳定：使用 MQTT、LoRaWAN 辅助；
- 安全：加密传输、硬件可信根；
- 监控：边缘 Prometheus Agent 汇聚；
- OTA 更新：Fleet、Rancher Fleet 管理。

# 应用场景
- 零售门店、工业 IoT、车载系统；
- 需要低延迟与本地自治；
- 中心运维统一策略。

# 总结
边缘 Kubernetes 强调轻量、离线能力与安全管控。K3s/AKS Edge 提供成熟方案，结合 GitOps 与远程管理可实现规模化部署。

# 参考资料
- [1] K3s Documentation. https://docs.k3s.io/
- [2] AKS Edge Essentials. https://learn.microsoft.com/azure/aks/hybrid/
