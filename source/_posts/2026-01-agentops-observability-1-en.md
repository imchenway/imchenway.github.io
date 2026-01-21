---
title: "Agent Observability (AgentOps) Part 1/3: Turn Prompts, Tools, and Memory into Traces"
date: 2026-01-21
lang: en
lang_ref: agentops-observability-1
permalink: en/agentops-observability-part-1/
tags: ['#Observability', '#OpenTelemetry', '#AIInfrastructure', '#SRE', '#Tracing']
---

### Table of Contents
<!-- toc -->

# 1. Why Agents Need Observability (Not Just Better Prompts)
When teams move from a monolith to distributed systems, the biggest shift is not code size—it is **loss of visibility**. A single request fans out across services, queues, caches, and databases. Debugging by intuition stops working, so we lean on logs, metrics, and traces to answer three simple questions:

- **What happened?** What steps did the request actually take?  
- **Why did it happen?** Which dependency or decision caused the outcome?  
- **How do we fix it safely?** Did the change improve correctness without blowing up latency or cost?

Agent systems amplify the “black box” problem. A user-visible “one response” may involve planning, retrieval, multiple tool calls, retries, safety filters, fallbacks, and even human handoffs. Without observability, you will repeatedly hit the same failure modes:

- “Occasional hallucinations” or wrong tool executions with no way to reconstruct the decision path.
- Sudden cost spikes (tokens, retrieval, external APIs) without knowing which workflows or tenants caused them.
- Prompt or policy changes that “feel better” but lack measurable regression gates and risk controls.

This is the first principle of AgentOps: **treat an agent run like a production pipeline**—each prompt render, retrieval step, tool call, and model inference should be traceable, aggregatable, alertable, and reviewable.

This series is planned as three parts:
1) **Foundations (this post)**: what to observe + a unified Trace/Metrics/Logs model  
2) **Implementation**: a minimal MVP for instrumentation, dashboards, alerts, and replay  
3) **Operations**: connecting observability to SLOs, security audits, and postmortems

# 2. What to Observe: A Practical Inventory
Classic services observe HTTP latency, DB queries, cache hit rates, and queue depth. Agents need explicit telemetry for “reasoning-time” operations; otherwise you are stuck guessing the process from the final output.

Break an agent run into six observable domains:

1) **Task / Session entry**
   - who/when (user/tenant/channel), what intent (task_type), and what “success” means

2) **Context assembly**
   - prompt template + version, variable rendering, truncation/compression, safety sanitisation

3) **Retrieval / RAG**
   - query generation, search/rerank, document hits, score distributions, permission filtering

4) **Tools / Actions**
   - tool name, latency, error rate, retries, and dependency failure patterns (redacted inputs/outputs)

5) **Model inference**
   - model/version, token usage, latency, refusals/safety blocks, routing rationale

6) **Policies / Guardrails**
   - what triggered (budget, safety, permission), what action was taken (downgrade, retry, handoff)

With this inventory, you can finally attribute “latency/cost/quality/risk” to concrete stages.

# 3. Trace Model: Represent an Agent Run as a Span Tree
The most practical approach is to model an agent run as a distributed trace: **one root span + many child spans**. You do not need perfect standardisation on day one, but you must ensure:

1) **Correlation**: everything ties back to the same run (`trace_id`, `session_id`)  
2) **Aggregation**: key fields support slicing (model/tool/tenant/task_type)  
3) **Replay**: enough redacted context exists to reconstruct critical paths

If you need a mental model, imagine a support agent that “looks fine” at the UI level but keeps producing expensive runs. Without traces, your team will argue about whether the model is “worse lately”. With traces, you can see the actual culprit: retrieval is returning low-confidence results, so the planner loops; a tool call is timing out and retrying; or a policy keeps downgrading to a smaller model and forcing extra turns.

One practical naming tip: treat a single end-to-end user interaction as a **session**, and a single attempt to complete the task as a **run**. Use stable identifiers:
- `session_id`: groups multiple runs and user turns into a conversation-level unit.
- `run_id`: unique per attempt; useful when the same session retries or forks.
- `trace_id`: your distributed tracing glue; it should cover every step inside a run (including asynchronous tool executions).

Example trace shape (plain text):

```text
agent.run (root)
├── prompt.render
├── guardrail.input_sanitize
├── retrieval.query_generate
├── retrieval.search
├── retrieval.rerank
├── model.infer (planner)
├── tool.call (jira.createTicket)
├── tool.call (payments.refund)
├── model.infer (final)
└── guardrail.output_filter
```

Two extra techniques make traces more useful in agent systems:

- **Span events for decisions**: record “why” as structured events (e.g., `route.selected`, `guardrail.triggered`) instead of hiding reasoning in free-form logs.
- **Links for retrieval evidence**: when you retrieve documents or memories, attach lightweight references (IDs, versions, hashes) so you can explain outputs without storing raw content in every span.

## 3.1 Suggested Span Attributes (Example)
To answer “what is slow/expensive/flaky”, each span type needs a minimal set of groupable attributes. Example (illustrative only):

```json
{
  "trace_id": "…",
  "session_id": "…",
  "tenant_id": "acme",
  "task_type": "support_ticket",
  "step": "model.infer",
  "model.name": "…",
  "model.version": "…",
  "tokens.input": 1234,
  "tokens.output": 456,
  "cost.usd": 0.0123,
  "latency.ms": 850,
  "retry.count": 1,
  "policy.downgraded": false
}
```

The key is to treat **cost and quality as first-class signals**, not afterthoughts. Agents are “trade-off engines”, not pure compute.

Design attributes with care to avoid self-inflicted telemetry outages:

