# FlowSentry

FlowSentry is an incident-response dashboard for investigating service disruptions across an integration flow. It includes sample incidents, service-health signals, diagnostic endpoints, a rule-based diagnosis engine, and optional Gemma-powered analysis.

## Getting started

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The application works without credentials using deterministic rules. To enable optional Gemma analysis, set `GOOGLE_GEMINI_API_KEY` in `.env.local` (the legacy `GEMINI_API_KEY` name is also accepted). `GEMMA_MODEL` can select another compatible model; it defaults to `gemma-4-26b-a4b-it`. Never expose the key through a `NEXT_PUBLIC_` variable.

## Features

- Incident list with search and status filtering.
- Service health view and incident activity timeline.
- Diagnostic checks for latency, database connections, logs, and dependencies.
- Optional AI-assisted root-cause summary and recommended response steps.
- Copyable incident report.

## API

- `GET /api/incidents` — returns the sample incident collection.
- `GET /api/tools` — returns available diagnostic tools.
- `POST /api/tools` — runs a tool. Body: `{ "incidentId": "INC-2847", "toolId": "connections" }`.
- `POST /api/analyze` — diagnoses an incident. Body: `{ "incidentId": "INC-2847" }`.

## Development

```bash
npm run lint
npm test
npm run build
```

Incident and service examples are stored in `data/`. Diagnostic logic and optional model integration are in `lib/`.

## Note

This repository is a demonstration app with static sample data. It does not connect to production services or execute remediation actions.
