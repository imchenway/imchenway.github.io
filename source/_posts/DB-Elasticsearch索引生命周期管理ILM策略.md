---
title: Elasticsearch索引生命周期管理与ILM策略
date: 2024-03-05
tags: ['#Database']
---

### 本文目录
<!-- toc -->

# 引言
> Elasticsearch Index Lifecycle Management (ILM) 支持索引的热、温、冷、删除多阶段管控。本文介绍 ILM 策略配置、资源优化与实战经验。

# ILM 阶段
- Hot：写入活跃数据；
- Warm：降低副本数、转移至冷存储；
- Cold：只读，可能冻结；
- Delete：删除或快照后删除。

# 配置示例
```json
{
  "policy": {
    "phases": {
      "hot": {
        "actions": {
          "rollover": { "max_size": "50gb", "max_age": "7d" }
        }
      },
      "warm": {
        "min_age": "7d",
        "actions": {
          "shrink": { "number_of_shards": 1 },
          "forcemerge": { "max_num_segments": 1 }
        }
      },
      "delete": {
        "min_age": "30d",
        "actions": { "delete": {} }
      }
    }
  }
}
```

# 实践要点
- 结合 Rollover 索引模式 `logs-%{+yyyy.MM.dd}`；
- 使用 `Index Templates` 自动应用策略；
- 监控热节点 CPU、磁盘；
- 对日志场景结合 Elasticsearch Snapshot 保存历史。

# 总结
ILM 是 Elasticsearch 数据生命周期管理的关键工具。通过分阶段策略与监控，可降低成本并保持查询性能。

# 参考资料
- [1] Elastic Docs: Index Lifecycle Management. https://www.elastic.co/guide/en/elasticsearch/reference/current/index-lifecycle-management.html
