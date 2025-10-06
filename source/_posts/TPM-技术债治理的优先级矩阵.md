---
title: 技术债治理的优先级矩阵与路线制定
date: 2025-03-10
lang: zh-CN
tags: ['#TPM']
---

### 本文目录
<!-- toc -->

# 引言
> 技术债不可避免，关键在于识别、量化与治理。本文介绍技术债优先级矩阵、治理路线与组织协同模式。

# 技术债分类
- 架构债：模块耦合、扩展性不足；
- 代码债：低质量、缺少测试；
- 工程债：流程、自动化不足；
- 可观测债：指标、日志、追踪缺失。

# 优先级矩阵
```mermaid
quadrantChart
    title 技术债优先级
    x-axis 治理收益
    y-axis 风险影响
    quadrant-1 高收益/高风险
    quadrant-2 高收益/低风险
    quadrant-3 低收益/高风险
    quadrant-4 低收益/低风险
    A[核心交易架构重构] TOP RIGHT
    B[CI/CD 优化] TOP LEFT
    C[日志规范化] BOTTOM LEFT
    D[遗留功能边缘化] BOTTOM RIGHT
```

# 路线制定
1. 收集技术债（评审、排查）；
2. 使用矩阵评估优先级；
3. 制定治理路线图（Roadmap）；
4. 对接 OKR 或年度规划；
5. 建立治理指标与复盘机制。

# 治理机制
- 设立技术债委员会或架构委员会；
- 结合项目里程碑（预算 + 时间）；
- 借助技术雷达评估技术栈；
- 建立技术债台账和执行报告。

# 总结
技术债治理需要系统化评估与持续投入。通过优先级矩阵、路线图与跨团队协同，可以在业务发展中兼顾长期健康。

# 参考资料
- [1] ThoughtWorks Technology Radar.
- [2] Martin Fowler: Technical Debt Quadrant.
