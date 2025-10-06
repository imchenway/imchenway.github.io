---
title: Java 服务故障复盘模板：指标、日志与流程
date: 2018-05-26
lang: zh-CN
tags: ['#Java', '#Postmortem']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 为何需要标准化复盘
故障复盘有助于总结经验、改进系统韧性、减少重复事故。标准化流程包括故障记录、数据收集、根因分析、改进计划与跟踪。

# 复盘模板要素
1. **事件概述**：时间、影响范围、报警触发。
2. **时间线**：从发现、响应、缓解到恢复的关键节点。
3. **影响评估**：请求量、错误率、用户影响、业务损失。
4. **监控与日志**：GC、线程池、接口延迟、数据库表现。
5. **根因分析**：代码缺陷、配置错误、依赖故障、容量不足。
6. **短期措施**：临时修复、限流、回滚。
7. **长期改进**：架构优化、监控补充、演练计划。

# 数据收集要点
- APM 指标：吞吐、错误率、GC、线程池、数据库；
- 日志聚合：异常堆栈、慢日志、审计事件；
- 线程/堆 dump：定位资源瓶颈；
- 变更记录：部署、配置、外部事件。

# 工具推荐
- Prometheus + Grafana、Elastic Stack；
- JFR/Async-profiler 捕获性能数据；
- Confluence/Google Docs 模板记录复盘；
- Issue Tracker 跟踪整改任务。

# 自检清单
- 是否记录完整时间线与影响数据？
- 是否分析并验证根因而非停留在表象？
- 是否明确改进项的责任人与截止时间？

# 参考资料
- Google SRE Postmortem 模板：https://sre.google/workbook/incident-response/  
- Oracle Troubleshooting Guide：https://docs.oracle.com/en/java/javase/17/troubleshoot/troubleshooting-guide.pdf
- “Postmortem Templates” by GitLab：https://about.gitlab.com/handbook/engineering/incident-management/#post-incident-review
