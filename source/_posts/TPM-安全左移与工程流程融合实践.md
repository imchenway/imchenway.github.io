---
title: 安全左移与工程流程融合实践
date: 2025-05-09
lang: zh-CN
tags: ['#TPM']
---
### 本文目录
<!-- toc -->

# 引言
> 安全左移（Shift-Left Security）要求在开发早期融入安全，避免上线后补救。本文总结安全左移的流程、工具与组织协作模式。

# 安全左移的要素
- 以威胁建模、设计评审为起点；
- 在 CI/CD 中嵌入 SAST、DAST、SCA；
- 构建安全基线、策略与安全测试数据；
- 建立红蓝对抗、攻防演练。

# 流程融合
1. 需求阶段：安全需求与威胁建模；
2. 开发阶段：代码安全扫描、依赖检查；
3. 测试阶段：安全测试与漏洞管理；
4. 部署阶段：基础设施安全、准入控制；
5. 运行阶段：监控与漏洞响应。

# 工具链
- SAST：SonarQube, Fortify；
- SCA：Dependabot, Snyk；
- DAST：OWASP ZAP；
- IaC 安全：Checkov, tfsec；
- 安全平台：DevSecOps Dashboard。

# 协作机制
- 设立安全负责人（Security Champion）；
- 安全与工程团队共同制定标准；
- 建立漏洞响应 SLA；
- 安全指标纳入 OKR。

# 总结
安全左移需要流程、工具与组织协同。将安全检查融入开发生命周期，并通过培训与文化建设提升意识，才能实现持续的安全保障。

# 参考资料
- [1] OWASP DevSecOps Maturity Model.
- [2] NIST Secure Software Development Framework (SSDF).
