---
title: JVM内存泄漏排查实录
date: 2021-08-28
lang: zh-CN
tags: ['#JVM']
---

### 本文目录
<!-- toc -->

# 引言
> Java 的垃圾收集机制并不能杜绝所有内存问题。业务代码持有不必要的引用、第三方库缓存实现不当、类加载器泄漏等，都可能导致堆内存或元空间持续膨胀。本文梳理实际排查流程，并总结稳定的排查工具链。

# 常见泄漏类型
## 长生命周期集合
- 使用 `static` 集合缓存用户会话、配置，忘记清理；
- `ThreadLocal` 未显式 `remove`，导致线程池中线程长期持有对象引用；
- LRU 缓存实现未限制容量或缺少淘汰策略；

## 事件监听与回调
- Observer/Listener 模式未正确取消注册；
- `CompletableFuture` 回调链持有外部对象；
- RxJava、Project Reactor 中的 `Flux` 订阅未解除。

## 类加载器泄漏
- Web 容器热部署后，旧 ClassLoader 引用残留；
- JDBC DriverManager 未卸载驱动；
- `java.util.logging` 自定义 Handler 未关闭。

# 排查流程
1. **复现与量化**：使用 Grafana 监控堆使用趋势，观察 Full GC 后是否回落；
2. **获取堆转储**：`jcmd <pid> GC.heap_dump filename` 或 `-XX:+HeapDumpOnOutOfMemoryError`；
3. **分析工具**：
   - Eclipse MAT：Leak Suspect、Dominators Tree；
   - VisualVM / JMC：实时监控线程与内存；
   - `jmap -histo`：查看对象实例统计；
4. **定位 GC Roots**：在 MAT 中选取可疑对象，查看保留路径（Path to GC Roots），识别是否被缓存或线程持有；
5. **小心 false positive**：软引用、弱引用要区分 GC 可达性。

# 案例分享
## 监听器忘记注销
电商风控系统上线后，发现 JVM 堆在 48 小时内从 4GB 涨到 12GB。堆转储显示 `com.foo.security.AlertListener` 实例 20 万个占用大量内存。原因是租户动态创建监听器但未移除，通过实现 `AutoCloseable` 并在租户过期时统一 `close` 解决。

## ThreadLocal 泄漏
支付业务中使用 `ThreadLocal<SimpleDateFormat>`，线程池复用导致对象无法回收。改为 `DateTimeFormatter` 或在 `finally` 中 `remove()`，外加 `-XX:+DisableExplicitGC` 避免业务错误调用 `System.gc()`。

## 类加载器堆积
Tomcat 热部署后 Full GC 无法回收旧 ClassLoader。在渲染模板中引用第三方库缓存的 `Class<?>` 静态字段，导致类加载器链条未断。解决方式：
- 使用 `WeakReference<Class<?>>` 存储；
- 注册 ServletContextListener，销毁时执行清理；
- 对 JDBC 驱动调用 `DriverManager.deregisterDriver`。

# 预防策略
- 使用 Caffeine 等具备到期策略的缓存，设置最大容量；
- 通过 `Metrics` 记录对象池大小以及 `ThreadLocal` key 数量；
- 对外部资源（Netty、Unsafe 分配的 off-heap）及时 `release`; 
- 线上启用 `JFR` 定期采样内存事件；
- 在 CI 阶段对关键接口进行 `jmap -histo` diff，监控激增类型。

# 总结
JVM 内存泄漏排查需要工具与流程配合：先量化、再 dump、再分析路径。通过建立“资源生命周期即代码”的意识，加上自动化监控，可以把泄漏风险控制在可观测范围内。

# 参考资料
- [1] Oracle, "Troubleshooting Guide for Java SE". https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/
- [2] Eclipse Memory Analyzer Tool. https://www.eclipse.org/mat/
- [3] JDK Mission Control User Guide. https://docs.oracle.com/javacomponents/jmc-5-5/jmc-user-guide
- [4] Caffeine Cache 文档. https://github.com/ben-manes/caffeine/wiki
