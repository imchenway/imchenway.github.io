---
title: Spring Cloud Task短任务编排
date: 2022-08-23
tags: ['#Spring']
---

### 本文目录
<!-- toc -->

# 引言
> Spring Cloud Task 用于执行一次性、短生命周期任务，如数据导入、批处理、运维脚本。结合 Spring Batch、Cloud Data Flow 可以实现任务编排。本文介绍任务模型、编排策略与监控。

# 任务模型
- Task：一次执行，状态存储在 `TaskRepository`；
- `@EnableTask`：启用 Task；
- `TaskLauncher`：启动远程任务；
- 支持与 Batch、Stream 集成。

# 编排方案
1. **独立启动**：使用 CLI、REST 或 Scheduler 运行；
2. **Spring Cloud Data Flow**：可视化编排，任务拓扑；
3. **K8s Job**：Task 启动 Kubernetes Job，执行完成即退出；
4. **事件驱动**：监听 MQ 事件触发任务。

# 实现示例
```java
@SpringBootApplication
@EnableTask
public class ImportTask {
    public static void main(String[] args) {
        SpringApplication.run(ImportTask.class, args);
    }

    @Bean
    ApplicationRunner runner(CustomerService service) {
        return args -> service.importCsv(args.getSourceArgs()[0]);
    }
}
```
- Task 完成后写入 `TASK_EXECUTION` 表。

# 监控与告警
- Micrometer 记录 `task.execution.duration`；
- 失败任务写入告警队列；
- 与 ELK 集成分析日志；
- 在 Data Flow 中配合 Prometheus Dashboard。

# 实战经验
- 在数据平台中，通过 Data Flow 分发任务到 K8s，自动扩缩；
- 与 Spring Batch 集成，实现任务链：`Task -> Batch Step -> Task`；
- 对高频任务，使用 Task 缓存镜像，减少拉取时间。

# 总结
Spring Cloud Task 为短任务提供了轻量级框架。通过与 Data Flow、K8s 等平台结合，可以构建可观测、可调度的任务编排体系。

# 参考资料
- [1] Spring Cloud Task Reference. https://docs.spring.io/spring-cloud-task/docs/current/reference/html/
- [2] Spring Cloud Data Flow. https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/
- [3] Kubernetes Jobs Docs. https://kubernetes.io/docs/concepts/workloads/controllers/job/
