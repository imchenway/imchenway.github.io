---
title: JVM 远程诊断安全加固策略
date: 2020-01-12
tags: ['#JVM', '#Security', '#Monitoring']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 风险概述
JMX、JFR、远程调试等诊断接口若未加固，容易成为攻击入口。常见风险包括未授权访问堆/线程信息、远程执行 MBean 操作、利用 JDWP 注入代码。因此在生产环境必须实施最小暴露面与加密认证策略。

# 加固 Checklist
- **JMX**：
  - 开启 SSL：`com.sun.management.jmxremote.ssl=true`、`...ssl.need.client.auth=true`。
  - 使用基于文件的访问控制：`jmxremote.access`, `jmxremote.password`。
  - 通过防火墙或 Sidecar 代理限制来源 IP。
- **JDWP 调试**：默认禁用；如需临时启用，务必使用 `--listen` 绑定内网地址并搭配 SSH 隧道，调试完成立即关闭。
- **JFR 远程流**：
  - 利用 JDK Mission Control 的安全通道；
  - 通过 `jcmd` 在目标机器本地触发采样再安全传输。
- **诊断命令 `jcmd`**：仅通过 SSH 登录的运维账号执行，结合 `sudo` 控制白名单。

# 监控与审计
- 在日志系统中收集 `jmxremote.access` 登录记录，异常尝试触发告警；
- 使用 `auditd`/CloudTrail 跟踪 `jcmd`, `jmap`, `jstack` 调用；
- 定期轮换 JMX 密码文件，确保最小权限原则。

# 自检清单
- 是否禁止 JDWP 在生产环境常驻？
- 是否为 JMX/诊断端口配置认证、加密与网络 ACL？
- 是否建立诊断操作审批与审计流程？

# 参考资料
- JMX Remote Monitoring 文档：https://docs.oracle.com/javase/10/management/monitoring-and-management-using-jmx-technology.htm
- JDWP 选项说明：https://docs.oracle.com/javase/10/docs/specs/jpda/conninvokation.html
- JDK Flight Recorder 安全建议：https://docs.oracle.com/javacomponents/jmc-8/jfr-runtime-guide/secure-recording.htm
