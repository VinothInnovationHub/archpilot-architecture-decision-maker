// Nine production deployment patterns for agentic / AI applications.
// Content distilled into a single reference used by both the Decision Workbench
// (automatic recommendation) and the Deployment Stack Guide (full reference).

export const stacks = [
  {
    id: 'A',
    name: 'Streamlit / Gradio Hosted',
    tagline: 'Fastest demo & internal-tool path',
    badges: { usage: 'Hobby / Demo / tiny internal', enterprise: 'Low', solo: 'Very High', cost: '$0–Low', complexity: 'Very Low' },
    scores: { demo: 5, department: 2, enterprise: 1, missionCritical: 1, scalability: 1, longRunning: 2, eventDriven: 1, governance: 1, observability: 2, opsSimplicity: 5, costEfficiency: 5, cloudFlexibility: 5 },
    strengths: ['Fastest path to a live demo', 'Near-zero infrastructure cost', 'Zero DevOps skill required'],
    explain: 'You build the agent and a simple web screen in Python. A managed hosting service runs that Python app and gives you a URL — you do not manage a server.',
    useCases: ['Demos & hackathons', 'Classroom / training projects', 'Analyst tools & early prototypes', 'Tiny internal assistants', 'Proof-of-concept RAG/chat'],
    designCall: 'Prefer this when speed-to-demo matters more than infrastructure control, and the whole experience can live in one Python process.',
    vendors: [
      { name: 'Streamlit Community Cloud', why: 'Most beginner-friendly Streamlit host', cost: '$0-friendly' },
      { name: 'Hugging Face Spaces', why: 'Great for Gradio/Streamlit demos & model showcases', cost: '$0-friendly' },
      { name: 'Render', why: 'Can host as a simple web service', cost: 'Low-cost' },
      { name: 'Railway', why: 'Simple Git/container deploys', cost: 'Low-cost' },
    ],
    ownership: { owned: ['App Runtime', 'UI'], partial: ['Agent Orchestration', 'Observability', 'State / Memory'], external: ['Identity / Security', 'Model', 'Queue / Workers', 'Tools / MCP'] },
    mandatory: ['Agent runs as one web process', 'UI can be Streamlit/Gradio-style', 'Secrets supplied via host settings', 'Anything durable is stored outside the app process'],
    goodToHave: ['Git repo + reproducible dependency file', 'Hosted LLM API (no local GPU)', 'Small user count / modest concurrency', 'Managed DB/vector store if conversations must persist'],
    diagram: ['Browser', 'Managed Streamlit/Gradio Host', 'Python Agent Process', 'LLM + Tools', 'Optional external DB / Vector / Blob'],
    costNote: 'Usually the cheapest path; hosting may be free, but model/API usage still costs money.',
    latencyNote: 'Hosting adds little latency; the main risk is a sleeping/free app needing to wake up.',
    cons: ['Weak control over auth, private networking, workers', 'Local disk/process memory is not durable', 'Long browser/code-execution workloads are fragile', 'Not enough tenant isolation for serious platforms'],
    steps: ['Make the app run from a clean env (requirements.txt)', 'Move secrets out of code; add .env.example', 'Decide what local disk writes are safe to lose', 'Add timeouts/error handling around model & tool calls', 'Push to Git', 'Create the hosted app; select repo/branch/entry file', 'Add secrets in host settings', 'Deploy, test with a second user, test idle wake-up'],
    careful: ['Never commit secrets', "Don't assume uploaded files survive restarts", 'Limit file size & expensive tool calls'],
    interview: [
      { q: 'Why is this great for demos but weak for enterprise production?', a: 'It lacks control over auth, networking, state and scaling — all needed at enterprise scale.' },
      { q: 'What happens to local files after a restart?', a: 'They are lost — ephemeral vs durable state is the key distinction.' },
      { q: 'How would you evolve this into production?', a: 'Split UI/backend, externalize state, add auth, monitoring, and CI/CD (→ Stack B/C/D).' },
    ],
  },
  {
    id: 'B',
    name: 'Managed PaaS',
    tagline: 'Git-based small-team production',
    badges: { usage: 'Startup / Small-team production', enterprise: 'Medium', solo: 'High', cost: 'Low–Medium', complexity: 'Low' },
    scores: { demo: 4, department: 5, enterprise: 3, missionCritical: 1, scalability: 2, longRunning: 3, eventDriven: 2, governance: 2, observability: 3, opsSimplicity: 4, costEfficiency: 4, cloudFlexibility: 4 },
    strengths: ['Production-ready without an infra team', 'Built-in workers/queues for background jobs', 'Predictable low-to-medium cost'],
    explain: 'A Platform-as-a-Service runs your web app for you. Connect a Git repo, tell it how to start, and the platform handles building, restarting, routing and basic scaling.',
    useCases: ['Small-team production APIs', 'Startup backends', 'Internal business tools', 'API + worker architectures', 'Moderate-traffic agent apps'],
    designCall: 'Prefer PaaS when you want real production behavior without becoming an infrastructure team — the practical middle ground between a demo host and cloud-native architecture.',
    vendors: [
      { name: 'Render', why: 'Web services, workers, cron, Postgres, private services', cost: '$0/low-cost' },
      { name: 'Railway', why: 'Very fast Git/container deploys with databases', cost: 'Low-cost' },
      { name: 'Fly.io', why: 'Runs close to users; more infra-like control', cost: 'Low/medium' },
      { name: 'DigitalOcean App Platform', why: 'Simple managed app deployment', cost: 'Low/medium' },
    ],
    ownership: { owned: ['App Runtime', 'Observability', 'Queue / Workers'], partial: ['Agent Orchestration', 'Identity / Security', 'State / Memory', 'UI'], external: ['Model', 'Tools / MCP'] },
    mandatory: ['App fits the provider runtime/container model', 'Durable state moved to managed DB/object/vector storage', 'Request/runtime limits fit the workload (or offload to a worker)', 'Secrets configured as environment variables'],
    goodToHave: ['Health endpoint', 'Dockerfile even if buildpacks are supported', 'Managed Postgres/Redis', 'Queue + worker for long agent jobs', 'CI/CD test gate before deploy'],
    diagram: ['Client', 'PaaS Router', 'Web / API Service', 'Queue', 'Worker', 'Managed DB / Cache', 'LLM + Tools'],
    costNote: 'Inexpensive for one or two small services; grows with always-on web+worker, managed DB/Redis and observability.',
    latencyNote: 'Warm services are fast; free tiers may sleep. Keep web, DB and queue in the same region.',
    cons: ['Platform limits can become architecture constraints', 'Private networking / larger workers cost more', 'Provider-specific config creates lock-in', 'Strict compliance may need a deeper cloud architecture'],
    steps: ['Productionize packaging; add health endpoint', 'Decide one-process vs web+worker split', 'Move SQLite/local files to managed storage', 'Add Redis/queue for background work', 'Create project, connect Git repo', 'Set build/start command + health check', 'Add secrets & service env vars', 'Provision managed data services; deploy; add backups/monitoring/CI-CD'],
    careful: ['Know provider request/worker timeout rules', "Don't store durable data on ephemeral filesystem", 'Make background jobs safe if delivered more than once'],
    interview: [
      { q: 'When would you choose PaaS over Cloud Run or a VM?', a: 'When you want Git-based production with low ops burden and moderate, predictable traffic.' },
      { q: 'How do you separate synchronous from long-running work?', a: 'Queue + worker, so the web process stays responsive.' },
      { q: 'Why is local filesystem dangerous on PaaS?', a: 'Instances can restart or move at any time.' },
    ],
  },
  {
    id: 'C',
    name: 'Cloud Run + Managed State',
    tagline: 'Serverless containers for bursty APIs',
    badges: { usage: 'Production / Serverless', enterprise: 'High', solo: 'Medium–High', cost: '$0-ish–Medium', complexity: 'Low–Medium' },
    scores: { demo: 3, department: 4, enterprise: 4, missionCritical: 3, scalability: 5, longRunning: 1, eventDriven: 3, governance: 3, observability: 4, opsSimplicity: 4, costEfficiency: 4, cloudFlexibility: 3 },
    strengths: ['Autoscales automatically under bursty traffic', 'Pay only for what you use', 'Clean path to enterprise observability'],
    explain: 'You package the agent as a container. The cloud runs that container only when needed, scales copies up under load, and scales down to near-zero when idle.',
    useCases: ['Containerized APIs/UIs', 'Bursty traffic', 'Webhook workloads', 'Stateless agent services', 'Products wanting autoscaling without managing servers'],
    designCall: 'Prefer this when the agent is naturally an HTTP/API service and durable state lives outside the container — especially with irregular traffic.',
    vendors: [
      { name: 'Google Cloud Run', why: 'Canonical serverless-container option', cost: 'Usage-based' },
      { name: 'Azure Container Apps', why: 'Serverless-style managed containers on Azure', cost: 'Usage-based' },
      { name: 'AWS App Runner', why: 'Managed web/container service on AWS', cost: 'Low/medium' },
      { name: 'Fly.io Machines', why: 'Fine-grained instances with global placement', cost: 'Usage-based' },
    ],
    ownership: { owned: ['App Runtime', 'Observability'], partial: ['Agent Orchestration', 'Identity / Security', 'Queue / Workers', 'UI'], external: ['Model', 'State / Memory', 'Tools / MCP'] },
    mandatory: ['Workload can be packaged as a container', 'Request-serving component is stateless (or state is externalized)', 'Long jobs move to jobs/queues/workflows', 'App handles restarts safely'],
    goodToHave: ['Container registry + CI pipeline', 'Managed SQL/Redis/vector/object storage', 'Task queue or Pub/Sub for async jobs', 'Structured logs, tracing, revision-level metrics'],
    diagram: ['Browser / API Client', 'Serverless HTTPS Router', 'Agent Container Revision', 'Managed DB / Vector / Blob', 'Queue / Jobs / Workflows', 'LLM + Tools'],
    costNote: 'Consumption-based and often very cheap for low/bursty usage; minimum instances or managed DB/NAT create a baseline cost.',
    latencyNote: 'Main trade-off is cold-start vs cost. Minimum instances keep it warm but cost more.',
    cons: ['Local disk is not a durable state strategy', 'Cold starts can hurt interactive UX', 'Always-running/stateful loops fight the serverless model', 'Enterprise private networking/IAM add cloud complexity'],
    steps: ['Create Dockerfile; verify container locally', 'Externalize durable state and secrets', 'Add /health and graceful shutdown', 'Create registry + service identity', 'Build/push image; deploy with region/CPU/memory/concurrency', 'Attach managed DB/storage least-privilege', 'Design an async path for long tasks', 'Test cold starts/streaming; add monitoring, budgets, CI/CD'],
    careful: ["Don't assume process memory survives requests", 'Set concurrency deliberately for CPU-heavy tools', 'Watch DB connection storms when scaling out'],
    interview: [
      { q: 'Why does Cloud Run favor stateless services?', a: 'Instances are disposable and autoscaled — any instance must be able to serve any request.' },
      { q: 'How would you handle a 45-minute job?', a: 'Use jobs/task queues/workflows, not one synchronous request.' },
      { q: 'What is the minimum-instance trade-off?', a: 'Lower cold-start latency but higher baseline cost.' },
    ],
  },
  {
    id: 'D',
    name: 'Vercel Frontend + Separate Agent API',
    tagline: 'Polished frontend + independent backend',
    badges: { usage: 'Startup / Product UX', enterprise: 'Medium–High', solo: 'Very High', cost: '$0–Medium', complexity: 'Medium' },
    scores: { demo: 4, department: 4, enterprise: 4, missionCritical: 2, scalability: 3, longRunning: 2, eventDriven: 2, governance: 3, observability: 3, opsSimplicity: 3, costEfficiency: 4, cloudFlexibility: 4 },
    strengths: ['Best-in-class frontend UX and iteration speed', 'Backend scales independently of UI', 'Works with any backend stack (B/C/E/G)'],
    explain: 'Vercel hosts the website/frontend. The agent runs elsewhere (Cloud Run, Render, a VM, or a managed agent platform). The browser talks to that backend through an API.',
    useCases: ['Customer-facing AI products', 'Next.js interfaces', 'Streaming chat UX', 'Fast frontend iteration', 'Startups needing a professional web experience'],
    designCall: 'Prefer this when frontend quality/speed matters, but the agent backend needs Python, longer execution, workers, tools or infra that should not live in the frontend runtime.',
    vendors: [
      { name: 'Vercel', why: 'Primary choice for Next.js frontend', cost: '$0/paid tiers' },
      { name: 'Netlify', why: 'Strong frontend/Jamstack alternative', cost: '$0/paid tiers' },
      { name: 'Cloudflare Pages', why: 'Global frontend delivery + Workers ecosystem', cost: '$0/low-cost' },
      { name: 'Backend: Cloud Run / Render / VM / Agent Runtime', why: 'Pair with any backend stack (C, B, E, or G)', cost: 'Varies' },
    ],
    ownership: { owned: ['UI'], partial: ['Identity / Security', 'Observability'], external: ['Agent Orchestration', 'App Runtime', 'Model', 'Queue / Workers', 'State / Memory', 'Tools / MCP'] },
    mandatory: ['Frontend and agent backend are two separate deployments', 'Backend exposes a stable HTTPS API', 'Auth/session identity can be propagated securely', 'Streaming protocol works end-to-end'],
    goodToHave: ['Next.js/React frontend', 'FastAPI/Node agent backend', 'Shared auth provider + signed tokens', 'Same/nearby regions for backend + database', 'Separate app./api. subdomains'],
    diagram: ['Browser', 'Vercel / Next.js', 'Auth', 'Agent API', 'DB / Queue', 'LLM + Tools'],
    costNote: 'Frontend can be very cheap at small scale; backend/model costs are independent — UI traffic and agent execution scale separately.',
    latencyNote: 'CDN-served frontend feels fast, but a distant backend/DB erases that advantage — avoid a cross-continent chain.',
    cons: ['Two deployments to operate', 'Auth/CORS/cookies/streaming/domain routing need careful wiring', 'Frontend serverless limits must not become backend limits', 'Debugging spans browser + two platforms'],
    steps: ['Separate UI from agent runtime behind an API contract', 'Implement authenticated agent API + streaming endpoint', 'Deploy & verify backend independently', 'Build frontend against an env-configured API URL', 'Deploy frontend', 'Configure auth callback URLs and CORS', 'Configure custom domains; align regions', 'Add correlation IDs; test interruption/retries/expiry'],
    careful: ['Never put backend secrets into browser bundles', 'Forward user identity safely, not cloud credentials', 'Treat CORS as browser policy, not authentication'],
    interview: [
      { q: 'Why split frontend and agent backend?', a: 'Independent runtime needs and independent scaling.' },
      { q: 'What commonly breaks streaming?', a: 'Proxy buffering, timeouts, CORS, auth, and disconnect handling.' },
      { q: 'What secrets are safe in public frontend variables?', a: 'Only values explicitly intended to be public.' },
    ],
  },
  {
    id: 'E',
    name: 'Single VM + Docker Compose',
    tagline: 'Maximum flexibility on one server',
    badges: { usage: 'Hobby production / Flexible server', enterprise: 'Medium', solo: 'High', cost: '$0–Low/Medium', complexity: 'Medium' },
    scores: { demo: 3, department: 4, enterprise: 2, missionCritical: 1, scalability: 1, longRunning: 5, eventDriven: 2, governance: 2, observability: 3, opsSimplicity: 2, costEfficiency: 4, cloudFlexibility: 5 },
    strengths: ['Best fit for long-running / browser / shell workloads', 'Full control over networking and local state', 'Cost-predictable, single-server simplicity'],
    explain: 'You run one Linux VM and run your entire application there with Docker containers — full control over OS, storage, networking and long-running processes.',
    useCases: ['Persistent local disk', 'Browser automation', 'Shell/code execution', 'Self-hosted MCP servers', 'Long-running workers / unusual binaries'],
    designCall: 'Prefer a VM when the agent needs persistent processes, headless browsers, shell tools, local services or long jobs that serverless platforms make difficult.',
    vendors: [
      { name: 'Oracle Cloud Compute', why: 'Known Always-Free eligible VM (capacity/region caveats)', cost: '$0-friendly' },
      { name: 'Hetzner Cloud', why: 'Very cost-effective paid VPS', cost: 'Low-cost' },
      { name: 'DigitalOcean Droplets', why: 'Beginner-friendly VPS', cost: 'Low-cost' },
      { name: 'AWS EC2 / Azure VM / GCE', why: 'Broad ecosystem; enterprise integration', cost: 'Low → High' },
    ],
    ownership: { owned: ['Agent Orchestration', 'App Runtime', 'Identity / Security', 'Observability', 'Queue / Workers'], partial: ['State / Memory', 'Tools / MCP', 'UI'], external: ['Model'] },
    mandatory: ['Comfort with Linux/SSH (or willingness to learn)', 'Ability to patch and operate the host', 'Backups stored off the VM', 'Firewall, TLS and secrets configured correctly'],
    goodToHave: ['Docker + Docker Compose', 'Domain name for clean HTTPS', 'Caddy or Nginx reverse proxy', 'CI/CD automation', 'External DB for HA/multi-tenancy'],
    diagram: ['Internet / User', 'DNS + HTTPS', 'Caddy / Nginx', 'Docker Web', 'Docker Worker', 'Volumes / DB / Redis', 'LLM / Browser / MCP / Tools'],
    costNote: 'Can be near $0 with a free VM, or very cheap with a small VPS; cost is predictable because the VM runs continuously.',
    latencyNote: 'Good for interactive apps since the process is always warm — watch CPU/RAM saturation from heavy jobs.',
    cons: ['Single failure domain unless you add redundancy', 'You own OS/Docker updates, disk monitoring, recovery', 'Scaling beyond one machine is a redesign', 'A security mistake can expose the whole host'],
    steps: ['Reproduce the app locally; create .env.example', 'Inventory durable state', 'Create Dockerfile + docker-compose.yml; test locally', 'Provision VM; restrict inbound ports', 'Install Docker + Compose; clone repo', 'Start services; verify health/logs', 'Point DNS; configure HTTPS via Caddy/Nginx', 'Set off-host backups + restore test; automate CI/CD; add monitoring'],
    careful: ['Back up SQLite safely (not a raw copy mid-write)', 'Restrict SSH and patch the OS', 'Use resource limits so one worker cannot exhaust the host'],
    interview: [
      { q: 'When is a VM better than serverless?', a: 'Persistent processes, local disk, browser/code execution, or predictable always-on compute.' },
      { q: 'How do Docker Compose volumes work?', a: 'They keep data outside disposable containers, on the host.' },
      { q: 'How do you remove the VM as a single point of failure?', a: 'Multiple hosts + load balancer + external state, or move to managed containers/Kubernetes.' },
    ],
  },
  {
    id: 'F',
    name: 'Serverless Functions + Workflow Orchestration',
    tagline: 'Event-first automation and durable workflows',
    badges: { usage: 'Automation / Event-driven production', enterprise: 'High', solo: 'Medium–High', cost: '$0-ish–Medium', complexity: 'Low–Medium' },
    scores: { demo: 2, department: 3, enterprise: 4, missionCritical: 3, scalability: 4, longRunning: 1, eventDriven: 5, governance: 3, observability: 3, opsSimplicity: 3, costEfficiency: 4, cloudFlexibility: 3 },
    strengths: ['Purpose-built for event-driven & scheduled work', 'Durable retries and workflow state out of the box', 'Scales to zero between events'],
    explain: 'Instead of one always-on app, small pieces of code run only when something happens — an API call, webhook, schedule, queue message or file upload. A workflow engine coordinates multi-step, retryable processes.',
    useCases: ['Webhook agents', 'Cron automation', 'Event-driven assistants', 'Document pipelines', 'Durable business workflows'],
    designCall: 'Prefer this when the system is triggered by events and can be broken into clear steps. Less natural for continuous interactive chat unless paired with another API layer (e.g. Stack D).',
    vendors: [
      { name: 'AWS Lambda + Step Functions + EventBridge/SQS', why: 'Very mature event/workflow ecosystem', cost: 'Usage-based' },
      { name: 'Azure Functions + Durable Functions', why: 'Strong Azure-native durable orchestration', cost: 'Usage-based' },
      { name: 'Cloud Run functions + Workflows + Pub/Sub', why: 'Google event-driven stack', cost: 'Usage-based' },
      { name: 'Temporal Cloud', why: 'Durable workflow platform for long orchestration', cost: 'Usage-based' },
    ],
    ownership: { owned: ['App Runtime', 'Queue / Workers'], partial: ['Agent Orchestration', 'Identity / Security', 'Observability', 'State / Memory'], external: ['Model', 'Tools / MCP', 'UI'] },
    mandatory: ['Work can be decomposed into bounded steps', 'State is externalized (workflow state, DB, queue, object storage)', 'Functions are retry-safe / idempotent', 'Each step fits the runtime limits'],
    goodToHave: ['Queue/event bus', 'Durable workflow engine', 'Correlation IDs + structured event schema', 'Dead-letter queue + replay process'],
    diagram: ['Webhook / Cron / Event', 'Function / API', 'Workflow Orchestrator', 'Activity Functions', 'Queue / Event Bus', 'DB / Object Store', 'LLM + Tools'],
    costNote: 'Often near-zero at low invocation volume; highly efficient for spiky automation since idle time costs little.',
    latencyNote: 'Fine for background automation; for interactive UX each hop matters — keep the synchronous path short.',
    cons: ['Distributed debugging is harder', 'Cold starts/extra hops can hurt chat UX', 'At-least-once delivery requires duplicate-safe design', 'A simple service can beat a large graph of tiny functions'],
    steps: ['Classify triggers: HTTP, webhook, cron, queue, event', 'Split the process into short idempotent activities', 'Choose function provider + workflow engine + state store', 'Define event schema + correlation ID', 'Implement workflow + activities with retry/timeout/compensation', 'Persist outputs; expose status/callback', 'Deploy with IaC; load-test bursts and replay duplicates', 'Add tracing, budgets, failure alarms'],
    careful: ['Never assume exactly-once execution', "Don't put a 30-minute loop in a function with a shorter limit", 'Use idempotency keys for external side effects'],
    interview: [
      { q: 'Why is idempotency critical?', a: 'Events can be delivered more than once.' },
      { q: 'When do you need a workflow engine?', a: 'Long-running, multi-step, retryable, stateful processes.' },
      { q: 'How do you implement human approval?', a: 'Pause a durable workflow and resume from an external approval event.' },
    ],
  },
  {
    id: 'G',
    name: 'Managed Agent Runtime / Agent Platform',
    tagline: 'Agent-native managed runtime',
    badges: { usage: 'Enterprise / Agent-native', enterprise: 'Very High', solo: 'Medium', cost: 'Low at tiny use → High', complexity: 'Low–Medium app ops / Medium platform concepts' },
    scores: { demo: 2, department: 3, enterprise: 5, missionCritical: 4, scalability: 4, longRunning: 3, eventDriven: 3, governance: 5, observability: 5, opsSimplicity: 4, costEfficiency: 2, cloudFlexibility: 1 },
    strengths: ['Strongest built-in governance, identity and session management', 'Native agent observability and evaluation hooks', 'Least custom plumbing for enterprise agent controls'],
    explain: 'You deploy the agent to a platform that understands agents natively. It may manage sessions, memory, tool access, identity, scaling, observability and agent versions for you.',
    useCases: ['Enterprise agent programs', 'Governed internal agents', 'Multi-agent systems', 'Teams wanting managed sessions/tooling/identity/observability without building those layers'],
    designCall: 'Prefer this when agent-specific operational capabilities outweigh owning every infra detail — compelling for clouds already standardized and for governed tool/identity/session needs.',
    vendors: [
      { name: 'Microsoft Foundry Agent Service (Prompt / Hosted Agents)', why: 'Declarative or custom-code agents with managed scaling, identity, sessions', cost: 'Enterprise / usage-based' },
      { name: 'Google Vertex AI Agent Engine', why: 'Managed agent runtime inside Vertex AI Agent Builder', cost: 'Enterprise / usage-based' },
      { name: 'Amazon Bedrock AgentCore Runtime', why: 'Framework/model-flexible purpose-built agent runtime', cost: 'Enterprise / usage-based' },
      { name: 'Databricks Apps / Mosaic AI, Salesforce Agentforce', why: 'Strong options for data- or CRM-centric estates', cost: 'Enterprise' },
    ],
    ownership: { owned: ['Agent Orchestration', 'App Runtime', 'Identity / Security', 'Observability', 'State / Memory'], partial: ['Queue / Workers', 'Tools / MCP'], external: ['Model', 'UI'] },
    mandatory: ['Chosen platform supports your framework/model/tool requirements', 'You accept platform coupling around identity, sessions, tools or observability', 'Data governance reviewed for external model/tool connections', 'Cloud account/project and suitable permissions exist'],
    goodToHave: ['Existing cloud IAM/identity setup', 'Central model catalog and tool governance', 'Evaluation/observability strategy', 'Containerized agent if using hosted-code mode'],
    diagram: ['App / User', 'Managed Agent Endpoint', 'Agent Runtime', 'Session / Memory', 'Tool Gateway / MCP', 'Model Catalog', 'Enterprise Data / APIs', 'Observability / Evals'],
    costNote: 'Operationally efficient but not automatically cheapest — runtime, model, memory, tool and observability charges combine.',
    latencyNote: 'Simplifies session routing, but every managed layer is another hop — measure end-to-end, do not assume "managed" means faster.',
    cons: ['Vendor lock-in can be meaningful', 'Agent-platform products evolve quickly', 'Managed infra does not remove the need for safety/evaluation', 'Cost can combine runtime + model + memory + tool + observability'],
    steps: ['Choose platform by cloud alignment, framework support, identity, networking, governance', 'Decide prompt/config agent vs hosted-code mode', 'Create project/workspace, identity, model deployment', 'Register tools, MCP servers or API connections', 'Define memory/session retention policy', 'Deploy version; obtain endpoint; configure RBAC/private networking', 'Enable tracing/evaluations/safety controls', 'Run functional/adversarial/load/cost tests; set budgets'],
    careful: ["Don't assume \"managed\" means safe by default", 'Review where data travels during tool calls', 'Keep a portability boundary around core business logic'],
    interview: [
      { q: 'What does an agent runtime provide beyond a container platform?', a: 'Sessions, memory, identity, tool governance, agent lifecycle, tracing/evals.' },
      { q: 'When choose Agent Engine/AgentCore/Foundry over Cloud Run?', a: 'When agent-specific managed capabilities outweigh generic compute flexibility.' },
      { q: 'Does managed hosting remove the need for evals?', a: 'No — quality and safety remain application responsibilities.' },
    ],
  },
  {
    id: 'H',
    name: 'Managed Hyperscaler Containers',
    tagline: 'Enterprise cloud building blocks',
    badges: { usage: 'Enterprise production', enterprise: 'Very High', solo: 'Low–Medium', cost: 'Medium–High', complexity: 'Medium–High' },
    scores: { demo: 1, department: 3, enterprise: 5, missionCritical: 4, scalability: 4, longRunning: 4, eventDriven: 3, governance: 5, observability: 5, opsSimplicity: 2, costEfficiency: 2, cloudFlexibility: 2 },
    strengths: ['Enterprise-grade HA, private networking and IAM', 'Mature managed data/queue/cache ecosystem', 'No Kubernetes operational overhead'],
    explain: 'You still run your own containerized agent services, but use enterprise cloud services for load balancing, networking, identity, databases, queues, secrets and monitoring.',
    useCases: ['Commercial production', 'Sensitive data / private networking', 'Enterprise SSO', 'High availability / regulated environments', 'Long-running services or workers'],
    designCall: 'Prefer this when private networking, workload identity, HA, compliance and centralized operations justify a more sophisticated architecture — but you do not need Kubernetes-level control.',
    vendors: [
      { name: 'AWS ECS + Fargate', why: 'Managed container orchestration without Kubernetes', cost: 'Enterprise' },
      { name: 'Azure Container Apps', why: 'Managed/serverless container platform with Azure integration', cost: 'Enterprise' },
      { name: 'Cloud Run with enterprise networking', why: 'Serverless path extended with enterprise features', cost: 'Enterprise' },
      { name: 'GCE Managed Instance Groups / Elastic Beanstalk', why: 'VM-based managed fleet alternative', cost: 'Enterprise' },
    ],
    ownership: { owned: ['App Runtime', 'Identity / Security', 'Observability', 'Queue / Workers'], partial: ['Agent Orchestration', 'State / Memory', 'Tools / MCP', 'UI'], external: ['Model'] },
    mandatory: ['Team can operate cloud IAM/network/security concepts', 'Workload benefits enough from enterprise controls to justify complexity', 'State and services designed for redundancy', 'Security boundaries and least privilege are explicit'],
    goodToHave: ['Infrastructure as Code', 'Managed container service + load balancer', 'Managed Postgres/Redis/object storage/queue', 'Central secrets manager and tracing', 'Multi-zone / HA design'],
    diagram: ['Users / Corp Network', 'WAF / API Gateway / LB', 'Managed Container Service', 'Worker Service', 'Private Network', 'Managed DB / Cache / Queue / Blob', 'Model Endpoint', 'IAM + Observability'],
    costNote: 'Baseline usually higher than PaaS/serverless — LBs, NAT, DBs, caches, minimum task counts may bill continuously.',
    latencyNote: 'Warm services + private regional networking can be fast; watch service meshes, NAT and multi-region hops.',
    cons: ['Many cloud services to understand and pay for', 'IAM/network mistakes can be severe', 'Overkill for a tiny app', 'Cloud-specific infrastructure increases lock-in'],
    steps: ['Define SLO, RTO/RPO, sensitivity, residency requirements', 'Create network/landing-zone design', 'Containerize API and worker services', 'Provision registry, container service, LB, autoscaling', 'Provision managed DB/cache/queue/object store', 'Configure workload identities + secret manager', 'Add private endpoints/firewall/security groups', 'Deploy via IaC + CI/CD; add observability, HA/failover tests, rollback docs'],
    careful: ['NAT and data egress can surprise budgets', 'Use workload identity instead of long-lived keys', 'Test zone failure and restore — not only the happy path'],
    interview: [
      { q: 'Why managed containers instead of Kubernetes?', a: 'Lower operational complexity while retaining enterprise features.' },
      { q: 'What is workload identity?', a: 'A short-lived cloud identity bound to the running service.' },
      { q: 'How do workers autoscale?', a: 'Usually by queue depth/lag rather than HTTP traffic.' },
    ],
  },
  {
    id: 'I',
    name: 'Kubernetes',
    tagline: 'Maximum orchestration control at scale',
    badges: { usage: 'Platform / Large enterprise', enterprise: 'High in platform-heavy orgs', solo: 'Very Low', cost: 'Medium–Very High', complexity: 'High' },
    scores: { demo: 1, department: 1, enterprise: 4, missionCritical: 5, scalability: 5, longRunning: 5, eventDriven: 3, governance: 5, observability: 5, opsSimplicity: 1, costEfficiency: 1, cloudFlexibility: 4 },
    strengths: ['Highest ceiling for scale and custom scheduling (incl. GPU)', 'One platform for many services/teams', 'Deepest observability & policy tooling'],
    explain: 'A platform for running many containers across many machines. You declare the desired state — replica counts, resources, networking, health rules — and Kubernetes continuously enforces it.',
    useCases: ['Large multi-service agent platforms', 'Shared GPU fleets', 'Many teams/services', 'Custom scheduling', 'Orgs already operating Kubernetes'],
    designCall: 'Prefer Kubernetes only when there is a real orchestration/platform need or an existing platform team — never choose it merely because it "sounds enterprise."',
    vendors: [
      { name: 'Google Kubernetes Engine (GKE)', why: 'Managed Kubernetes on Google Cloud', cost: 'Enterprise' },
      { name: 'Azure Kubernetes Service (AKS)', why: 'Managed Kubernetes on Azure', cost: 'Enterprise' },
      { name: 'Amazon EKS', why: 'Managed Kubernetes on AWS', cost: 'Enterprise' },
      { name: 'Red Hat OpenShift / Rancher', why: 'Enterprise Kubernetes platform layers', cost: 'Enterprise' },
    ],
    ownership: { owned: ['App Runtime', 'Identity / Security', 'Observability', 'Queue / Workers'], partial: ['Agent Orchestration', 'State / Memory', 'Tools / MCP', 'UI'], external: ['Model'] },
    mandatory: ['Real need for Kubernetes-level control', 'Team has Kubernetes/SRE/platform expertise', 'Workload is complex enough to justify cluster overhead', 'State strategy is designed carefully'],
    goodToHave: ['Managed Kubernetes rather than self-managed control plane', 'Helm/Kustomize + GitOps', 'Central logs, metrics, traces', 'Policy engine, secrets integration, network policies'],
    diagram: ['Users', 'Ingress / Gateway', 'Kubernetes Service', 'Agent API Pods', 'Worker Pods', 'Nodes / GPU Nodes', 'Managed DB / Queue / Object Store', 'LLM / Tools', 'Platform Observability'],
    costNote: 'Infra baseline is often meaningful (cluster/node compute, ingress, observability); efficient only at genuine platform scale.',
    latencyNote: 'Warm pods are predictable; ingress/mesh sidecars add overhead. Scaling a new (especially GPU) node is slower than a warm pod.',
    cons: ['Highest operational complexity in this guide', 'Easy to over-engineer a small agent', 'Cluster networking/upgrades/security require specialized skill', 'Idle platform components create cost before any model usage'],
    steps: ['Prove Kubernetes is actually required', 'Choose managed Kubernetes provider', 'Design namespaces, identity, network, secret strategy', 'Containerize all services; create manifests/Helm charts', 'Configure resource requests/limits + health probes', 'Connect managed DB/queue/object storage', 'Set HPA + node autoscaling; set network policies/RBAC', 'Add GitOps CI/CD + observability; run load/failover/upgrade tests'],
    careful: ['Never omit CPU/memory requests and limits', "Don't store critical state inside a random Pod", "Don't introduce a service mesh unless its value is clear"],
    interview: [
      { q: 'Why is Kubernetes often overkill?', a: 'Its operational/platform overhead is substantial relative to a single agent service.' },
      { q: 'Difference between Deployment and Service?', a: 'Deployment manages Pods; Service gives stable networking/load balancing.' },
      { q: 'How would you run GPU agents?', a: 'GPU node pools, resource requests, scheduling/taints, autoscaling and cost controls.' },
    ],
  },
];

