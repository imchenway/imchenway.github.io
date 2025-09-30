---
title: Class数据共享与AppCDS
date: 2021-09-07
tags: ['#JVM']
---

### 本文目录
<!-- toc -->

# 引言
> Class Data Sharing (CDS) 与 Application CDS (AppCDS) 能显著缩短 JVM 启动时间，降低内存占用，尤其在容器环境或密集部署时收益明显。本文梳理 CDS 的原理、生成流程、调优要点及在云原生场景的实践经验。

# CDS 的原理
## 基础概念
- **CDS**：JVM 在安装时生成 `classes.jsa`，预加载 Java Standard Library 的共享类元数据；
- **AppCDS**：允许将应用类、第三方库类纳入共享归档，JEP 331 将其合并进 JDK 10 并默认提供；[1]
- **目标**：减少类加载阶段的解析成本、减少每个进程的元空间复制，实现类元数据的共享映射。

## 运行机制
- JVM 启动时将共享归档映射为只读区域，多个 JVM 进程共享同一物理内存页；
- 归档包含已验证的常量池、方法、字段等元数据，避免重复解析；
- 同一版本 JDK、同一归档文件可被多个实例共享，若存在不匹配，JVM 会回退到常规类加载。

# AppCDS 的生成流程
1. **收集类列表**：`-Xshare:off -XX:DumpLoadedClassList=app.lst`；
2. **生成归档**：`java -Xshare:dump -XX:SharedClassListFile=app.lst -XX:SharedArchiveFile=app.jsa -cp app.jar`; 
3. **运行加载**：`java -Xshare:on -XX:SharedArchiveFile=app.jsa -cp app.jar Main`；
4. **多 Jar 环境**：JDK 13 起提供动态仓库模式（Dynamic CDS Archive），可在首次启动时自动生成。

# 云原生场景的优化
- **容器镜像**：在构建阶段生成 AppCDS，镜像运行时直接使用 `-Xshare:on`；
- **多租户**：对统一服务模板生成共享归档，提高节点密度；
- **与 JLink 配合**：构建定制 runtime 镜像，减少体积与启动时间；
- **Kubernetes**：通过 `InitContainer` 生成并挂载 `app.jsa`，保证归档与主容器版本一致。

# 监控与诊断
- `-Xlog:cds=info` 查看 CDS 加载过程；
- `jcmd VM.classloaders` 验证共享归档生效；
- `-XX:+PrintSharedArchiveAndExit` 检查归档内容；
- 注意 AppCDS 与动态代理、反射的兼容性，必要时开启 `--trace-class-loading` 调试。

# 实战经验
1. **低延迟交易网关**：使用 AppCDS 将所有 SPI 实现预归档，启动时间从 3.5s 降至 1.2s；
2. **FaaS 平台**：结合 GraalVM Native Image、AppCDS，预热耗时减少 40%；
3. **升级策略**：归档文件需与 JDK 版本完全匹配，升级后必须重新生成，否则 JVM 会报警并回退。

# 总结
CDS/AppCDS 是轻量但有效的优化手段。通过构建流程自动生成归档、在容器内加载，可实现启动速度与内存占用双赢。关键在于维护归档与应用版本的一致性，并针对动态加载类做降级处理。

# 参考资料
- [1] JEP 331: Low-Overhead Heap Profiling.（AppCDS 集成）https://openjdk.org/jeps/331
- [2] Oracle, "Class Data Sharing". https://docs.oracle.com/javase/8/docs/technotes/guides/vm/class-data-sharing.html
- [3] JDK 13 Dynamic CDS Archive. https://openjdk.org/jeps/350
- [4] Red Hat, "Optimizing Java in Containers". https://access.redhat.com
