---
title: 虚拟线程的结构化测试策略
date: 2021-05-05
lang: zh-CN
tags: ['#Java', '#Loom', '#Testing']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 测试挑战
虚拟线程带来海量并发，传统线程测试用例难以覆盖。需要针对结构化并发、Pinning、资源释放进行测试。

# 策略
- 使用 `StructuredTaskScope` 编写单元测试验证异常传播；
- 模拟 Pinning 场景并验证监控是否捕获；
- 在压力测试中统计虚拟线程创建/销毁次数；
- 使用 JFR 断言虚拟线程事件数量。

# 自检清单
- 是否在测试环境启用 `--enable-preview`？
- 是否通过 JFR/日志验证 Pinning 告警？
- 是否清理资源避免虚拟线程泄漏？

# 参考资料
- Project Loom 测试最佳实践
- JEP 425 文档
- JUnit + Loom 示例仓库