export const decisionShortcuts = [
  { q: 'Need a demo today?', a: 'A' },
  { q: 'Small-team ordinary production?', a: 'B' },
  { q: 'Bursty stateless container API?', a: 'C' },
  { q: 'Polished frontend + separate backend?', a: 'D' },
  { q: 'Browser/code/local MCP/long-lived process?', a: 'E' },
  { q: 'Event/webhook/schedule/durable workflow?', a: 'F' },
  { q: 'Want agent-native sessions/tools/identity/governance?', a: 'G' },
  { q: 'Private enterprise cloud + HA + SSO?', a: 'H' },
  { q: 'Many services/platform team/shared GPU fleet?', a: 'I' },
];

export function getStack(id) {
  return stacks.find((s) => s.id === id);
}

// Dimensions every stack is scored on, independent of any single project's context.
// Used for the always-visible comparison matrix (Deployment Stack Guide) as well as
// the context-weighted ranking below.
export const SCORE_DIMENSIONS = [
  { key: 'scalability', label: 'Scalability (burst/high traffic)' },
  { key: 'longRunning', label: 'Long-running / stateful processes' },
  { key: 'eventDriven', label: 'Event-driven / scheduled work' },
  { key: 'governance', label: 'Governance, identity & compliance' },
  { key: 'observability', label: 'Observability & evaluation maturity' },
  { key: 'opsSimplicity', label: 'Operational simplicity (lower ops burden)' },
  { key: 'costEfficiency', label: 'Cost efficiency' },
  { key: 'cloudFlexibility', label: 'Cloud portability / low lock-in' },
];

