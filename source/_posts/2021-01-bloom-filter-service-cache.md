---
title: 布隆过滤器在服务端缓存中的实践
date: 2021-01-19
tags: ['#Algorithm', '#Cache', '#BloomFilter']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 使用场景
布隆过滤器可快速判断 key 是否存在于缓存/存储，降低缓存穿透与无效请求。适合用户信息、商品库存等热数据。

# 构建方法
- 使用 Guava、Caffeine 自带 `BloomFilter`; 
- Redis `BF.ADD` / `BF.EXISTS`（RedisBloom 模块）；
- 自研实现：选取合适的 bit 数与哈希函数数目。

# 参数选择
- 误判率 p，与元素数量 n；
- bit 数 m = n * ln p / (ln2)^2；
- 哈希数量 k = (m/n) * ln2；
- 可使用 `BloomFilter.create(Funnels.stringFunnel(), expectedInsertions, fpp);`。

# 实践注意
- 误判会导致缓存命中但数据不在 DB，需设置兜底；
- 队列同步：对于新增数据需及时更新过滤器；
- 大规模场景建议基于 RedisBloom + 定期重建。

# 自检清单
- 是否根据数据规模定期重新构建过滤器？
- 是否记录误判样例并调整参数？
- 是否在多集群部署时保证过滤器一致性？

# 参考资料
- Bloom Filter Wikipedia：https://en.wikipedia.org/wiki/Bloom_filter
- RedisBloom 文档：https://redis.io/docs/interact/data-structures/probabilistic/bloom-filter/
- Google Guava BloomFilter 指南
