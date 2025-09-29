---
title: 数据库 TLS 证书轮换与混沌演练
date: 2021-03-26
tags: ['#Database', '#ChaosEngineering', '#Security']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 证书轮换挑战
数据库 TLS 证书过期会导致业务中断。通过混沌演练模拟证书轮换过程，可以验证应用是否支持新证书、是否具备自动刷新能力。

# 演练步骤
1. 准备即将过期与更新后的证书；
2. 在影子环境切换数据库端证书；
3. 观察连接池是否自动重连，业务是否正常；
4. 在生产执行滚动替换，并监控连接错误率。

# 自检清单
- 是否在客户端配置证书刷新逻辑（如 HikariCP `VALIDATION_TIMEOUT`）？
- 是否有自动化脚本检查证书有效期并提醒？
- 是否建立证书轮换 Runbook 与回退方案？

# 参考资料
- PostgreSQL TLS 配置：https://www.postgresql.org/docs/current/libpq-ssl.html
- MySQL SSL 指南：https://dev.mysql.com/doc/refman/8.0/en/using-ssl-connections.html
- Google SRE SSL 轮换经验
