---
title: JVM类加载器与双亲委派模型
date: 2021-07-02
tags: ['#JVM']
---

### 本文目录
<!-- toc -->

    
# 引言
> 在上文[JVM-类加载机制](https://imchenway.com/2021/07/01/JVM-类加载机制)中，描述了在`java`命令执行后，JVM类加载的整个流程。
> - 在上文中可以看到ClassLoader在`java`命令执行后起到了承上启下的重要作用
> - 那么JVM中的ClassCloader是如何运行的呢？本文将带你揭开它神秘的面纱

# JVM类加载器
## 什么是类加载器？
虚拟机的设计团队把类加载阶段中的“通过类的全限定名去找到对应的Class文件”这个动作放到Java虚拟机的外部去实现，为了便于让应用程序自己决定如何去获取所需要的类，实现这个动作的代码模块就叫做“类加载器”。

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
    }
}
```
输出：
```
class com.imchenway.classload.ClassLoaderTest
false
```

## 类加载器是如何去加载类的？
### 双亲委派模型
- 从Java虚拟机的角度来说，只存在两种不同的类加载器，一种是启动类加载器，使用C++实现，是虚拟机自身的一部分；另一种就是所有其他的类加载器，都是由Java实现的，全部都继承自抽象类`java.lang.ClassLoader`。
- 从Java开发人员的角度来说，类加载器主要分为：
  - 启动类加载器（BootStrap ClassLoader）：负责将存放于`<JAVA_HOME>\lib`目录中的，或者被`XbootClasspath`参数指定路径的类库加载到虚拟机内存中。
  - 扩展类加载器（Extension ClassLoader）：负责将存放于`<JAVA_HOME>\lib\ext`目录中的，或者被`java.ext.dirs`系统变量所指定的类库。
  - 应用程序类加载器（Application ClassLoader）：负责将用户类路径（classPath）上所指定的类库
  - 除了以上三种类加载器外，我们还可以自定义类加载器。（TODO 如何使用自定义类加载器实现类加载？）

### 双亲委派模型工作过程
![](/images/posts/双亲委派模型.png)
<a><img align="left" width="300px" src="/images/posts/双亲委派模型.png" /></a>


# 本文总结

# 相关问题