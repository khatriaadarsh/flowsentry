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
