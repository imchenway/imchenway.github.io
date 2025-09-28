---
title: 消息中间件的安全基线与访问控制
date: 2023-10-07
tags: ['#MQ']
---

### 本文目录
<!-- toc -->

# 引言
> 消息系统承载核心数据，安全配置至关重要。本文总结 Kafka、RabbitMQ、RocketMQ 的安全基线与访问控制实践。

# 身份认证
- Kafka：SASL/PLAIN、SCRAM、OAuth；
- RabbitMQ：用户名密码、LDAP、X.509；
- RocketMQ：AccessKey/SecretKey、STS；
- 配置 mTLS 确保传输安全。

# 授权模型
- Kafka ACL：`ResourceType`, `PatternType`, `PermissionType`；
- RabbitMQ VHost、Exchange/Queue 级权限；
- RocketMQ：Topic 级权限、白名单；
- 定期审核权限。

# 安全基线
- 加密存储：磁盘加密、密钥管理；
- 审计日志：登录、命令、管理操作；
- 防护：限流、防爆破；
- 版本更新与漏洞修补。

# 监控
- 未授权访问尝试次数；
- 证书过期提醒；
- 与 SIEM 集成分析威胁；
- 安全事件响应流程。

# 总结
消息系统安全需要覆盖认证、授权、传输与审计。建立统一的安全基线和监控体系，确保数据安全与合规。

# 参考资料
- [1] Kafka Security Documentation.
- [2] RabbitMQ Security Guide.
- [3] RocketMQ ACL 文档.
