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

# CPU的组成
<img src="/images/posts/CPU组成图.jpeg" width="500px" />

# CPU工作原理
CPU由主要由控制器和运算器两部分组成。
- 其中控制器中程序计数器（PC）、指令寄存器（IR）、指令译码器（ID）、时序发生器、操作控制器组成，他们的主要功能为：
  1. 从主存中取出一条指令，并指出下一条指令在主存中的位置；
  2. 对指令进行译码，并产生相应的操作控制信号；
  3. 指挥并控制CPU、主存和输入/输出设备之前的数据流动；
- 运算器由算数逻辑单元（ALU）、累加寄存器（AC）、数据寄存器（DR）和程序状态寄存器（PSW）组成，主要功能为：
  1. 执行所有的算术运算；
  2. 执行所有的逻辑运算，并进行逻辑测试；

> 非常的枯燥无味，说人话就是：CPU会根据程序计数器所指示的位置，从主存中取出数据，寄存至数据寄存器，然后CPU从数据寄存器中取出指令，放入指令寄存器，并对指令译码。将指令分解成一系列的微操作，然后发出控制命令，执行这一系列微操作，从而完成一条指令的执行。

# JVM是如何与操作系统交互的？
在前面的文章中我们说过，Java的跨平台的特性是基于JVM虚拟机能够将Java代码编译后的字节码（.class）文件转译为对应的机器所能识别的机器码。
```java
public class ByteCodeTest {
    public static void main(String[] args) {
        System.out.println("Hello world");
    }
}
```
通过`javac`编译后使用`javap -verbose`命令即可查看到该类的字节码
以下是`System.out.println("Hello world")`的对应的字节码
```
0: getstatic     #7                  // Field java/lang/System.out:Ljava/io/PrintStream;
3: ldc           #13                 // String Hello world
5: invokevirtual #15                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
```
虚拟机将以上字节码通过解释器解释成汇编指令，最终由硬件转译为CPU能识别的机器指令。

1. 在`java`命令执行后，虚拟机启动，将class文件加载到虚拟机由于该类包含了main方法，JVM类加载机制在之前的文章[JVM内存模型](https://imchenway.com/2021/07/01/JVM-类加载机制/)中的`初始化`部分中讲过，包含main方法的类，会在虚拟机启动时过程中触发`初始化`的动作，那么该类中的信息就会被我们按照JVM内存模型的规则存入相对应的内存区域
   - 我们暂且先把它理解为单纯的一块内存区域。JVM虚拟机暂时理解为运行在操作系统之上的一个虚拟电脑，操作系统为这个虚拟电脑分配CPU、内存等资源，而此时JVM虚拟机也可以称之为操作系统的一个进程。
2. 在虚拟机启动之后，此时的虚拟机我们可以将其理解为一段可执行的指令集合，同时虚拟机作为操作系统的一个进程，操作系统为其分配类内存和CPU资源，其中保存着当前执行的指令，变量值等信息，这也可以称为进程的上下文。
3. 此时CPU在多个上下文（多个进程/多个线程）切换执行指令，此时的上下文可能来自于系统调度，也可能来自于用户程序，也就会产生用户态和内核态之前的切换。

# 本文总结
1. 在`java`命令执行后，相当于在操作系统中启动了一个JVM进程，虚拟机启动，将class文件通过类装载器加载到虚拟机的内存区域，然后通过JVM将字节码解释为汇编语言（对应操作系统的相关函数），等待被调用。
2. CPU通过JVM，获取到需要执行的汇编指令，CPU获取到汇编指令后通过硬件解码为机器所能识别的机器码，然后执行其机器码。

# 相关问题
### 什么是CPU Cache、Cache Line、MESI？
### 什么是用户态和内核态？

---
#### 参考资料
- [CPU的功能和组成 - Intel® Developer Zone](https://software.intel.com/content/www/cn/zh/develop/articles/book-processor-architecture_cpu_function_and_composition.html)