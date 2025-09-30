---
title: 使用 jlink 构建精简 Java 运行时镜像
date: 2019-05-05
tags: ['#Java', '#JPMS', '#Deployment']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# jlink 简介
jlink 是 JDK 9 引入的工具，可根据模块依赖生成精简的自定义运行时镜像（Runtime Image）。相比传统 JRE，镜像仅包含应用所需模块，适合容器化与函数计算场景。

# 基本流程
1. 为应用创建 JPMS 模块或使用自动模块。
2. 编译并打包模块：`javac --module-path mods src -d out`。
3. 使用 `jlink` 构建镜像：
```bash
jlink \
  --module-path $JAVA_HOME/jmods:mods \
  --add-modules com.example.app \
  --launcher app=com.example.app/com.example.Main \
  --output runtime
```
4. 运行镜像：`runtime/bin/app`。

# 常用参数
- `--strip-debug`：移除调试信息；
- `--compress=2`：压缩 class 文件；
- `--no-header-files --no-man-pages`：移除头文件与手册；
- `--add-options '--enable-preview'`：传递 JVM 启动参数。

# 与容器集成
- Dockerfile 中复制 `runtime` 目录即可：
```dockerfile
FROM alpine:3.19
COPY runtime /opt/runtime
COPY app.jar /opt/app/app.jar
ENTRYPOINT ["/opt/runtime/bin/java", "-jar", "/opt/app/app.jar"]
```
- 镜像体积约为 40~70MB。

# 自检清单
- 是否分析模块依赖（`jdeps`）避免遗漏？
- 是否为镜像配置统一的 JVM 参数与 Launcher？
- 是否在 CI 中缓存 jlink 结果以节省构建时间？

# 参考资料
- jlink 官方文档：https://docs.oracle.com/en/java/javase/17/docs/specs/man/jlink.html
- JPMS 模块化指南：https://docs.oracle.com/javase/9/docs/api/java/lang/module/package-summary.html
- OpenJDK jlink 教程：https://openjdk.java.net/projects/jlink/
