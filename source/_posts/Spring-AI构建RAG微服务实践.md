---
title: Spring AI构建RAG微服务的最佳实践
date: 2022-05-25
tags: ['#Spring']
---

### 本文目录
<!-- toc -->

# 引言
> Spring AI 项目为构建 LLM 驱动应用提供了统一的抽象。基于 Retrieval-Augmented Generation (RAG) 的微服务需要整合向量数据库、模型推理与检索策略。本文分享 Spring AI 在 RAG 场景的架构方案。

# Spring AI 基础
- `ChatClient`：统一模型调用接口，支持 OpenAI、Azure、Ollama 等；
- `VectorStore`：抽象向量存储，支持 Pgvector、Milvus、Redis；
- `PromptTemplate`、`Prompt`：动态构建提示词；
- `Observation`：集成 Micrometer 观测。

# RAG 架构
1. **知识入库**：分段文本 → Embedding → 写入 VectorStore；
2. **查询流程**：用户问题 → Embedding → 向量检索 → 构造 Prompt → 模型生成；
3. **检索增强**：可使用多路检索（BM25 + 向量）；
4. **缓存**：对重复问答使用缓存，减少调用次数。

# Spring AI 实现示例
```java
@Service
public class RagService {
    private final ChatClient chatClient;
    private final VectorStore vectorStore;

    public RagService(ChatClient chatClient, VectorStore vectorStore) {
        this.chatClient = chatClient;
        this.vectorStore = vectorStore;
    }

    public String answer(String question) {
        List<Document> docs = vectorStore.similaritySearch(question, 5);
        Prompt prompt = PromptTemplate
            .from("基于以下内容回答用户问题: {context}\n问题: {question}")
            .create(Map.of("context", docs, "question", question));
        return chatClient.call(prompt).getResult().getOutputContent();
    }
}
```

# 数据与安全
- 向量库可使用 PostgreSQL + pgvector，结合 Liquibase 管理 schema；
- 敏感数据脱敏、分类存储；
- 对外接口加入 API Key、租户隔离；
- 监控请求上下文，记录模型输出。

# 运维
- Micrometer 记录请求耗时、Token 使用量；
- Prometheus + Grafana 监控模型响应和错误率；
- 统一日志附带 `TraceId`、`PromptId`；
- 定期回放问答，对模型输出做质量评估。

# 最佳实践
- 构建知识库 ETL，保证数据时效；
- 采用 `Prompt Guardrail`，校验输出符合策略；
- 利用 Spring Retry 对模型超时重试；
- 引入缓存（Redis、Caffeine）降低 API 调用成本；
- 对高并发场景考虑批量检索、流式输出。

# 总结
Spring AI 提供了 RAG 微服务的基础设施。通过向量存储、统一模型接口和观测体系，可以快速构建可维护的智能问答服务。

# 参考资料
- [1] Spring AI 项目文档. https://docs.spring.io/spring-ai/reference/
- [2] Retrieval-Augmented Generation Survey. https://arxiv.org/abs/2005.11401
- [3] pgvector 官方文档. https://github.com/pgvector/pgvector
