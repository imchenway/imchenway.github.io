---
title: Service Mesh 流量影子测试实践
date: 2020-06-26
lang: zh-CN
tags: ['#ServiceMesh', '#Testing', '#DevOps']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 流量影子测试的目标
流量影子测试通过复制线上真实请求到影子环境，验证新版本或新架构。Service Mesh（如 Istio）可以方便地将流量复制到影子服务并隔离回写，保证生产安全。

# 实施方案
- 使用 Istio `VirtualService` 的 `mirror` 功能：
```yaml
http:
  - route:
      - destination: { host: payment }
    mirror:
      host: payment-shadow
    mirrorPercentage: { value: 10 }
```
- 在影子服务禁用外部写入，通过 Mock 或写入沙箱库。
- 使用标记头部/Trace ID 区分影子请求。

# 数据对比
- 使用数据校验脚本对比主流量与影子流量处理结果；
- 聚合日志（ELK）比对错误率；
- 对关键信息脱敏，遵守合规要求。

# 自检清单
- 是否确保影子服务不会回写真实数据库？
- 是否在测试结束后关闭 mirror 配置，避免资源浪费？
- 是否汇总影子环境指标用于发布决策？

# 参考资料
- Istio 流量镜像：https://istio.io/latest/docs/tasks/traffic-management/mirroring/
- CNCF Service Mesh 实践案例
- 混沌工程与影子流量结合的最佳实践
