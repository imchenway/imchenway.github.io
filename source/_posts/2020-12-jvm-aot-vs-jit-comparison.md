---
title: AOT 与 JIT 在生产环境的取舍
date: 2020-12-12
lang: zh-CN
tags: ['#JVM', '#AOT', '#JIT']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# AOT 与 JIT 各自优势
- **JIT**：运行时优化、适应真实负载、可在 HotSpot/Graal 中动态调整；
- **AOT**（Ahead-of-Time）：启动快、内存占用低、适合短周期任务或函数计算。

# 对比维度
| 维度 | JIT | AOT (GraalVM Native Image) |
|---|---|---|
| 启动时间 | 较慢，取决于预热 | 毫秒级 |
| 吞吐 | 高，动态优化 | 取决于静态优化，可能低于 JIT |
| 资源占用 | 较高（Code Cache、JIT 线程） | 较低 |
| 功能兼容 | 完整 Java 平台 | 需处理反射、动态类加载 |

# 决策流程
1. 分析应用形态：长时间运行 vs 短命；
2. 构建原型：对关键场景运行基准测试；
3. 权衡维护成本（配置、监控、调试）；
4. 可能的混合方案：使用 JIT + CDS、或将部分服务转为 Native。

# 自检清单
- 是否评估 JIT 预热对 SLA 的影响？
- 是否为 Native 版本建立与 JVM 版本同样的监控链路？
- 是否记录对比数据并定期复审？

# 参考资料
- JEP 295: Ahead-of-Time Compilation：https://openjdk.org/jeps/295
- GraalVM Native Image 文档：https://www.graalvm.org/native-image/
- 《Java Performance》一书中 AOT vs JIT 分析
