---
title: Class Data Sharing (CDS) 与 AppCDS 调优
date: 2018-12-12
tags: ['#JVM', '#CDS']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# CDS 简介
Class Data Sharing (CDS) 将常用类元数据预存到共享归档，缩短启动时间并减少内存开销。AppCDS（JDK 10+）支持应用自定义类归档。

# 工作流程
1. **生成基础归档**（JDK 默认模块归档 `lib/server/classes.jsa`）：JDK 已提供。
2. **AppCDS**：
   ```bash
   java -Xshare:dump -XX:SharedClassListFile=app.classlist -XX:SharedArchiveFile=app.jsa -cp app.jar com.example.Main
   ```
   `app.classlist` 可由 `-Xshare:off -XX:DumpLoadedClassList=app.classlist` 在运行时生成。
3. **使用归档**：
   ```bash
   java -Xshare:on -XX:SharedArchiveFile=app.jsa -cp app.jar com.example.Main
   ```

# Spring Boot 示例
- 先运行 `java -Xshare:off -XX:DumpLoadedClassList=app.classlist -jar app.jar`；
- 再执行 `java -Xshare:dump -XX:SharedClassListFile=app.classlist -XX:SharedArchiveFile=app.jsa -jar app.jar`；
- 运行时添加 `-XX:SharedArchiveFile=app.jsa`。

# 调优要点
- 对微服务或 CLI 启动可减少 10~30% 启动时间；
- 配合容器镜像，将 `app.jsa` 放入镜像层；
- 定期重新生成归档，确保与应用版本匹配；
- JDK 13+ 支持动态 CDS 归档（JEP 350）。

# 监控
- `-Xlog:cds` 查看加载统计；
- JFR 事件 `CDS`；
- 比较启动日志耗时、RSS 内存变化。

# 自检清单
- 是否正确生成 classlist 并包含所有关键类？
- 是否在启动脚本中加载 AppCDS 归档？
- 是否验证归档更新机制与镜像构建流程？

# 参考资料
- Class Data Sharing Guide：https://docs.oracle.com/en/java/javase/17/vm/class-data-sharing.html
- JEP 310: Application Class-Data Sharing：https://openjdk.org/jeps/310
- JEP 350: Dynamic CDS Archives：https://openjdk.org/jeps/350
