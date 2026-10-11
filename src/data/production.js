// Containerization & Production Delivery playbook — condensed hands-on reference.
// Pairs with the Deployment Stack Guide: once a container-based stack (B, C, E, H, I) is
// chosen, this is how to package, ship and operate it safely.

export const productionSections = [
  {
    id: 'docker',
    title: '1 · Docker Fundamentals',
    problem: 'Your FastAPI + LangChain agent works on your laptop but fails on a teammate\'s machine because Python and system-library versions differ.',
    concept: 'Package the application and its dependencies into a Docker image, then run that image as a container.',
    points: [
      'Image: a packaged, read-only blueprint — OS pieces, Python runtime, dependencies, app files.',
      'Container: a running instance of an image. One image can start many containers.',
      'Layer: each Dockerfile instruction contributes a reusable filesystem layer.',
      'Build cache: unchanged layers are reused, speeding up rebuilds dramatically.',
    ],
    code: [
      { label: 'Core commands', lang: 'bash', code: `docker build -t agent-api:dev .
docker images
docker run --rm -p 8080:8080 --name agent-api agent-api:dev
docker ps
docker logs -f agent-api
docker exec -it agent-api sh
docker stop agent-api` },
    ],
  },
  {
    id: 'dockerfile',
    title: '2 · Production Dockerfile',
    problem: 'A demo Dockerfile runs as root, copies every local file, installs compilers into the final image, and bloats to 1.2 GB.',
    concept: 'Production Dockerfiles optimize reproducibility, cache efficiency, a small runtime footprint, non-root execution and clean process behavior.',
    points: [
      'Copy dependency manifests before source code for cache reuse.',
      'Use a minimal base image (e.g. python:3.12-slim).',
      'Run as a non-root user; never bake secrets into the image.',
      'Use multi-stage builds when compilers/headers are only needed to build wheels.',
      'Tag releases immutably (Git SHA or semver), not only `latest`.',
    ],
    code: [
      { label: 'Production Dockerfile', lang: 'dockerfile', code: `FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ ./app/

RUN useradd --create-home appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8080
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]` },
      { label: '.dockerignore', lang: 'text', code: `.git
.venv
__pycache__
.env
.env.*
chroma_data/
uploads/
dist/
build/` },
    ],
  },
  {
    id: 'compose',
    title: '3 · Docker Compose (Multi-Service)',
    problem: 'Your agent API needs Redis for jobs, a worker for long tasks, and ChromaDB for vector search — running four terminal windows is fragile.',
    concept: 'Docker Compose declares services, networks and volumes for the complete multi-service application in one YAML file.',
    points: [
      'services: the containers you want running — API, worker, Redis, Chroma, proxy.',
      'networks: lets services discover each other by service name (e.g. `redis`, not `localhost`).',
      'volumes: deliberately persistent data that should outlive a container recreation.',
      'api and worker can share one image with a different start command.',
    ],
    code: [
      { label: 'docker-compose.yml', lang: 'yaml', code: `services:
  api:
    build: .
    command: uvicorn app.main:app --host 0.0.0.0 --port 8080
    ports: ["8080:8080"]
    env_file: [.env]
    environment:
      REDIS_URL: redis://redis:6379/0
    depends_on:
      redis: { condition: service_healthy }
    restart: unless-stopped

  worker:
    build: .
    command: celery -A app.worker.celery_app worker --loglevel=INFO
    env_file: [.env]
    depends_on:
      redis: { condition: service_healthy }

  redis:
    image: redis:7-alpine
    healthcheck: { test: ["CMD", "redis-cli", "ping"], interval: 5s, retries: 10 }
    volumes: ["redis_data:/data"]

volumes:
  redis_data:` },
    ],
  },
  {
    id: 'secrets',
    title: '4 · Env & Secrets',
    problem: 'An engineer adds `ENV OPENAI_API_KEY=sk-...` to a Dockerfile and pushes the image to a registry.',
    concept: 'Secrets must be injected at runtime — never baked into source code or image layers. Image history can preserve them even after you edit the Dockerfile.',
    points: [
      'Configuration (non-sensitive): LOG_LEVEL, MODEL_NAME, REGION.',
      'Secrets (sensitive): API keys, DB credentials, tokens.',
      'Maturity ladder: local .env → Compose/platform runtime env vars → cloud Secret Manager + workload identity.',
      'Rotate any credential that was ever committed to Git or baked into an image.',
    ],
    code: [
      { label: '.env.example (safe to commit)', lang: 'bash', code: `OPENAI_API_KEY=
REDIS_URL=redis://redis:6379/0
LOG_LEVEL=INFO` },
    ],
  },
  {
    id: 'health',
    title: '5 · Health & Graceful Shutdown',
    problem: 'A new container has started, but its DB pool and model config are not ready — the load balancer sends traffic immediately and requests fail.',
    concept: 'Separate liveness ("is the process alive?") from readiness ("can it safely receive traffic?"), and handle shutdown gracefully.',
    points: [
      'Liveness: cheap check, avoid fragile downstream dependencies.',
      'Readiness: may validate critical startup state/dependencies.',
      'Graceful shutdown: stop accepting work, finish in-flight requests, close connections, flush telemetry.',
      'Agent-specific risk: don\'t pull a new queue job after shutdown begins; make side effects idempotent.',
    ],
    code: [
      { label: 'FastAPI health endpoints', lang: 'python', code: `ready = False

@app.on_event("startup")
async def startup():
    global ready
    ready = True  # after clients/config are warmed

@app.get("/health/live")
def live():
    return {"status": "alive"}

@app.get("/health/ready")
def readiness():
    if not ready:
        raise HTTPException(status_code=503, detail="not ready")
    return {"status": "ready"}` },
    ],
  },
  {
    id: 'cicd',
    title: '6 · CI/CD (GitHub Actions)',
    problem: 'A developer manually runs Docker + cloud commands on every release, then deploys an untested branch on a Friday with no way to tell which image is running.',
    concept: 'CI/CD turns the release path into a repeatable, auditable pipeline: test → build → scan → push → deploy → smoke-test.',
    points: [
      'Prefer workload identity / OIDC over long-lived cloud keys in CI.',
      'Tag images with the Git SHA so a running revision traces back to a commit.',
      'Fail the pipeline on: failing tests, failed scans, failed build/push/deploy, or a failed smoke test.',
      'Agent-specific gates: prompt/tool unit tests, RAG regression tests, eval-dataset thresholds, cost/token budget guardrails.',
    ],
    code: [
      { label: '.github/workflows/deploy.yml (Cloud Run example)', lang: 'yaml', code: `on: { push: { branches: [main] } }
permissions: { contents: read, id-token: write }

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install -r requirements.txt && pytest -q
      - uses: google-github-actions/auth@v3
        with: { workload_identity_provider: \${{ secrets.GCP_WIF }}, service_account: \${{ secrets.GCP_SA }} }
      - run: |
          IMAGE="REGION-docker.pkg.dev/PROJECT/REPO/agent-api:\${{ github.sha }}"
          docker build -t "$IMAGE" . && docker push "$IMAGE"
          gcloud run deploy agent-api --image "$IMAGE" --region REGION --quiet
      - run: curl --fail "$(gcloud run services describe agent-api --region REGION --format='value(status.url)')/health/live"` },
    ],
  },
  {
    id: 'releases',
    title: '7 · Blue/Green & Canary Releases',
    problem: 'Version 2 passes unit tests but subtly picks the wrong tool more often. A 100% instant rollout exposes every user before the problem is visible.',
    concept: 'Separate "deployment succeeded" from "the new version is actually good" using controlled traffic migration, and monitor agent quality, not just infra health.',
    points: [
      'Blue/Green: deploy candidate separately, test it, switch traffic, keep the old version for instant rollback.',
      'Canary: shift a small % of traffic (e.g. 5–10%), evaluate, then ramp to 25% → 50% → 100%.',
      'Infra scoreboard: HTTP error rate, p95 latency, CPU/memory, queue backlog.',
      'Agent scoreboard: task success/eval score, wrong-tool rate, RAG quality, cost per successful task.',
      'Key lesson: a release can have 0 HTTP errors and still be a terrible agent release.',
    ],
    code: [
      { label: 'Cloud Run canary traffic split', lang: 'bash', code: `gcloud run deploy agent-api --image "$IMAGE_V2" --region "$REGION" --no-traffic
gcloud run services update-traffic agent-api --region "$REGION" \\
  --to-revisions "REV_V1=90,REV_V2=10"
# promote: --to-revisions "REV_V2=100"
# rollback: --to-revisions "REV_V1=100"` },
    ],
  },
  {
    id: 'operate',
    title: '8 · Monitoring & Security',
    problem: 'The container is "up", users report slow/incorrect answers, but CPU looks normal — infra monitoring alone says everything is green.',
    concept: 'Production agents need infrastructure + application + agent-level observability, plus a container security baseline.',
    points: [
      'Infrastructure: CPU, memory, instance count, restarts.',
      'Application: requests, HTTP error rate, p50/p95 latency, queue depth.',
      'Agent: LLM/tool latency, token cost, trace, evals, task success.',
      'Security baseline: minimal base image, non-root, no secrets in images, dependency/image scanning, least-privilege task roles, network restrictions, resource limits.',
    ],
    code: [],
  },
];

export const labChecklist = [
  { stage: 'Lab 0 — Starter agent', goal: 'FastAPI /chat + health endpoints + Redis/Celery job + tiny vector search, running locally in mock mode (no paid model needed).' },
  { stage: 'Lab 1 — Docker Compose', goal: 'Dockerize the app; compose api + worker + redis + chroma with health checks and named volumes.' },
  { stage: 'Lab 2 — CI/CD', goal: 'GitHub Actions: test → build on every PR; later add registry push + deploy + smoke test.' },
  { stage: 'Lab 3 — Cloud Run', goal: 'Push to Artifact Registry, deploy, roll a v2 revision with a 10% canary, promote or roll back.' },
  { stage: 'Lab 4 — Blue/Green locally', goal: 'Blue + Green containers behind Nginx; switch script; simulate a failed readiness check and roll back.' },
  { stage: 'Bonus — AWS ECS + Fargate', goal: 'ECR → cluster → task definition (execution role vs task role) → service → optional ALB.' },
];
