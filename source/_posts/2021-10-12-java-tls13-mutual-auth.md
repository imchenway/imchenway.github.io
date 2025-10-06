---
title: Java TLS 1.3 双向认证实践
date: 2021-10-12
lang: zh-CN
tags: ['#Java', '#Security', '#TLS13']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 背景
TLS 1.3 带来握手优化与安全增强，设置双向认证时需注意证书链、会话恢复与兼容性问题。

# 配置步骤
- 使用 `KeyStore`/`TrustStore` 配置客户端证书与信任链；
- 启用 `jdk.tls.client.protocols=TLSv1.3` 与 `CipherSuite` 选择；
- 配置 `SSLParameters.setNeedClientAuth(true)` 强制双向校验。

# 运维要点
- 监控握手失败指标，识别证书过期或签名算法不支持；
- 对接入层开启 OCSP Stapling，减少验证延迟；
- 结合自动化流水线更新证书并触发滚动发布。

# 自检清单
- 是否验证所有客户端均支持 TLS 1.3？
- 是否配置证书过期告警与自动续期流程？
- 是否在性能测试中对比握手延迟？

# 参考资料
- Oracle TLS 1.3 官方指南：https://docs.oracle.com/en/java/javase/17/security/java-secure-socket-extension-jsse-reference-guide.html
- Java Secure Socket Extension (JSSE) 文档：https://docs.oracle.com/javase/8/docs/technotes/guides/security/jsse/JSSERefGuide.html
- RFC 8446: The Transport Layer Security (TLS) Protocol Version 1.3：https://datatracker.ietf.org/doc/html/rfc8446
