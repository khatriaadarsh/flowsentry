# FlowSentry — AI Integration Failure Investigator

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14_App_Router-black)](https://nextjs.org/)
[![Google GenAI SDK](https://img.shields.io/badge/@google/genai-Hosted_Gemma-orange)](https://www.npmjs.com/package/@google/genai)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC)](https://tailwindcss.com/)

**FlowSentry** is an AI-assisted diagnostic workstation designed to investigate service disruptions across enterprise integration middleware, payment pipelines, message brokers, and core databases.

By executing a controlled sequence of diagnostic tools across structured telemetry, FlowSentry detects likely root causes using Google's hosted **Gemma** model (`gemma-4-26b-a4b-it`) or an automatic, deterministic **Demo Mode** fallback. It validates that every cited log ID is factual and drafts structured incident reports ready for human review.

---

## 1. Problem & Solution

* **The Problem:** When an enterprise integration pipeline breaks—such as database connection pool exhaustion or unparseable messages backing up queues—on-call engineers lose critical time manually correlating fragmented logs, tracing topology dependencies, and assembling post-incident reviews.
* **The Solution:** FlowSentry runs a safe, multi-step diagnostic workflow on server-side Next.js route handlers. It queries structured telemetry, evaluates upstream and downstream dependencies, sends retrieved evidence to Google's hosted Gemma API, enforces strict schema and log ID verification, and produces an actionable incident report.

---

## 2. Simulated Architecture & Scenarios

### Topology Flow

```text
[ Payment API ] ──▶ [ IBM IIB / ACE ] ──▶ [ Message Queue (MQ) ] ──▶ [ Banking Service ] ──▶ [ Core Settlement DB ]
