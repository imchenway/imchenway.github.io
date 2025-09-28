---
title: RPC协议向后兼容策略
date: 2023-04-10
tags: ['#RPC']
---

### 本文目录
<!-- toc -->

# 引言
> RPC 协议的演进必须保证向后兼容，避免客户端与服务端版本不一致导致失败。本文总结 Protobuf、Thrift、Dubbo 等协议的兼容策略与版本管理。

# Protobuf 兼容
- 添加字段时使用新字段编号；
- 删除字段使用 `reserved`；
- 不要改变字段类型/标签；
- 使用 `oneof` 表示互斥字段；
- 对默认值保持一致。

# Dubbo 兼容策略
- 接口签名保持稳定；
- 使用版本号 `version=1.0.0`; 
- 在配置中心管理路由/灰度；
- 借助 `CompatibleSerialization`；
- 对新方法提供默认实现。

# REST/OpenAPI
- 遵循 SemVer；
- 添加新资源/字段，不删除；
- Deprecation Header 提醒客户端；
- 版本路径（`/v1`, `/v2`）。

# 测试与验证
- 合约测试（Pact）；
- Schema diff 工具；
- CI 中强制兼容检查；
- 在 Mesh Gateway 测试新协议与旧客户端兼容性。

# 总结
良好的协议管理与测试流程可确保 RPC 协议的演进不破坏旧客户端。统一的治理与监控使版本升级更安全。

# 参考资料
- [1] Protocol Buffers Language Guide. https://protobuf.dev
- [2] Dubbo 版本控制最佳实践.