export const CLOUD_OPTIONS = ['No cloud (local / laptop only)', 'Cloud-agnostic', 'Azure', 'AWS', 'Google Cloud', 'Hybrid / Multi-cloud'];

const SCALE_KEY = { Prototype: 'demo', Department: 'department', Enterprise: 'enterprise', 'Mission-critical global': 'missionCritical' };
const USERS_NEED = { '< 50 users (demo / pilot)': 1, '50 – 5,000 users (department / line of business)': 2, '5,000 – 100,000 users (business unit / product)': 4, '100,000+ users (public internet scale)': 5 };
const RISK_NEED = { Standard: 2, 'High governance': 4, 'Strict data residency': 4, 'Regulated / zero-trust': 5 };
const OBS_NEED = { 'Basic logs only': 2, 'Standard monitoring + tracing': 3, 'Full audit trail, evals & compliance reporting': 5 };
const DELIVERY_COST_NEED = { Prototype: 5, Production: 3, Modernization: 3 };
// A locked-in cloud choice (Azure/AWS/GCP) means cloud-portability doesn't matter — every
// stack is equally viable there. Only "no cloud" / agnostic / hybrid genuinely needs a
// low-lock-in, easy-to-run-anywhere pattern.
const CLOUD_FLEX_NEED = { 'No cloud (local / laptop only)': 5, 'Cloud-agnostic': 5, 'Hybrid / Multi-cloud': 4, Azure: 1, AWS: 1, 'Google Cloud': 1 };
const TEAM_BONUS = {
  'Microsoft + React': { D: 2, B: 1 },
  'Microsoft low-code': { B: 2, G: 2, A: 1 },
  'Python / AI engineering': { E: 2, F: 1, C: 1 },
  'Cloud platform engineering': { H: 2, I: 2 },
  'Mixed / no preference': {},
};
const TRAFFIC_DIM = {
  'Steady, predictable load': { dim: 'longRunning', need: 3 },
  'Bursty / spiky traffic': { dim: 'scalability', need: 5 },
  'Event-driven (webhooks / schedules)': { dim: 'eventDriven', need: 5 },
  'Long-running / always-on processes': { dim: 'longRunning', need: 5 },
};

