---
title: JVM类加载器与双亲委派模型（JDK8）
date: 2021-07-02
tags: ['#JVM']
---

### 本文目录
<!-- toc -->

    
# 引言
> 在上文[JVM-类加载机制](https://imchenway.com/2021/07/01/JVM-类加载机制)中，描述了在`java`命令执行后，JVM类加载的整个流程。
> - 在上文中可以看到ClassLoader在`java`命令执行后起到了承上启下的重要作用
> - 那么JVM中的ClassLoader是如何运行的呢？本文将带你揭开它神秘的面纱

# JVM类加载器
## 什么是类加载器？
虚拟机的设计团队把类加载阶段中的`通过类的全限定名去找到对应的Class文件`这个动作放到Java虚拟机的外部去实现，为了便于让应用程序自己决定如何去获取所需要的类，实现这个动作的代码模块就叫做“类加载器”。

## 类与类加载器的关系
类加载器只用于类的加载动作，但是在我们的Java程序中起到的作用却不至于类的加载。在我们比较两个类是否相等时（`equals()`、`isInstance()`、关键字`instanceof`），即使两个类来源于同一个Class文件，被同一个虚拟机加载，当它们的类加载不同时，那么这两个类也会不相等。
```java
package com.imchenway.classload;

import java.io.IOException;
import java.io.InputStream;

/**
 * 类加载器与类的关系
 *
 * @author David Chan
 * @date 2021-07-02
 */
public class ClassLoaderTest {
    public static void main(String[] args) throws ClassNotFoundException, InstantiationException, IllegalAccessException {
        ClassLoader classLoader = new ClassLoader(){
            @Override
            public Class<?> loadClass(String name) throws ClassNotFoundException {
                String fileName = name.substring(name.lastIndexOf(".") + 1) + ".class";
                InputStream is = getClass().getResourceAsStream(fileName);
                if (is == null) {
                    return super.loadClass(name);
                }
                try {
                    byte[] b = new byte[is.available()];
                    is.read(b);
                    return defineClass(name, b, 0, b.length);
                } catch (IOException e) {
                    e.printStackTrace();
                }
                return super.loadClass(name);
            }
        };

        Object obj = classLoader.loadClass("com.imchenway.classload.ClassLoaderTest").newInstance();
        System.out.println(obj.getClass());
        System.out.println(obj instanceof com.imchenway.classload.ClassLoaderTest);

        System.out.println("ClassLoaderTest classLoader: " + ClassLoaderTest.class.getClassLoader().toString());
        System.out.println("obj classLoader: " + obj.getClass().getClassLoader().toString());
    }
}
```
输出：
```
class com.imchenway.classload.ClassLoaderTest
false
ClassLoaderTest classLoader: jdk.internal.loader.ClassLoaders$AppClassLoader@55054057
obj classLoader: com.imchenway.classload.ClassLoaderTest$1@6ff3c5b5
```
由此可以看到，`ClassLoaderTest`在启动时由`jdk.internal.loader.ClassLoaders$AppClassLoader@55054057`所加载，而`obj`由`com.imchenway.classload.ClassLoaderTest$1@6ff3c5b5`所加载，所以`System.out.println(obj instanceof com.imchenway.classload.ClassLoaderTest);`这一行输出的结果为`false`，因为类的唯一性由是否是同一个类加载器和是否同一个字节码文件同时决定的。

## 类加载器是如何去加载类的？
### 双亲委派模型
- 从Java虚拟机的角度来说，只存在两种不同的类加载器，一种是启动类加载器，使用C++实现，是虚拟机自身的一部分；另一种就是所有其他的类加载器，都是由Java实现的，全部都继承自抽象类`java.lang.ClassLoader`。
- 从Java开发人员的角度来说，类加载器主要分为：
  - 启动类加载器（BootStrap ClassLoader）：负责将存放于`<JAVA_HOME>\lib`目录中的，或者被`XbootClasspath`参数指定路径的类库加载到虚拟机内存中。
  - 扩展类加载器（Extension ClassLoader）：负责将存放于`<JAVA_HOME>\lib\ext`目录中的，或者被`java.ext.dirs`系统变量所指定的类库。
  - 应用程序类加载器（Application ClassLoader）：负责将用户类路径（classPath）上所指定的类库
  - 除了以上三种类加载器外，我们还可以自定义类加载器。（TODO 如何使用自定义类加载器实现类加载？）

### 双亲委派模型工作过程
<img src="/images/posts/双亲委派模型.png" width="400px" />

当一个类加载器收到了类加载的请求时，首先是交给自己的父类加载器去加载，最终都会到达顶层的引导类加载器，当父类加载器反馈无法完成这个加载请求时，子加载器尝试自己去加载。

### 为什么需要双亲委派？
1. 可以避免类的重复加载，当父加载器已经加载过某一个类时，子加载器就不会再重新加载这个类。
2. 保证应用程序的安全性，防止核心API被篡改。
> 在类与类加载器的关系中我们证明了一个类的唯一性由加载这个类的类加载器和类本身所决定，如果没有双亲委派机制存在的话，设想如果应⽤程序类加载器想要 加载⼀个有破坏性的`java.lang.System`类，双亲委派模型会⼀层层向上委派，最终委派给启动类加载器，而启动类加载器中检查到缓存中已经有了这个类，并不会再加载这个有破坏性的System类。

当然，实际上自定义包名`java`开头的类将无法加载成功
<img src="/images/posts/preDefineClass.png" width="500px">


### 双亲委派是如何实现的？
```java
    protected Class<?> loadClass(String name, boolean resolve)
        throws ClassNotFoundException
    {
        synchronized (getClassLoadingLock(name)) {
            // First, check if the class has already been loaded
            Class<?> c = findLoadedClass(name);
            if (c == null) {
                long t0 = System.nanoTime();
                try {
                    if (parent != null) {
                        c = parent.loadClass(name, false);
                    } else {
                        c = findBootstrapClassOrNull(name);
                    }
                } catch (ClassNotFoundException e) {
                    // ClassNotFoundException thrown if class not found
                    // from the non-null parent class loader
                }

                if (c == null) {
                    // If still not found, then invoke findClass in order
                    // to find the class.
                    long t1 = System.nanoTime();
                    c = findClass(name);

                    // this is the defining class loader; record the stats
                    sun.misc.PerfCounter.getParentDelegationTime().addTime(t1 - t0);
                    sun.misc.PerfCounter.getFindClassTime().addElapsedTimeFrom(t1);
                    sun.misc.PerfCounter.getFindClasses().increment();
                }
            }
            if (resolve) {
                resolveClass(c);
            }
            return c;
        }
    }
```
1. `findLoadedClass(name);`判断该类是否已经加载，如果加载过，则使用缓存
2. 如果加载器不为null，则继续调用父类加载器的`loadClass(String name, boolean resolve)`方法
3. 如果加载器为null，说明当前为引导类加载器（bootstrapClassLoader），在`findBootstrapClassOrNull(name)`中调用本地方法（C++实现）


# 本文总结
- 在类的加载阶段，Java虚拟机通过类加载器模块去实现`通过类的全限定名去找到对应的Class文件`，同时通过类加载器的唯一实例对象地址和字节码文件的相同来判定类的唯一性，正时因为这个特性，也让类加载机制可以拥有隔离性。
- 类加载的过程中，使用双亲委派机制来避免类的重复加载，同时也保障了核心类库API不被篡改。

# 相关问题
### 如何破坏双亲委派模型？
破坏双亲委托模型，只需要在`loadClass(String name, boolean resolve)` 方法中，不调用父类加载器去加载类就可以了。

### 为什么要破坏双亲委派模型？
由于`类的唯一性由是否是同一个类加载器和是否同一个字节码文件同时决定的`这一特性，可以为应用程序提供类库的隔离性。

### 有哪些破坏了双亲委派模型的例子？分别是为了什么目的？
1. Tomcat：我们经常会在一个Tomcat中部署多个应用程序，多个应用程序之前可能用着不同版本的类库，也可能共享着一部分类库。这个时候自定类加载器就可以派上用场了
   - 在Tomcat中主要用自定义类加载器解决以下几个问题：
     1. 同一个Tomcat中，各个Web应用之前各自使用的Java类库要互相隔离
     2. 同一个Tomcat中，各个Web应用之间可以共享有共享的Java类库
     3. 为了使Tomcat不受web应用的影响，服务器的类库应该与应用程序的类库互相独立
     4. 使Tomcat支持热部署

### Tomcat中类加载器的架构是怎么样的？

<img src="/images/posts/Tomcat双亲委派模型.png" width="400px" />

- CommonClassLoader：Tomcat最基本的类加载器，加载路径中的Class对Tomcat本身和每个WebApp可见
- CatalinaClassLoader：Tomcat的容器私有类加载器，加载路径中的Class对WebApp不可见
- SharedClassLoader：Tomcat的共享类加载器，加载路径中的Class可以被每个WebApp可见，但是对Tomcat不可见
- WebAppClassLoader：各个WebApp的私有类加载器，加载路径中的Class仅对当前WebApp可见

> CommonClassLoader能加载的类都可以被`Catalina ClassLoader`和`SharedClassLoader`使用，从而实现了公有类库的共用，而`CatalinaClassLoader`和`Shared ClassLoader`自己能加载的类则与对方相互隔离。
> WebAppClassLoader可以使用`SharedClassLoader`加载到的类，但各个`WebAppClassLoader`实例之间相互隔离。