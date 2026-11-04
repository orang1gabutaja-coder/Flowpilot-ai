# Flowpilot AI

**Flowpilot AI** is an open-source workflow orchestrator designed to help AI models work together efficiently. It breaks a large request into smaller tasks, prepares context, routes work to suitable AI providers, and checks the results.

> Project status: early MVP foundation. AI provider integrations and persistent memory are planned, not implemented yet.

## Goals

- Break complex requests into manageable steps (Planner).
- Route each step to an appropriate model or tool (Router).
- Run steps and collect their outputs (Executor).
- Review outputs before returning a result (Reviewer).
- Reuse relevant context without sending the entire conversation every time.
- Track token usage and estimated cost when provider data is available.

## Current MVP

The first version accepts a task, turns it into an ordered checklist, and returns the workflow as structured JSON. The first planner is local and does not call an AI API yet.

## Run locally or on Replit

Requires Node.js 20 or newer.

```bash
npm install
npm start
```

Check `GET /health`. Create a workflow with `POST /api/workflows` and JSON body `{"task":"Build a simple personal portfolio website"}`.

## Project structure

- `src/server.js` — HTTP API.
- `src/planner.js` — task-to-step planning logic.
- `test/planner.test.js` — automated tests.
- `docs/ARCHITECTURE.md` — system design.
- `docs/ROADMAP.md` — development milestones.

## Safety and privacy

Do not commit API keys, passwords, access tokens, or private user data. Provider credentials should be stored as environment secrets when integrations are added.

## Contributing

Issues and pull requests are welcome. See the roadmap before choosing a feature.
