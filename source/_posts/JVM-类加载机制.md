---
title: JVM(1) - 类加载运行的全过程
date: 2021-07-01
tags: ['#JVM']
---

### 本文目录
<!-- toc -->

> 众所周知，Java的slogan就是"Write once, run anywhere"，这也就意味着无论我们在什么平台的机器上用Java去做实现，都可以在任何支持Java的系统上直接运行，无需做任何额外操作。
> 那么Java是如何做到这些的呢？