- Prefer **low-cardinality dimensions** for slicing: `tenant_id`, `task_type`, `tool.name`, `model.name`.
- Avoid high-cardinality fields (raw prompts, full queries, user IDs) in metrics labels or span attributes. Use **hashes** or store data in a secure vault and keep only pointers in telemetry.
- Stamp versions everywhere: `prompt_version`, `policy_version`, `tool_schema_version`. When an incident happens, “what changed?” is the fastest path to a fix.

## 3.2 What to Record (and What Not to)
Observability is not “store everything forever”. Use tiering:

- Always: timings, model/tool/retrieval dimensions, error codes, retry counts  
- Sampled: rendered prompts, retrieved snippets, tool payload summaries (redacted)  
- Never: raw PII, secrets, complete business payloads, unredacted user inputs without controls

In practice, teams often use a three-tier storage model:

1) **Telemetry store (hot)**: spans, metrics, and structured logs; fast queries; short retention.  
2) **Replay store (secure)**: encrypted, access-controlled, and TTL-limited artefacts (prompt renders, retrieval snapshots, tool payload summaries).  
3) **System of record (business data)**: your normal databases; do not duplicate sensitive payloads into observability systems.

Align these rules with governance frameworks (for example, NIST AI RMF and the OWASP LLM Top 10).

# 4. Metrics: Unify SLOs, Cost Budgets, and Quality Signals
Traces answer “why this run failed”. Metrics answer “what is trending and when to page someone”. For agent systems, start with four metric groups:

1) **Latency and reliability**
   - end-to-end P50/P95/P99, success rate (separate “good answer” vs “action succeeded”), tool failure/retry rates

2) **Cost and resources**
   - token distributions and per-run cost, retrieval cost, external API costs, cache hit rate and savings

3) **Quality (start with weak supervision)**
   - user feedback, sampled human pass rate, eval-based factual error rate, citation coverage rate

4) **Risk and guardrails**
   - safety block rate, permission denial counts, downgrade/handoff rates and recovery time

One operational nuance: “success” for agents is multi-layered. A run can be technically successful (no exceptions) but still unacceptable (wrong answer, wrong action, unsafe output). Many teams separate SLIs:

- **Action SLI**: was the intended tool action executed correctly? (refund created, ticket opened, email sent)
- **Answer SLI**: was the response acceptable? (human pass rate, eval score, user satisfaction)
- **Budget SLI**: did the run stay within latency/cost envelopes? (token caps, per-run cost ceilings)

Once you define SLIs, you can adopt classic SRE practices like error budgets and burn rates: treat “bad answers” and “budget violations” as first-class budget consumers, not merely “ML quirks”.

Once metrics and traces share the same dimensions, you can answer: “Is cost rising because tools are retrying, or because retrieval quality dropped and the agent is looping?”

# 5. Logs and Audits: Replayable, Accountable, and Redacted
Treat agent logs as two layers:

1) **Runtime logs (ops view)**: timeouts, dependency faults, retries, quota triggers  
2) **Decision logs (governance view)**: why a model/tool was chosen, why a policy fired, why a downgrade happened

Decision logs should be structured and bound to `trace_id`. A practical minimal schema:

- trace_id / session_id / tenant_id / task_type
- planner decision summary (redacted)
- tool selection rationale (rule hit / model judgement / human override)
- guardrail hits (rule_id, severity, action)
- version stamps: prompt_version / policy_version / tool_schema_version

This turns postmortems from “opinions” into “facts”.

Two guardrails that matter in real organisations:

- **Redact at collection time** when possible. If you rely on “query-time masking”, someone will eventually run the wrong query.  
- **Scope access by role**. Ops engineers may need timings and error codes; security reviewers may need policy hits; only a small group should access replay artefacts.

# 6. A One-Week MVP: Make the Black Box Transparent
If you are starting from zero, ship an MVP before building an “agent platform”. A one-week MVP can achieve:

1) every run has a trace_id with a span tree  
2) model/tool/retrieval spans support basic aggregation (“slowest”, “most expensive”, “most failures”)  
3) critical paths are replayable (prompt version + retrieved references + tool calls)

Acceptance checklist:
- [ ] `agent.run` records tenant_id, task_type, final status (success/failed/downgraded/handoff)
- [ ] every `tool.call` has tool.name, latency, status_code, retry.count (payloads redacted)
- [ ] every `model.infer` has model.name, tokens in/out, latency, cost (if available)
- [ ] `retrieval.search` includes index_version, top_k, hit count, filtered count (auth)
- [ ] guardrail hits are traceable: rule_id, action, severity

Common pitfalls to avoid in the first week:

- You generate a `trace_id` but lose it at the first async boundary (queue, background worker, tool runner).
- You log raw prompts and user payloads “temporarily”, and they stay forever in the log lake.
- Your metrics explode in cardinality because you tag everything with user_id or raw query text.
- You can see tool failures but not the *tool schema version*, so you cannot correlate breakage with schema changes.

# 7. What’s Next
This post introduced a practical inventory plus a unified Trace/Metrics/Logs model, with one goal: **turn agent runs into explainable pipelines**.

In Part 2, I will make this concrete: how to instrument an agent workflow with an OpenTelemetry mindset, build dashboards and alerts without creating a “platform tax”, and implement safe replay patterns.

# References
- OpenTelemetry docs: https://opentelemetry.io/docs/  
- OWASP Top 10 for LLM Applications: https://owasp.org/www-project-top-10-for-large-language-model-applications/  
- NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework  
- Kubernetes docs (background on production observability patterns): https://kubernetes.io/docs/
