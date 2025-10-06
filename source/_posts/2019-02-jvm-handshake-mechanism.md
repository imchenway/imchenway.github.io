---
title: JVM Thread-Local Handshakes 机制解析
date: 2019-02-12
lang: zh-CN
tags: ['#JVM', '#Safepoint']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 背景
JEP 312 引入 Thread-Local Handshakes (TLH)，允许针对单个线程执行回调，无需将所有线程带到 Safepoint。该机制降低了全局 Safepoint 的频率，提升延迟敏感应用性能。

# 工作原理
- JVM 可向特定线程发送 handshake 请求；
- 目标线程在安全点或执行 poll 时执行回调；
- 完成后仅该线程暂停或执行操作，不影响其他线程；
- 用于偏向锁撤销、栈遍历、指针修复等轻量操作。

# 配套参数
- `-XX:+UnlockDiagnosticVMOptions -XX:+HandshakeALot`：测试环境强制 handshake；
- 日志：`-Xlog:handshake=debug` 查看 handshake 活动；
- 与 safepoint 日志结合分析 VM 操作影响。

# 实战场景
- 偏向锁撤销：无需停止所有线程；
- 线程栈信息收集：目标线程执行回调收集数据；
- 更细粒度的暂停机制，减少延迟尖峰。

# 自检清单
- 是否开启 handshake 日志验证特定操作效果？
- 是否评估 TLH 对延迟优化的收益？
- 是否在性能测试中观察 Safepoint 次数变化？

# 参考资料
- JEP 312: Thread-Local Handshakes：https://openjdk.org/jeps/312
- HotSpot TLH 设计文档：https://wiki.openjdk.org/display/HotSpot/Thread-Local+Handshakes
- Azul/Oracle 对 Handshake 机制的技术分享
