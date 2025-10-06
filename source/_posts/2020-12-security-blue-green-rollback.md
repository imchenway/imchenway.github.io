---
title: 安全驱动的蓝绿回滚策略
date: 2020-12-26
lang: zh-CN
tags: ['#Security', '#DevOps', '#Release']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 背景
安全漏洞披露后需要快速回滚到安全版本。蓝绿部署天生具备快速切换能力，但需要结合安全扫描、漏洞检测实现自动化回滚。

# 策略
- 在 Blue 环境执行安全扫描（SCA、SAST、DAST）；
- Green 环境上线后开启实时漏洞监控（OSS Index、Dependabot）；
- 当检测到高危漏洞时自动切回 Blue 并触发修复流程；
- 保证 Blue 环境依旧接受安全补丁与数据同步。

# 自检清单
- 是否为 Blue 环境配置安全更新与访问限制？
- 是否在切换脚本中包含审计记录？
- 是否与应急预案和安全团队联动？

# 参考资料
- OWASP DevSecOps 指南：https://owasp.org/www-project-devsecops-guideline/
- Google SRE Incident Response：https://sre.google/workbook/incident-response/
- GitHub Dependabot 文档：https://docs.github.com/en/code-security/dependabot
