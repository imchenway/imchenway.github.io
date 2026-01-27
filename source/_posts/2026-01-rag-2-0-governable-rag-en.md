---
title: "RAG 2.0: From Vectors to Structured Knowledge, Graphs, and Permission-Aware Retrieval"
date: 2026-01-27
lang: en
lang_ref: rag-2-0-governable-rag
permalink: en/rag-2-0-governable-rag/
tags: ['#RAG', '#Search', '#Database', '#Architecture', '#AI']
---

### Table of Contents
<!-- toc -->

# 1. Why “vector‑only RAG” breaks in production
Most teams start RAG (Retrieval‑Augmented Generation) with the shortest path to a demo:
1) chunk documents and embed them,  
2) run vector search for Top‑K,  
3) stuff the chunks into the prompt,  
4) let the model answer.

This works—until it becomes a real product. In production, failures repeat in predictable ways, and they rarely come from the LLM being “not smart enough”. They come from treating retrieval as a single step instead of a governed system.

The most common failure modes look like this:

- **Lexical precision is missing**: queries like “error code E1234”, “INC‑20391”, or “billing‑api” are often better served by classic inverted indexes and BM25‑style ranking than pure semantic similarity.[1][2]
- **Semantically relevant, factually wrong**: the retrieved chunk is “about the topic” but not the authoritative source for the exact threshold, owner, date, or version—so the model fills gaps.
- **Freshness is unknowable**: documents changed, indexes lagged, and nobody can answer “which data version backed this response?” without digging through logs.[5]
- **Permissions leak through the retrieval layer**: the worst outcome is not a wrong answer—it is a correct answer based on evidence the user should never see.[4]
- **No explainability, no replay**: users cannot verify, engineers cannot reproduce, and regressions cannot be tested when evidence is not traceable.

If you zoom out, the key lesson is simple: RAG is not “feeding docs to a model”. RAG is building a retrieval product—where data quality, security, and operational discipline matter as much as prompts.

# 2. What “RAG 2.0” means: retrieval as a governed data product
When I say “RAG 2.0”, I mean one thing: **treat retrieval as a pipeline you can measure, evolve, audit, and roll back**.

The goal is not occasional brilliance. The goal is consistent behaviour under real constraints:

1) **Grounded correctness**: answers are supported by evidence and show citations.  
2) **Freshness**: you can state the dataset/index version and control indexing lag.  
3) **Security**: permissions are enforced before evidence enters the model context.  
4) **Operability**: runs are observable and replayable, with clear regression gates.

A practical pipeline mental model is:

```text
User question
  -> Candidate retrieval (BM25 / vectors / SQL / graph)
  -> Permission & policy filtering (tenant/role/ACL/sensitivity)
  -> Rerank + context packaging (dedupe, summarise, budget)
  -> Generation (citations, confidence signals, ask/decline when needed)
```

This structure stays stable even as you swap tools, models, or indexing strategies.

# 3. The unified retrieval pipeline: Retrieve / Filter / Rerank / Ground
RAG 2.0 is less about “which vector store” and more about having a pipeline where each stage can be owned and improved independently.

## 3.1 Retrieve: multi‑channel candidates, not one magic query
Candidate retrieval works best when you treat it as multiple parallel channels:
- **BM25 / inverted index** for exact terms, identifiers, product names, short queries—Lucene/Elasticsearch are the canonical implementations.[1][2]
- **Vector search** for paraphrases, “how do I…” queries, and semantic recall; pgvector is a pragmatic way to keep vectors close to relational data.[3]
- **SQL / structured lookups** for facts that should not be inferred (status fields, thresholds, owners, flags).
- **Graph queries (optional)** for relationship problems (dependencies, ownership, impact chains).[6]

## 3.2 Filter: enforce permissions and policies early
Filtering is not a cosmetic step. It must guarantee two invariants:
1) **Unauthorised evidence never enters the prompt** (if the model sees it, it can leak it).  
2) **Filtering decisions are explainable and auditable** (why was a record included/excluded?).

In practice, “Filter” tends to include:
- **Authorisation**: tenant/role/ACL/row‑level policies.[4]  
- **Security policies**: sensitivity level, PII, secrets, residency constraints.  
- **Business policies**: only published docs, only latest versions, only approved sources.

## 3.3 Rerank: turn “relevant” into “usable”
Even a good candidate set is noisy. Rerank and packaging should explicitly handle:
- **Deduplication and document‑level grouping**: multiple chunks from one document should become one “evidence bundle” with a clean citation.
- **Noise control**: downrank background paragraphs; upweight steps, rules, thresholds, and “single‑source‑of‑truth” sections.
- **Budgeting**: enforce a fixed context budget and keep the rest as links/references rather than raw tokens.

## 3.4 Ground: citations + replayable metadata
A minimal grounded system should:
- attach 1–3 citations to key claims (title/ID/link + short excerpt/summary),
- log retrieval metadata (`query`, `index_version`, `doc_ids`, scores, filter reasons),
- support replay: reconstruct “what the model saw” for debugging and regression tests.

# 4. Hybrid retrieval: BM25, vectors, SQL, and graphs have different jobs
Hybrid retrieval is not a buzzword—it is acknowledging that “knowledge” has different shapes. A stable division of labour looks like this:

