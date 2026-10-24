<<<<<<< HEAD
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
=======
# FlowSentry — AI Integration Failure Investigator

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14_App_Router-black)](https://nextjs.org/)
[![Google GenAI SDK](https://img.shields.io/badge/@google/genai-Hosted_Gemma-orange)](https://github.com/google-gemini/generative-ai-js)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC)](https://tailwindcss.com/)

**FlowSentry** is an AI-assisted diagnostic workstation designed to investigate failures across enterprise payment pipelines, integration middleware (IBM IIB/ACE simulation), message brokers, and core databases. 

By executing a controlled sequence of diagnostic tools across distributed synthetic logs, FlowSentry establishes evidence-backed root causes using Google's hosted **Gemma** model (or a transparent, deterministic Demo Mode fallback) and drafts actionable incident reports for on-call engineers.

---

## 1. Problem & Solution

* **The Problem:** When an enterprise integration pipeline breaks—such as downstream database connection starvation or corrupted message payloads clogging dead-letter queues—engineers lose hours digging through raw log files, mapping topology dependencies, and compiling post-incident briefs.
* **The Solution:** FlowSentry runs a sandboxed multi-step diagnostic workflow on server-side Next.js route handlers. It queries structured telemetry, tests dependency states, sends the evidence pool to Google's hosted Gemma model, validates that every referenced log ID actually exists, and produces a structured incident report ready for human review.

---

## 2. Simulated Architecture & Scenarios

### Topology Flow

