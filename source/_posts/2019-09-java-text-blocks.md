---
title: Java 文本块（Text Blocks）实践与注意事项
date: 2019-09-05
tags: ['#Java', '#Language']
categories:
  - Java
---

### 本文目录
<!-- toc -->

# 文本块概述
文本块（Text Blocks）在 JDK 13 引入预览（JEP 355），JDK 15 标准化（JEP 378）。通过 `"""` 定义多行字符串，简化 JSON、SQL、HTML 等模板的编写。

# 基本用法
```java
String sql = """
    SELECT id, name
    FROM users
    WHERE status = "ACTIVE"
    ORDER BY created_at DESC
    """;
```
- 编译期自动处理换行；
- 默认保留尾部换行，可使用 `stripIndent()`、`translateEscapes()`。

# 对齐策略
- 最终字符串基于最小缩进；
- 可使用 `"""\` 避免自动换行；
- `String formatted = template.formatted(args...)` 用于模板替换。

# 注意事项
- Text Blocks 仍会转义 `\n`, `\t` 等；
- JSON/SQL 模板建议结合 `stripIndent()` 清除缩进；
- 三引号 `"""` 内若需出现 `"""` 可使用 `""""""`（6 个双引号）。

# 案例
- 构建 SQL/GraphQL 查询；
- HTTP 请求模板（`HttpRequest.BodyPublishers.ofString(textBlock)`）；
- 单元测试期望字符串。

# 自检清单
- 是否在构建脚本中启用 `--enable-preview`（JDK 13/14）？
- 是否使用 `formatted()` 替代 `String.format()`？
- 是否处理尾部换行与缩进需求？

# 参考资料
- JEP 378: Text Blocks：https://openjdk.org/jeps/378
- Java Language Updates：https://docs.oracle.com/en/java/javase/15/language/text-blocks.html
- IntelliJ IDEA 文本块支持：https://www.jetbrains.com/help/idea/jdk-text-blocks.html
