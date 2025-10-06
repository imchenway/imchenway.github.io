---
title: JVM 内存区域与对象生命周期全解析
date: 2017-07-12
lang: zh-CN
tags: ['#JVM']
categories:
  - JVM
---

### 本文目录
<!-- toc -->

# 总览
HotSpot JVM 在运行期划分为程序计数器、Java 虚拟机栈、本地方法栈、堆、方法区以及运行时常量池等区域。理解各区域的职责有助于定位内存泄漏、堆外溢出与线程问题。

# 运行时数据区
- **程序计数器 (PC Register)**：每个线程私有，记录当前字节码指令地址，保证线程切换后恢复执行位置。
- **Java 虚拟机栈**：存储栈帧（局部变量表、操作数栈、动态链接、返回地址）。递归过深会触发 `StackOverflowError`。
- **本地方法栈**：为 Native 方法服务，HotSpot 与虚拟机栈共享实现。
- **堆**：线程共享，主要存放对象实例；采用分代管理（年轻代 + 老年代）。
- **方法区（JDK 8 起为 Metaspace）**：存放类元数据、运行时常量池等。JDK 8 把方法区搬至本地内存，避免 PermGen 易溢出问题。

# 对象生命周期
1. **创建**：类加载完成后，通过 `new`、反射、`clone`、反序列化等方式分配堆内存。
2. **存活判定**：GC Root 可达性算法；引用分为强、软、弱、虚四类。
3. **回收触发**：Minor GC 回收新生代；Major/Full GC 回收老年代与方法区。
4. **内存分配策略**：TLAB 分配减少同步；大对象直接进入老年代；长期存活对象晋升老年代。

# 调优关键点
- **年轻代比例**：通过 `-XX:NewSize` / `-XX:MaxNewSize` 控制，适合对象生命周期短的服务。
- **Survivor 区**：`-XX:SurvivorRatio` 影响 S0/S1 大小，调优对晋升失败尤为关键。
- **Metaspace**：`-XX:MetaspaceSize` 与 `-XX:MaxMetaspaceSize` 控制类元数据容量。
- **逃逸分析**：JIT 通过逃逸分析将对象分配在栈或进行标量替换。

# 常见问题排查
- `OutOfMemoryError: Java heap space`：堆不足或内存泄漏；可使用 `jmap -dump`、MAT 分析。
- `OutOfMemoryError: Metaspace`：大量动态生成类或未释放的 ClassLoader。
- `StackOverflowError`：递归深度过大，检查递归终止条件。

# 工具组合
- `jmap`, `jstack`, `jcmd` 查看堆与线程状态；
- Java Flight Recorder 搭配 Mission Control 分析内存与 GC 事件；
- `jvisualvm`、Async-profiler 辅助定位热点。

# 参考资料
- HotSpot Java 虚拟机运行时数据区说明：https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html
- Java HotSpot VM 性能与 GC 调优指南：https://docs.oracle.com/en/java/javase/17/gctuning/
