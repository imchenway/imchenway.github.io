---
title: JVM - JVM中的ClassLoader类加载机制
date: 2021-07-01
tags: ['#JVM']
---

### 本文目录
<!-- toc -->

# 引言
> 众所周知，Java的slogan就是"Write once, run anywhere."，这也就意味着无论我们在什么平台的机器上用Java去做实现，都可以在任何支持Java的系统上直接运行，无需做任何额外操作。
> Java是如何做到这些的呢？答案是JRE。
> - 那么什么是JRE？为什么叫JRE？
>   - JRE（Java Runtime Environment），是一个Java代码的运行时环境，属于软件层，运行在操作系统软件之上，属于JDK的一部分。
> - 什么是JDK？
>   - JDK（Java Development Kit），每一个JDK都包含了一个兼容的JRE和一个JVM，并且JDK包含了许多Java开发人员常用的工具以及类库，比如`javac`、`java`、`jar`、`jmap`、`jstat`、`jstack`、`jinfo`、`rt.jar`等。
> - 什么是JVM？
>   - JVM(Java Virtual Machine),JVM可以理解为是一个运行在操作系统之上的虚拟电脑，当我们通过`javac`将`*.java`编译成JVM可识别`*.class`字节码文件后，再执行`java`，此时JVM会将`*.class`字节码文件解释成当前操作系统平台可识别的机器码去执行。这样的话就实现了"Write once, run anywhere."。
> - 整体流程如下所示
> ![javaCli](/images/posts/javaCli.png)
> - 至此，可以看到ClassLoader在`java`命令执行后起到了承上启下的重要作用
> - 那么JVM中的ClassCloader是如何运行的呢？本文将带你揭开它神秘的面纱

# JVM类加载机制
![](/images/posts/JVMClassLoader.png)
加载一个class类的过程总体分三个步骤，`加载、链接、初始化`，其中链接阶段分为`验证、准备、解析`三个阶段