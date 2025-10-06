---
title: 一致性哈希算法架构设计要点
date: 2021-06-19
lang: zh-CN
tags: ['#Algorithms', '#Distributed', '#Hashing']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 背景
分布式缓存与网关经常使用一致性哈希，需兼顾节点扩缩容、跨地域容灾与热点均衡。

# 设计要点
- 采用虚拟节点 + 可配置权重，平衡节点容量差异；
- 引入 CRC32 + Murmur 混合哈希，提升分布均匀性；
- 对跨机房场景增加分区标签，避免跨区流量飘移；
- 提供冗余映射缓存与版本号，简化客户端更新。

# 运维与监控
- 暴露命中率、再平衡次数与节点负载指标；
- 结合一致性校验任务，检查映射表差异；
- 对热点 Key 引入旁路缓存与自动分片策略。

# 自检清单
- 是否定义节点权重与业务容量的映射逻辑？
- 是否提供再平衡期间的请求保护机制？
- 是否对一致性哈希表版本进行灰度发布？

# 参考资料
- Ketama 一致性哈希论文：http://antirez.com/m/webdis/webdis.pdf
- Amazon Dynamo 论文：https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf
- Hashicorp Consistent Hashing 说明：https://www.consul.io/docs/architecture/consensus
