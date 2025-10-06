---
title: StatefulSet 管理数据库的最佳实践
date: 2024-10-21
lang: zh-CN
tags: ['#Container']
---

### 本文目录
<!-- toc -->

# 引言
> StatefulSet 适合部署有状态服务，如数据库、消息系统。本文探讨使用 StatefulSet 管理数据库的策略：持久化、扩缩容、故障恢复与备份。

# StatefulSet 特性
- 稳定网络标识（pod-0、pod-1）；
- 有序部署、滚动更新；
- 结合 PersistentVolumeClaim；
- 需配合 Headless Service 访问。

# 部署策略
- Provisioner：StorageClass, CSI；
- PodAntiAffinity 防止同一节点；
- InitContainer 初始化数据库；
- 设置 `podManagementPolicy=Parallel` 加快重建。

# 备份与恢复
- 使用 VolumeSnapshot、Velero；
- 逻辑备份（mysqldump、pg_dump）Sidecar；
- 备份后上传对象存储；
- 灾难恢复演练。

# 升级与扩缩
- 滚动更新前进行健康检查；
- 扩容时自定义脚本重平衡；
- 与 Operators（Percona Operator, CrunchyData）结合自动化。

# 监控
- Exporter (mysqld_exporter, postgres_exporter)；
- PVC 使用率、IOPS；
- Pod 重启次数、探针状态；
- Alertmanager 通知。

# 总结
StatefulSet 为数据库提供稳定运行环境。配合存储、备份、监控与 Operator，可实现高可用的数据库容器化方案。

# 参考资料
- [1] Kubernetes StatefulSet Concepts. https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/
- [2] CNCF Database on Kubernetes Whitepaper.