function matchScore(have, need) {
  // Exceeding the need is free; falling short is penalized proportionally.
  if (have >= need) return 5;
  return Math.max(0, 5 - (need - have) * 1.6);
}

/**
 * Scores every deployment stack against the given project context using explicit,
 * weighted criteria (org scale, user/traffic volume, traffic pattern, governance,
 * observability, cloud fit, cost sensitivity, team fit) and returns all 9 stacks ranked
 * with a transparent per-dimension breakdown — an explainable, illustrative decision
 * matrix, not a single "best answer". Every field — including a demo-scale, no-cloud,
 * zero-governance project — produces a sensible, visibly differentiated ranking.
 */
export function scoreStacks({ scale, risk, delivery, usersScale, trafficPattern, observabilityNeed, cloud, team }) {
  const scaleKey = SCALE_KEY[scale] || 'department';
  const usersNeed = USERS_NEED[usersScale] ?? 2;
  const riskNeed = RISK_NEED[risk] ?? 2;
  const obsNeed = OBS_NEED[observabilityNeed] ?? 3;
  const costNeed = DELIVERY_COST_NEED[delivery] ?? 3;
  const cloudNeed = CLOUD_FLEX_NEED[cloud] ?? 2;
  const traffic = TRAFFIC_DIM[trafficPattern] || TRAFFIC_DIM['Steady, predictable load'];

  const results = stacks.map((s) => {
    const weighted = [
      { label: `Org scale fit (${scale})`, weight: 22, pct: (s.scores[scaleKey] / 5) * 100 },
      { label: `User/traffic volume fit (${usersScale || 'unspecified'})`, weight: 17, pct: (matchScore(s.scores.scalability, usersNeed) / 5) * 100 },
      { label: `Traffic pattern fit (${trafficPattern || 'unspecified'})`, weight: 17, pct: (matchScore(s.scores[traffic.dim], traffic.need) / 5) * 100 },
      { label: `Governance fit (${risk})`, weight: 14, pct: (matchScore(s.scores.governance, riskNeed) / 5) * 100 },
      { label: `Observability fit (${observabilityNeed || 'unspecified'})`, weight: 9, pct: (matchScore(s.scores.observability, obsNeed) / 5) * 100 },
      { label: `Cloud/hosting fit (${cloud || 'unspecified'})`, weight: 9, pct: (matchScore(s.scores.cloudFlexibility, cloudNeed) / 5) * 100 },
      { label: `Cost sensitivity fit (${delivery})`, weight: 7, pct: (matchScore(s.scores.costEfficiency, costNeed) / 5) * 100 },
      { label: `Team skill fit (${team})`, weight: 5, pct: Math.min(100, ((TEAM_BONUS[team]?.[s.id] || 0) / 2) * 100) },
    ];
    const score = Math.round(weighted.reduce((sum, w) => sum + (w.pct / 100) * w.weight, 0));
    return { stack: s, score, breakdown: weighted };
  });

  return results.sort((a, b) => b.score - a.score);
}

