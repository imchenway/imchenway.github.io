---
title: ForkJoinPool 并行计算模式与调优
date: 2018-07-05
tags: ['#Java', '#Concurrency']
categories:
  - Java
  - Concurrency
---

### 本文目录
<!-- toc -->

# ForkJoinPool 核心概念
ForkJoinPool 基于工作窃取算法，高效支持细粒度任务拆分。`ForkJoinTask`、`RecursiveTask` 与 `RecursiveAction` 是开发者使用的主要抽象。

# 常见模式
- **分治计算**：大任务拆分为子任务，计算后合并结果。
- **并行遍历**：如并行数组求和、归并排序。
- **自定义任务调度**：通过 `ForkJoinPool` 提供的任务队列实现流水线。

```java
class SumTask extends RecursiveTask<Long> {
    private static final int THRESHOLD = 10_000;
    private final long[] nums;
    private final int start, end;

    SumTask(long[] nums, int start, int end) {
        this.nums = nums;
        this.start = start;
        this.end = end;
    }

    @Override
    protected Long compute() {
        int length = end - start;
        if (length <= THRESHOLD) {
            long sum = 0;
            for (int i = start; i < end; i++) sum += nums[i];
            return sum;
        }
        int mid = start + length / 2;
        SumTask left = new SumTask(nums, start, mid);
        SumTask right = new SumTask(nums, mid, end);
        left.fork();
        long rightResult = right.compute();
        long leftResult = left.join();
        return leftResult + rightResult;
    }
}
```

# 调优技巧
- 设置并行度：`ForkJoinPool pool = new ForkJoinPool(Runtime.getRuntime().availableProcessors());`
- 避免阻塞：若任务包含阻塞操作，使用 `ManagedBlocker` 或自定义线程池。
- 监控：`pool.getQueuedTaskCount()`、`getActiveThreadCount()`，结合 JFR `ForkJoinPool` 事件分析。

# 与 CompletableFuture 协同
CompletableFuture 默认使用公共 ForkJoinPool；对 IO 密集型任务可传入自定义池，避免任务阻塞公共队列。

# 自检清单
- 是否保证任务拆分粒度适中，避免过多小任务？
- 是否避免在 ForkJoin 任务中执行阻塞调用？
- 是否监控工作窃取队列长度与线程活跃度？

# 参考资料
- Java SE 8 ForkJoinPool 文档：https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ForkJoinPool.html
- Oracle ForkJoin Framework 指南：https://docs.oracle.com/javase/tutorial/essential/concurrency/forkjoin.html
- JEP 155: Concurrency Updates：https://openjdk.org/jeps/155
