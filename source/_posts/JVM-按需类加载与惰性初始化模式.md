---
title: JVM按需类加载与惰性初始化模式
date: 2022-01-25
lang: zh-CN
tags: ['#JVM']
---

### 本文目录
<!-- toc -->

# 引言
> Java 的类是按需加载和初始化的，这为我们设计惰性加载、模块化架构提供了可能。本文总结类加载生命周期、惰性模式实现与并发安全性。

# 类加载生命周期
1. **加载**：读取 class 文件；
2. **链接**：验证、准备、解析；
3. **初始化**：执行 `<clinit>`；
4. **使用/卸载**。

# 惰性初始化模式
## 静态内部类
```
class Holder {
    private static class LazyHolder {
        static final Instance INSTANCE = new Instance();
    }
    static Instance get() { return LazyHolder.INSTANCE; }
}
```
- 利用类初始化只执行一次；
- 天然线程安全。

## 枚举单例
```
public enum Singleton {
    INSTANCE;
}
```
- JVM 保证单例和序列化安全。

## Lazy + Supplier
- 使用 `Supplier<T>` 延迟计算；
- `AtomicReference` + 双重检查实现线程安全。

# 类加载器设计
- 父子委派保障核心类安全；
- 自定义 ClassLoader 实现插件热加载；
- 注意 ClassLoader 泄漏（引用 ThreadLocal、静态字段）。

# 实践建议
- 使用 `ServiceLoader` 或 SPI 延迟加载实现；
- 在 Spring Framework 中利用 `@Lazy`、`ObjectProvider`；
- SaaS 场景通过租户专属 ClassLoader，按需加载租户逻辑并卸载。

# 总结
按需加载和惰性初始化提供了灵活的架构方式。通过正确的设计，可以降低启动开销、避免不必要的资源消耗，并保持线程安全。

# 参考资料
- [1] Oracle, "Class Loading" Guide. https://docs.oracle.com/javase/specs/jvms/se17/html/jvms-5.html
- [2] Joshua Bloch, Effective Java 第 3 版.
- [3] Spring Framework Reference Documentation.
