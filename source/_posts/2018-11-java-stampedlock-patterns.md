---
title: Java StampedLock 模式：读写乐观锁的正确使用
date: 2018-11-05
tags: ['#Java', '#Concurrency']
categories:
  - Java
  - Concurrency
---

### 本文目录
<!-- toc -->

# StampedLock 简介
`StampedLock` 提供乐观读、悲观读、写三种模式。乐观读无需锁住共享资源，但在写入发生时需要回退为悲观读。

# 核心 API
- `long stamp = lock.tryOptimisticRead()`：乐观读；
- `lock.validate(stamp)`：验证期间是否发生写入；
- `long stamp = lock.readLock()` / `unlockRead(stamp)`：悲观读；
- `long stamp = lock.writeLock()` / `unlockWrite(stamp)`：写锁。

# 模式示例
```java
class Point {
    private double x, y;
    private final StampedLock lock = new StampedLock();

    double distanceFromOrigin() {
        long stamp = lock.tryOptimisticRead();
        double currentX = x, currentY = y;
        if (!lock.validate(stamp)) {
            stamp = lock.readLock();
            try {
                currentX = x;
                currentY = y;
            } finally {
                lock.unlockRead(stamp);
            }
        }
        return Math.hypot(currentX, currentY);
    }

    void move(double deltaX, double deltaY) {
        long stamp = lock.writeLock();
        try {
            x += deltaX;
            y += deltaY;
        } finally {
            lock.unlockWrite(stamp);
        }
    }
}
```

# 实战建议
- 乐观读适合读多写少场景，且读取操作需要很快完成；
- 若乐观读失败率高，直接使用悲观读避免自旋；
- 支持读锁升级：`long stamp = lock.tryConvertToWriteLock(readStamp);`。

# 注意事项
- `StampedLock` 不支持可重入；
- 避免在锁内调用可抛异常的方法而未释放锁；
- 线程中断不会自动释放写锁，需要手动处理；
- 与 `LockSupport.parkNanos` 配合可实现超时控制。

# 监控
- 使用 JFR `Java Monitor`、`Thread Dump` 观察锁等待；
- Micrometer 记录锁等待时间，分析乐观读失败率。

# 自检清单
- 是否评估乐观读失败率并落地度量？
- 是否避免在锁范围内进行耗时操作？
- 是否为写锁获取失败设置超时或降级策略？

# 参考资料
- Java SE 8 API - StampedLock：https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/StampedLock.html
- Oracle Concurrency Tutorial - StampedLock：https://docs.oracle.com/javase/tutorial/essential/concurrency/locksync.html
- "Java Concurrency in Practice" 补充材料
