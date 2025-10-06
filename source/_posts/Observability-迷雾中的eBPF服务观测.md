---
title: eBPF在服务观测中的应用
date: 2023-03-31
lang: zh-CN
tags: ['#ServiceMesh']
---

### 本文目录
<!-- toc -->

# 引言
> eBPF 能在内核态运行自定义程序，为服务观测提供新的视角。Service Mesh 可以结合 eBPF 收集网络、系统指标，弥补 Sidecar 可观测性盲点。

# eBPF 基础
- 内核沙箱运行，安全高效；
- 使用 BCC、bpftrace 或 Cilium 工具链；
- 钩子：网络、系统调用、调度。

# 观测场景
- 网络延迟、包丢失；
- TCP 连接建立、重传；
- 应用延迟归因（CPU、I/O）；
- 安全审计。

# 与 Mesh 协同
- 结合 Cilium Service Mesh，提供 L3/L4/L7 能力；
- 在 Envoy Sidecar 无法捕获的层面提供补充；
- 将 eBPF 采集的数据纳入 Prometheus/Grafana；
- 与 OTel Collector 集成，提供统一观测数据。

# 实战经验
- 使用 Cilium Hubble 可视化服务拓扑；
- 在故障场景中，通过 eBPF 快速定位内核级瓶颈；
- 安全集成：检测异常连接、端口扫描。

# 总结
eBPF 与 Service Mesh 的结合，加强了深度观测能力。通过统一的指标与日志，提升故障定位效率。

# 参考资料
- [1] Cilium Documentation. https://docs.cilium.io
- [2] BCC Tools. https://github.com/iovisor/bcc
- [3] OpenTelemetry Collector.
