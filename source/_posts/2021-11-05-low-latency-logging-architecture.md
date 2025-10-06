---
title: 低延迟日志系统架构设计
date: 2021-11-05
lang: zh-CN
tags: ['#Logging', '#LowLatency', '#Architecture']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 背景
交易类系统需要毫秒级日志写入能力，要求日志系统具备高吞吐、低延迟与弹性扩容能力。

# 架构设计
- 使用异步日志框架（Log4j2 AsyncAppender 或 Logback Async）；
- 引入零拷贝传输，将日志推送至 Kafka/Elastic；
- 对敏感日志进行脱敏与分级存储。

# 运维要点
- 建立写入队列水位监控，及时扩容；
- 提供批量重放与回溯能力；
- 配置冷热存储策略，优化成本。

# 自检清单
- 是否验证日志队列在峰值时的可用性？
- 是否在安全评审中确认脱敏规则？
- 是否测试日志失效场景下的降级方案？

# 参考资料
- Log4j2 Async Loggers 指南：https://logging.apache.org/log4j/2.x/manual/async.html
- Logback AsyncAppender 文档：http://logback.qos.ch/manual/appenders.html#AsyncAppender
- Elasticsearch 索引引入文档：https://www.elastic.co/guide/en/elasticsearch/reference/current/index-modules.html