export const SCENARIO_PRESETS = [
  {
    label: 'Demo / pilot (<10 users, no cloud)',
    hint: 'Quick proof-of-concept, no production or compliance pressure.',
    context: { cloud: 'No cloud (local / laptop only)', scale: 'Prototype', risk: 'Standard', delivery: 'Prototype', dataType: 'Structured + documents', team: 'Mixed / no preference', usersScale: '< 50 users (demo / pilot)', trafficPattern: 'Steady, predictable load', observabilityNeed: 'Basic logs only' },
  },
  {
    label: 'Small-team production',
    hint: 'Department tool, modest traffic, no dedicated DevOps.',
    context: { cloud: 'Cloud-agnostic', scale: 'Department', risk: 'Standard', delivery: 'Production', dataType: 'Structured + documents', team: 'Mixed / no preference', usersScale: '50 – 5,000 users (department / line of business)', trafficPattern: 'Steady, predictable load', observabilityNeed: 'Standard monitoring + tracing' },
  },
  {
    label: 'Regulated enterprise',
    hint: 'High governance, Azure-standardized, large user base.',
    context: { cloud: 'Azure', scale: 'Enterprise', risk: 'High governance', delivery: 'Production', dataType: 'Structured + documents', team: 'Microsoft + React', usersScale: '5,000 – 100,000 users (business unit / product)', trafficPattern: 'Steady, predictable load', observabilityNeed: 'Full audit trail, evals & compliance reporting' },
  },
  {
    label: 'Event-driven automation',
    hint: 'Webhooks, schedules, document pipelines — not a chat UI.',
    context: { cloud: 'Cloud-agnostic', scale: 'Department', risk: 'Standard', delivery: 'Production', dataType: 'Real-time events', team: 'Python / AI engineering', usersScale: '50 – 5,000 users (department / line of business)', trafficPattern: 'Event-driven (webhooks / schedules)', observabilityNeed: 'Standard monitoring + tracing' },
  },
  {
    label: 'Mission-critical platform scale',
    hint: 'Public internet traffic, zero-trust, multi-team platform.',
    context: { cloud: 'Hybrid / Multi-cloud', scale: 'Mission-critical global', risk: 'Regulated / zero-trust', delivery: 'Production', dataType: 'Transactional systems', team: 'Cloud platform engineering', usersScale: '100,000+ users (public internet scale)', trafficPattern: 'Bursty / spiky traffic', observabilityNeed: 'Full audit trail, evals & compliance reporting' },
  },
];
