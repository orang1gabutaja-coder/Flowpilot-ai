# Flowpilot AI — Architecture (MVP)

## Core pipeline

```text
User request
    |
    v
Planner ---> ordered task steps
    |
    v
Router ----> choose a provider/tool for each step (planned)
    |
    v
Executor --> run steps and collect outputs (planned)
    |
    v
Reviewer --> check completeness and quality (planned)
    |
    v
Final response
```

## Components

- **Planner:** converts one large request into small, ordered steps. The current implementation is deterministic and provider-free.
- **Router:** will select a model or tool based on task type, capability, latency, and cost.
- **Executor:** will run each step and record its status and output.
- **Reviewer:** will check whether the result satisfies the original request and request targeted retries when needed.
- **Context manager:** will select only relevant prior information for each step instead of forwarding the entire conversation.
- **Provider adapters:** will give different AI services a common interface, so the core does not depend on one vendor.
- **Usage tracker:** will record token counts and provider-reported costs when available.

## Design principles

1. Keep each component small and replaceable.
2. Keep provider credentials on the server, never in browser code or Git.
3. Pass structured data between components.
4. Store only the context needed for the current step.
5. Make execution status and errors visible.
6. Start with a working local MVP before adding complex AI integrations.

## Current implementation boundary

Version 0.1.0 implements the HTTP health endpoint and a basic workflow-planning endpoint. It does not yet call external AI APIs, execute tools, persist workflows, or calculate real token costs.
