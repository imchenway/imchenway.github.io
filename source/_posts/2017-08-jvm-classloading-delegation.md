---
title: JVM 类加载机制与双亲委派模型
date: 2017-08-12
lang: zh-CN
tags: ['#JVM']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 类加载阶段回顾
从类的 `.class` 文件被加载到内存开始，JVM 依次经历 **加载（Loading）→ 验证（Verification）→ 准备（Preparation）→ 解析（Resolution）→ 初始化（Initialization）** 的五个阶段，必要时还会触发卸载。理解各阶段的触发时机，有助于避免类初始化死循环与 `NoClassDefFoundError`。

# 类加载器体系
- **Bootstrap ClassLoader**：C++ 实现，加载 JRE `lib` 目录下的核心类库。
- **Extension (Platform) ClassLoader**：负责 `jre/lib/ext` 或 `java.ext.dirs` 指定路径。
- **System (Application) ClassLoader**：加载用户类路径 `classpath`。
- **自定义 ClassLoader**：继承 `ClassLoader` 并重写 `findClass`，支持从网络、加密文件等源加载。

# 双亲委派模型
1. 类加载请求先委派给父加载器；
2. 若父加载器无法完成加载，再由子加载器尝试；
3. 保证核心类的唯一性，避免用户自定义 `java.lang.String` 等被篡改。

# 破坏与扩展
- **破坏场景**：JNDI、SPI 服务发现需要加载具体实现，会在 `loadClass` 中改写委派逻辑；Tomcat 等容器通过上下文 ClassLoader 实现应用隔离。
- **线程上下文类加载器 (TCCL)**：允许框架在委派链外加载类，如 JDBC、ServiceLoader。

# 常见问题
- `ClassNotFoundException` vs `NoClassDefFoundError`：前者在类加载时找不到；后者在链接或初始化阶段失败。
- 类初始化顺序：父类静态代码块 → 子类静态代码块 → 父类实例初始化块/构造器 → 子类实例初始化块/构造器。
- 循环依赖导致的死锁：多个线程同时触发类初始化，需留意静态块中的同步。

# 实战建议
- 明确自定义 ClassLoader 的父子关系，避免打破安全边界；
- 使用 `URLClassLoader`/`ClassLoader#defineClass` 加载字节码前需先验证来源；
- 多模块系统可借助 OSGi / JPMS 管理类可见性。

# 参考资料
- Java Virtual Machine Specification - Class File Loading：https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-5.html
- Oracle Java Tutorials - Lesson: The Java ClassLoader：https://docs.oracle.com/javase/tutorial/ext/basics/load.html
- Java Platform Module System 指南：https://docs.oracle.com/javase/9/docs/api/java/lang/module/package-summary.html
