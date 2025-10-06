---
title: Elasticsearch查询性能剖析与调优
date: 2024-03-15
lang: zh-CN
tags: ['#Database']
---

### 本文目录
<!-- toc -->

# 引言
> Elasticsearch 查询性能受索引设计、查询 DSL、资源配置影响。本文总结瓶颈分析方法与调优策略。

# 性能诊断
- 使用 `_profile` API 分析查询耗时；
- 查看 Hot Threads、Task API；
- 监控 `search.query_time_in_millis`；
- Kibana Stack Monitoring 观察节点性能。

# 调优手段
- 合理 mapping：字段类型、`keyword` vs `text`；
- Filter + Query：使用 `bool`，过滤条件放在 filter；
- 使用 `doc_values` 支持排序聚合；
- 控制分页：`search_after`、`scroll`；
- 缓存：`query_cache`, `request_cache`；
- 水平扩展：增加分片、副本。

# 资源配置
- JVM Heap 约占物理内存 50%，最大 32GB；
- 尽量使用 SSD；
- 控制 Shard 大小 20GB~50GB；
- 禁止长 GC，使用 G1 GC。

# 总结
通过查询分析、mapping 调整和资源优化，Elasticsearch 能保持稳定的查询性能。持续监控与压测是关键。

# 参考资料
- [1] Elastic Docs: Tune for Search Speed. https://www.elastic.co/guide/en/elasticsearch/reference/current/tune-for-search-speed.html
