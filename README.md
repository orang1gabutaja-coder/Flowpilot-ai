# Flowpilot AI

**Flowpilot AI** is an open-source workflow orchestrator designed to help AI models work together efficiently. It breaks a large request into smaller tasks, prepares context, routes work to suitable AI providers, and checks the results.

> Project status: early MVP. The workflow planner and in-memory workflow lifecycle API are implemented. AI provider integrations, persistent storage, and actual task execution are not implemented yet.

## Goals

- Break complex requests into manageable steps (Planner).
- Route each step to an appropriate model or tool (Router).
- Run steps and collect their outputs (Executor).
- Review outputs before returning a result (Reviewer).
- Reuse relevant context without sending the entire conversation every time.
- Track token usage and estimated cost when provider data is available.

## Current MVP

The current version accepts a task, creates an ordered checklist, stores its workflow state in memory, and exposes endpoints to retrieve a workflow and update individual step statuses. The planner is deterministic and does not call an AI API.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm test
npm start
```

The API listens on port 3000 by default. Set the `PORT` environment variable to change it.

## API

### Health check

`GET /health`

### Create a workflow

`POST /api/workflows`

Request:
```json
{ "task": "Build a simple personal portfolio website" }
```

Returns HTTP 201 with a workflow object containing its ID, task, status, steps, and creation time.

### Retrieve a workflow

`GET /api/workflows/{workflowId}`

Returns the current workflow or HTTP 404 if it does not exist.

### Update a step

`PATCH /api/workflows/{workflowId}/steps/{stepId}`

Request:
```json
{ "status": "running" }
```

Allowed statuses: `pending`, `running`, `completed`, and `failed`. The overall workflow status is derived from its step statuses.

## Important limitations

- Workflow state is stored in process memory. Restarting the server clears all workflows.
- This version does not execute task steps or call external AI providers.
- There is no authentication or multi-user isolation yet. Do not expose this development API publicly with sensitive data.
- Token usage and provider costs are not measured yet.

## Project structure

- `src/server.js` — HTTP API.
- `src/planner.js` — deterministic task-to-step planning logic.
- `src/workflow-store.js` — in-memory workflow state management.
- `test/` — automated tests.
- `docs/ARCHITECTURE.md` — system design.
- `docs/ROADMAP.md` — development milestones.

## Safety and privacy

Do not commit API keys, passwords, access tokens, or private user data. Provider credentials must remain server-side and should be stored as environment secrets when integrations are added.

## Contributing

Issues and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) and the roadmap before choosing a feature.