| Query pattern | Primary channel | Secondary channel | Why it works |
| --- | --- | --- | --- |
| IDs, error codes, proper nouns | BM25 | vectors | Precision first, semantics as a fallback.[1][2] |
| Paraphrases, “how do I…” | vectors | BM25 | Semantic recall first, lexical constraints second. |
| Hard facts (status/threshold/owner/time) | SQL | text | Don’t force the LLM to infer structured fields. |
| Relationship chains (deps/ownership/impact) | graph/CMDB | text | Relationships are more reliable than prose.[6] |

A useful rule: **if the answer is a structured field, fetch it as a structured field**. That is cheaper, more stable, and more auditable than prompting the model to “figure it out from text”.

# 5. Freshness and consistency: version your indexes and plan rollbacks
Once users depend on RAG, freshness becomes your hardest SLA. The fix is to treat indexing as a versioned artifact.

## 5.1 Track versions, watermarks, and source timestamps
At minimum, log:
- `index_version` (build or incremental version),
- a `watermark` (latest synced position from the source),
- `source_updated_at` (document last updated time).

When an answer is wrong, you can now ask the right questions:
1) Which index version served this response?  
2) What source record/version did the evidence come from?

## 5.2 Use CDC for incremental updates where it matters
For system‑of‑record data in databases, CDC (Change Data Capture) is often the cleanest path to reliable incremental indexing. Debezium is a widely used implementation for capturing changes and driving downstream pipelines.[5]

You do not need CDC everywhere on day one, but you should design for:
- upserts and deletes,
- retries and idempotency,
- and, critically, **rollback** to a previous known‑good index version when ingestion goes wrong.

# 6. Permission‑aware retrieval: don’t confuse “post‑filtering” with “security”
Permissions are where RAG stops being “search” and becomes “production software”.

## 6.1 Make permissions representable at the retrieval layer
Three common approaches (from strongest isolation to most shared) are:
1) **Physical isolation**: per‑tenant index/database.  
2) **Logical isolation with enforced filters**: store `tenant_id`/ACL tags and apply mandatory filters in the retrieval query (not after results return).  
3) **Row‑level security in the data source**: push access control down to the database so retrieval can only fetch authorised rows; PostgreSQL RLS is a concrete mechanism here.[4]

## 6.2 Permissions also include “inference risk”
Even when results are filtered, systems can leak side‑channels (counts, score distributions, error behaviour). Security guidance for LLM applications repeatedly emphasises designing with auditability and policy enforcement as first‑class concerns, not as patchwork.[7][8]

# 7. Structured knowledge and graphs: when relationships beat text
Knowledge graphs are not a silver bullet. They shine when the problem is **relationships**, not paragraphs:
- service dependency chains and blast radius,
- ownership/on‑call mapping,
- version compatibility links.

Graphs are a poor fit when:
- you lack a stable entity/relationship extraction and maintenance process,
- the problem is mostly “find the right paragraph” (BM25 + vectors work fine),
- you expect graphs to replace an access‑control system (usually a trap).

If you do add a graph, treat it as another evidence channel inside the same pipeline and citation framework. Neo4j docs are a solid starting point for graph modelling and querying.[6]

# 8. Trust UX: citations, confidence signals, and refusal modes
The output of RAG is not “a paragraph”. It is a user experience where people decide whether to rely on the system.

## 8.1 Citations are the cheapest trust multiplier
A good citation includes:
- source type (doc/ticket/config row),
- a human‑recognisable identifier,
- a link or a precise locator,
- a short excerpt/summary (bounded and redacted when needed).

## 8.2 Confidence and refusal: teach the system to say “I don’t know”
You do not need perfect probability calibration to improve safety. Simple heuristics work early:
- low score separation between Top‑1 and Top‑K → ask a clarifying question,
- conflicting evidence → show the disagreement and avoid a single definitive claim,
- no evidence after permission filters → explicitly state “no authorised sources found” rather than guessing.

# 9. A practical roadmap: MVP → mature RAG
If you want RAG 2.0 to become a reusable capability, ship it in stages:

1) **MVP (1–2 weeks)**: hybrid retrieval (BM25 + vectors) + citations + basic logging (`doc_ids`, scores, `index_version`).  
2) **Permissions (2–4 weeks)**: enforce permission semantics in retrieval; add audit fields; target “unauthorised evidence in prompt = 0”.[4]  
3) **Freshness (4–8 weeks)**: incremental updates/CDC, index versioning, rollbacks; make lag measurable and alertable.[5]  
4) **Quality loop (ongoing)**: offline eval sets + online replay; dashboard metrics for citation coverage, factual correctness, refusal rate, and cost.  
5) **Graph augmentation (as needed)**: only when relationship queries demand it.[6]

Here is a minimal acceptance checklist you can drop into a design review:

```text
✅ RAG 2.0 Minimum Acceptance Checklist
- Answers include citations (human-verifiable)
- Runs are replayable: query, doc_ids, scores, index_version, filter reasons
- Permissions are enforced before evidence enters the prompt
- Index freshness is measurable (watermark/lag) and rollback exists
- When evidence is insufficient, the system asks/declines instead of guessing
```

# References
- [1] Apache Lucene docs: https://lucene.apache.org/
- [2] Elasticsearch similarity / BM25: https://www.elastic.co/guide/en/elasticsearch/reference/current/index-modules-similarity.html
- [3] pgvector (PostgreSQL vector extension): https://github.com/pgvector/pgvector
- [4] PostgreSQL Row Level Security: https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- [5] Debezium documentation (CDC): https://debezium.io/documentation/
- [6] Neo4j docs: https://neo4j.com/docs/
- [7] OWASP Top 10 for LLM Applications: https://owasp.org/www-project-top-10-for-large-language-model-applications/
- [8] NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework
