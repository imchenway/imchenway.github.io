---
title: JVM是如何与操作系统交互的
date: 2021-07-06
tags: ['#JVM','#操作系统']
---

### 本文目录
<!-- toc -->

# 引言
> 在之前的文章，我们介绍了[类加载的过程](https://imchenway.com/2021/07/01/JVM-类加载机制/)以及[类加载器和双亲委派模型](https://imchenway.com/2021/07/02/JVM-类加载器与双亲委派模型/)
> 那么我们的应用程序被加载到JVM中之后，操作系统是如何去与JVM虚拟机交互来执行我们应用程序中的逻辑的呢？
> 答案就是大名鼎鼎的CPU，全称是`Central Processing Unit`，也就是中央处理器。
> 那么CPU在操作系统中起到了什么样的作用呢？

# CPU的组成以及工作原理
CPU由主要由控制器和运算器两部分组成。
- 其中控制器中程序计数器（PC）、指令寄存器（IR）、指令译码器（ID）、时序发生器、操作控制器组成，他们的主要功能为：
  1. 从主存中取出一条指令，并指出吓一跳指令在主存中的位置；
  2. 对指令进行译码，并产生相应的操作控制信号；
  3. 指挥并控制CPU、主存和输入/输出设备之前的数据流动；
- 运算器由算数逻辑单元（ALU）、累加寄存器（AC）、数据寄存器（DR）和程序状态寄存器（PSW）组成，主要功能为：
  1. 执行所有的算术运算；
  2. 执行所有的逻辑运算，并进行逻辑测试；

非常的枯燥无味，说人话就是：CPU会根据程序计数器所指示的位置，从主存中取出数据，寄存至数据寄存器，然后CPU从数据寄存器中取出指令，放入指令寄存器，并对指令译码。将指令分解成一系列的微操作，然后发出控制命令，执行这一系列微操作，从而完成一条指令的执行。

看到这里还有耐心的小伙伴请戳：[CPU的功能和组成 - Intel® Developer Zone](https://software.intel.com/content/www/cn/zh/develop/articles/book-processor-architecture_cpu_function_and_composition.html)

# JVM是如何与操作系统交互的？


# 相关问题
## 什么是CPU Cache、Cache Line、MESI？

# 参考资料
- [CPU的功能和组成 - Intel® Developer Zone](https://software.intel.com/content/www/cn/zh/develop/articles/book-processor-architecture_cpu_function_and_composition.html)