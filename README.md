# ArchPilot — Agentic Architecture & Deployment Decision Platform

An interactive, single-page React/Vite enterprise workbench that helps a team pick the
right **application architecture** for an agentic AI system *and* the right **production
deployment stack** to run it on — in one tool, with consistent reasoning end to end.

## What's inside

| Section | Purpose |
|---|---|
| **Decision Workbench** | Describe the business problem, set project context (cloud, scale, governance, delivery, data profile, team skills), and get a 10-layer architecture blueprint (UI, orchestration, model routing, data/semantic, API, memory, identity, observability, runtime, async jobs) with rationale, trade-offs, and an editable technology choice per layer. |
| **Deployment Stack Guide** | Reference guide to 9 production deployment patterns (A–I: Streamlit/Gradio hosting → PaaS → serverless containers → split frontend/API → VM + Compose → functions/workflows → managed agent runtimes → managed hyperscaler containers → Kubernetes), each with vendor options, ownership map, mandatory/good-to-have prerequisites, system diagram, cost/latency notes, trade-offs, implementation steps, and interview Q&A. |
| **Production Playbook** | Hands-on companion covering Docker fundamentals, a production Dockerfile, Docker Compose, env/secrets, health & graceful shutdown, CI/CD (GitHub Actions), blue/green & canary releases, and monitoring/security — with copyable code blocks and a lab progression checklist. |
| **Glossary** | ~70 plain-English definitions of the deployment/architecture vocabulary used throughout the tool. |
| **Scenario Drills** | 20 scenario-based "which stack would you pick?" exercises with reveal-to-check answers, each linking back into the guide. |

The Decision Workbench automatically computes a **recommended deployment stack** from the
selected project context (via an explainable rule, not a model call) and lets you jump
straight into that stack's detail page in the Deployment Stack Guide — tying the "what to
build" decision to the "how to run it" decision.

## Run locally

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Build check:

```bash
npm run build
```

## Project structure

```
src/
  main.jsx            entry point
  App.jsx             shell: sidebar nav, topbar, view switcher
  views/
    Workbench.jsx      Decision Workbench
    StackGuide.jsx      Deployment Stack Guide (A–I)
    Production.jsx      Production Playbook
    Glossary.jsx
    Scenarios.jsx
  data/
    stacks.js           9 deployment stacks + recommendation heuristic
    glossary.js
    scenarios.js
    production.js        containerization/CI-CD/release content
  components/
    CodeBlock.jsx        copy-to-clipboard code snippet component
  styles.css
```

## Important limitation

This is a front-end demo with local rule-based behavior. It does not call an LLM, query a
live architecture catalog, validate vendor availability, connect to identity or
observability systems, or persist data to a backend. The fit indicator and recommended
deployment stack are illustrative and must not be represented as an AI confidence score.
Production implementation should add an API/backend, authenticated users, curated
architecture patterns, deterministic policy gates, model routing, evaluation, audit
trails, and human approval.
