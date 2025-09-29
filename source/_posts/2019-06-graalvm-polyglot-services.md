---
title: GraalVM 多语言互操作：在 Java 中嵌入 JS/Python
date: 2019-06-05
tags: ['#Java', '#GraalVM', '#Polyglot']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# Polyglot API 概览
GraalVM 提供 Polyglot API，允许在 Java 应用中执行 JavaScript、Python、Ruby 等语言，并与 Java 互操作。适合脚本扩展、规则引擎、数据转换。

# 快速示例
```java
Context context = Context.newBuilder()
    .allowAllAccess(true)
    .option("python.Executable", "python")
    .build();

Value pyFunc = context.eval("python", """
import math

def hypotenuse(a, b):
    return math.hypot(a, b)
""");

Value hypotenuse = pyFunc.getMember("hypotenuse");
System.out.println(hypotenuse.execute(3, 4).asDouble()); // 5.0
```

# 数据交换
- GraalVM 自动转换原始类型、列表、字典；
- 对象互操作：使用 `@HostAccess.Export` 注解 Java 方法；
- 安全性：通过 `Context` 的权限控制访问。

# 性能与限制
- 对小脚本场景性能足够；
- 大量调用需缓存 `Value` 函数；
- Python/R 等语言仍在积极开发，需关注兼容性。

# 部署注意
- GraalVM 发行版 & 对应语言组件：`gu install python js`；
- Native Image 中使用 Polyglot 需加参数 `--language:js` 等；
- 监控：JFR 事件 `ExecutionSample` 可统计 Polyglot 调用热点。

# 自检清单
- 是否限制脚本访问权限（文件、网络）以保证安全？
- 是否缓存脚本上下文避免重复编译？
- 是否记录 Polyglot 调用耗时并设置告警？

# 参考资料
- GraalVM Polyglot Guide：https://www.graalvm.org/latest/reference-manual/polyglot/
- GraalVM Python 文档：https://www.graalvm.org/python/
- Oracle CodeOne Session: Polyglot Apps with GraalVM
