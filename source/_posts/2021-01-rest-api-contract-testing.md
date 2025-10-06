---
title: REST API 合同测试落地方案
date: 2021-01-26
lang: zh-CN
tags: ['#Testing', '#Contract', '#REST']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 合同测试价值
合同测试确保服务提供方与消费方对接口协议保持一致，减少集成阶段问题。适用于微服务环境中 API 频繁变更的场景。

# 实施路径
- 使用 Pact、Spring Cloud Contract 等工具；
- 生产者提供契约，消费者生成 Mock 验证；
- 在 CI 中对契约进行双向验证。

# Spring Cloud Contract 示例
1. 编写 contract DSL；
2. 生成 WireMock stubs；
3. 生产者运行自动生成的测试；
4. 消费者在集成测试中使用 stub 进行验证。

# 自检清单
- 是否将契约文件纳入版本库并使用版本控制？
- 是否在 CI 中自动验证并阻止不兼容变更？
- 是否与 API 文档工具（OpenAPI）保持同步？

# 参考资料
- Pact 文档：https://docs.pact.io/
- Spring Cloud Contract：https://spring.io/projects/spring-cloud-contract
- ThoughtWorks 技术雷达
