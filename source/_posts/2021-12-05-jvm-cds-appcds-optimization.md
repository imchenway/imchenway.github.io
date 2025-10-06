---
title: JVM CDS 与 AppCDS 冷启动优化
date: 2021-12-05
lang: zh-CN
tags: ['#JVM', '#CDS', '#Startup']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 背景
企业级服务需要缩短冷启动时间，CDS/AppCDS 可复用类元数据，提高启动速度并降低内存消耗。

# 实施流程
- 使用 `-Xshare:dump` 生成默认类共享档案；
- 借助 `AppCDS` 为应用自定义共享档案，纳入第三方依赖；
- 在容器环境加载档案，结合 Init 容器预热。

# 监控与验证
- 对比 `jcmd VM.classloaders` 统计命中率；
- 监控 `ProcessStartTime`, `RSS` 指标评估收益；
- 在 CI 中自动生成并校验档案签名与版本。

# 自检清单
- 是否确保生产与生成档案的 JDK 版本一致？
- 是否在回滚时提供无 CDS 的启动脚本？
- 是否验证安全策略与自定义类加载器兼容？

# 参考资料
- Java Class Data Sharing 官方指南：https://docs.oracle.com/javase/17/core/cds.htm
- AppCDS 使用说明：https://docs.oracle.com/javase/8/docs/technotes/guides/vm/appcds.html
- OpenJDK CDS 文档：https://wiki.openjdk.org/display/HotSpot/CDS
