import React, { useMemo, useState } from 'react';
import {
  Activity, ArrowDownRight, ArrowRight, Bot, Boxes, BrainCircuit, Check, ChevronDown,
  CircleHelp, Cloud, Code2, Database, Download, GitBranch, LockKeyhole, Network,
  RadioTower, RotateCcw, Search, ShieldCheck, Sparkles, Workflow, Zap, Rocket,
  BarChart3, AlertTriangle, Trophy,
} from 'lucide-react';
import { scoreStacks, SCORE_DIMENSIONS, CLOUD_OPTIONS, SCENARIO_PRESETS } from '../data/stacks.js';

const initialLayers = [
  { id: 'ui', name: 'Experience / UI', icon: 'ui', choice: 'React + TypeScript', options: ['React + TypeScript', 'Next.js', 'Microsoft Copilot Studio', 'Streamlit', 'Angular', 'Vue'], why: 'Flexible enterprise UX with reusable components, strong ecosystem, and deployment portability.', risk: 'Requires a team to own frontend quality, accessibility, and state management.' },
  { id: 'orchestration', name: 'Agent orchestration', icon: 'agent', choice: 'LangGraph', options: ['LangGraph', 'Microsoft Agent Framework', 'Azure AI Foundry Agent Service', 'OpenAI Agents SDK', 'Google ADK', 'Copilot Studio'], why: 'Explicit stateful workflows, conditional routing, checkpointing, and human-in-the-loop control.', risk: 'Workflow complexity and framework lifecycle should be tested before standardizing.' },
  { id: 'model', name: 'Model gateway / routing', icon: 'model', choice: 'Provider-neutral gateway', options: ['Provider-neutral gateway', 'Azure AI Foundry', 'OpenRouter', 'Direct provider SDKs', 'Amazon Bedrock'], why: 'Centralizes provider selection, credentials, fallback policy, usage controls, and cost attribution.', risk: 'Fallback models can differ in tool calling, structured output, and quality.' },
  { id: 'semantic', name: 'Data / semantic layer', icon: 'data', choice: 'Domain APIs + governed semantic layer', options: ['Domain APIs + governed semantic layer', 'Databricks Unity Catalog + Metric Views', 'Microsoft Fabric semantic models', 'PostgreSQL + domain services', 'GraphQL federation', 'Direct database queries'], why: 'Separates business meaning and permissions from prompt logic; keeps metrics and definitions consistent.', risk: 'Requires ownership of canonical definitions, lineage, and freshness SLAs.' },
  { id: 'api', name: 'API / integration layer', icon: 'api', choice: 'FastAPI + API Management', options: ['FastAPI + API Management', 'Azure Functions + API Management', 'ASP.NET Core', 'Node.js / NestJS', 'AWS API Gateway + Lambda'], why: 'Typed contracts, validation, authentication, throttling, and versioned integrations.', risk: 'Define idempotency, timeout, retry, and contract-version rules.' },
  { id: 'memory', name: 'Memory / retrieval', icon: 'memory', choice: 'Hybrid RAG + scoped conversation state', options: ['Hybrid RAG + scoped conversation state', 'Azure AI Search', 'Databricks Vector Search', 'PostgreSQL + pgvector', 'Chroma + NetworkX GraphRAG', 'Redis only'], why: 'Use retrieval for grounded knowledge and short-lived state for active tasks; persist only approved durable memory.', risk: 'Memory retention, tenant isolation, provenance, and deletion need explicit policies.' },
  { id: 'identity', name: 'Identity / security', icon: 'security', choice: 'Entra ID + RBAC + managed identity', options: ['Entra ID + RBAC + managed identity', 'OAuth 2.0 / OIDC + enterprise IdP', 'AWS IAM Identity Center + IAM', 'Custom JWT authentication'], why: 'Enterprise identity, least privilege, service-to-service identity, and auditable authorization.', risk: 'Authorization must be enforced at tools and data sources—not only in the UI or prompt.' },
  { id: 'observability', name: 'Observability / evaluation', icon: 'observe', choice: 'OpenTelemetry + quality evals', options: ['OpenTelemetry + quality evals', 'Azure Monitor + Application Insights', 'LangSmith', 'Arize Phoenix', 'Datadog LLM Observability', 'Prometheus + Grafana'], why: 'Trace each request across agent, model, retrieval, and tools; pair latency/cost metrics with answer-quality evaluations.', risk: 'Redact sensitive payloads and establish trace sampling and retention.' },
  { id: 'deploy', name: 'Runtime / deployment', icon: 'cloud', choice: 'Docker + managed containers', options: ['Docker + managed containers', 'Azure Container Apps', 'AKS / Kubernetes', 'AWS ECS Fargate', 'Azure App Service', 'Serverless functions'], why: 'Containerized workloads support repeatable releases; choose orchestration complexity based on scale and operational maturity.', risk: 'Set health checks, autoscaling, secrets, rollback, and cost budgets before production.' },
  { id: 'workflow', name: 'Async jobs / events', icon: 'workflow', choice: 'Queue + worker pattern', options: ['Queue + worker pattern', 'Azure Service Bus', 'AWS SQS + EventBridge', 'Kafka / Event Hubs', 'Synchronous API only'], why: 'Moves long-running agent tasks off request threads and supports retries, backpressure, and status tracking.', risk: 'Define duplicate delivery handling, dead-letter queues, and cancellation behavior.' },
];
const iconMap = { ui: Code2, agent: BrainCircuit, model: Zap, data: Database, api: RadioTower, memory: Network, security: LockKeyhole, observe: Activity, cloud: Cloud, workflow: Workflow };

export default function Workbench({ onOpenStack }) {
  const [problem, setProblem] = useState('Build an enterprise AI assistant for operations teams. It must answer policy questions, query governed business metrics, call internal APIs, execute multi-step tasks with human approval, and provide traceability and cost controls.');
  const [cloud, setCloud] = useState('Azure'); const [scale, setScale] = useState('Enterprise'); const [risk, setRisk] = useState('High governance'); const [delivery, setDelivery] = useState('Production'); const [dataType, setDataType] = useState('Structured + documents'); const [team, setTeam] = useState('Microsoft + React');
  const [usersScale, setUsersScale] = useState('5,000 – 100,000 users (business unit / product)');
  const [trafficPattern, setTrafficPattern] = useState('Steady, predictable load');
  const [observabilityNeed, setObservabilityNeed] = useState('Standard monitoring + tracing');
  const [layers, setLayers] = useState(initialLayers); const [analyzed, setAnalyzed] = useState(false); const [tab, setTab] = useState('blueprint'); const [search, setSearch] = useState('');
  const updateLayer = (id, choice) => setLayers((old) => old.map((x) => (x.id === id ? { ...x, choice } : x)));
  function applyPreset(preset) {
    const c = preset.context;
    setCloud(c.cloud); setScale(c.scale); setRisk(c.risk); setDelivery(c.delivery); setDataType(c.dataType); setTeam(c.team);
    setUsersScale(c.usersScale); setTrafficPattern(c.trafficPattern); setObservabilityNeed(c.observabilityNeed);
  }
  const activePresetLabel = useMemo(() => {
    const current = { cloud, scale, risk, delivery, dataType, team, usersScale, trafficPattern, observabilityNeed };
    const match = SCENARIO_PRESETS.find((p) => Object.entries(p.context).every(([k, v]) => current[k] === v));
    return match ? match.label : null;
  }, [cloud, scale, risk, delivery, dataType, team, usersScale, trafficPattern, observabilityNeed]);
  const recommendations = useMemo(() => {
    let arr = [...layers];
    if (cloud === 'AWS') arr = arr.map((x) => (x.id === 'identity' ? { ...x, choice: 'AWS IAM Identity Center + IAM' } : x.id === 'deploy' ? { ...x, choice: 'AWS ECS Fargate' } : x.id === 'api' ? { ...x, choice: 'AWS API Gateway + Lambda' } : x.id === 'model' ? { ...x, choice: 'Amazon Bedrock' } : x));
    if (cloud === 'Azure') arr = arr.map((x) => (x.id === 'identity' ? { ...x, choice: 'Entra ID + RBAC + managed identity' } : x.id === 'deploy' ? { ...x, choice: 'Azure Container Apps' } : x.id === 'model' ? { ...x, choice: 'Azure AI Foundry' } : x));
    if (dataType === 'Mostly analytics') arr = arr.map((x) => (x.id === 'semantic' ? { ...x, choice: cloud === 'Azure' ? 'Microsoft Fabric semantic models' : 'Databricks Unity Catalog + Metric Views' } : x));
    if (team === 'Microsoft low-code') arr = arr.map((x) => (x.id === 'ui' ? { ...x, choice: 'Microsoft Copilot Studio' } : x.id === 'orchestration' ? { ...x, choice: 'Copilot Studio' } : x));
    if (scale === 'Prototype') arr = arr.map((x) => (x.id === 'deploy' ? { ...x, choice: 'Azure App Service' } : x.id === 'observability' ? { ...x, choice: 'Azure Monitor + Application Insights' } : x));
    if (risk === 'Strict data residency') arr = arr.map((x) => (x.id === 'model' ? { ...x, why: 'Select a model endpoint and region approved for the required data residency; route only permitted data and verify provider retention terms.' } : x));
    return arr;
  }, [layers, cloud, scale, risk, dataType, team]);
  const filtered = recommendations.filter((x) => x.name.toLowerCase().includes(search.toLowerCase()) || x.choice.toLowerCase().includes(search.toLowerCase()));
  const score = Math.min(96, 78 + (delivery === 'Production' ? 5 : 0) + (risk !== 'Low governance' ? 4 : 0) + (problem.length > 100 ? 4 : 0) + (scale === 'Enterprise' ? 5 : 0));
  const ranked = useMemo(
    () => scoreStacks({ scale, risk, delivery, usersScale, trafficPattern, observabilityNeed, cloud, team }),
    [scale, risk, delivery, usersScale, trafficPattern, observabilityNeed, cloud, team]
  );
  const topStacks = ranked.slice(0, 4);
  const topStack = topStacks[0].stack;

  function exportBlueprint() {
    const body = {
      project: 'ArchPilot Architecture Decision',
      problem,
      context: { cloud, scale, risk, delivery, dataType, team, usersScale, trafficPattern, observabilityNeed },
      architecture: recommendations.map(({ id, name, choice, why, risk: r }) => ({ layer: name, decision: choice, rationale: why, consideration: r })),
      deploymentStackComparison: topStacks.map(({ stack, score: s }) => ({ id: stack.id, name: stack.name, fitScore: s, strengths: stack.strengths, cautions: stack.cons.slice(0, 2) })),
      notice: 'Prototype recommendations require architect validation and workload-specific testing. Deployment stack scores are an illustrative, explainable weighting — not a benchmark.',
    };
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(body, null, 2)], { type: 'application/json' }));
    a.download = 'archpilot-architecture-blueprint.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14} /> AGENTIC AI · ENTERPRISE SYSTEM DESIGN</div>
          <h1>Turn requirements into<br /><span>architecture decisions.</span></h1>
          <p>Describe the business problem. Compare the building blocks. Generate a decision-ready blueprint with rationale, trade-offs, a matching deployment stack, and validation gates.</p>
          <div className="hero-chips"><span><Check size={13} /> Explainable decisions</span><span><Check size={13} /> Vendor-aware options</span><span><Check size={13} /> Governance by design</span></div>
        </div>
        <div className="hero-art">
          <div className="orbit orbit1" /><div className="orbit orbit2" />
          <div className="core"><BrainCircuit size={39} /><span>ARCH<br />INTEL</span></div>
          <div className="orbit-node node-a"><Code2 size={16} /></div>
          <div className="orbit-node node-b"><Database size={16} /></div>
          <div className="orbit-node node-c"><LockKeyhole size={16} /></div>
          <div className="orbit-node node-d"><Cloud size={16} /></div>
        </div>
      </section>

      <section className="panel preset-panel">
        <div className="section-head"><div><div className="step-label">QUICK-START / VALIDATE A SCENARIO</div><h2>Load a scenario, see the matrix react</h2></div></div>
        <p className="preset-lead">One click sets scale, users, traffic, governance, observability and cloud together so the comparison below reflects a real, internally-consistent scenario — including a plain demo with no cloud at all.</p>
        <div className="preset-grid">
          {SCENARIO_PRESETS.map((p) => (
            <button key={p.label} className={activePresetLabel === p.label ? 'preset-chip active' : 'preset-chip'} onClick={() => applyPreset(p)}>
              <b>{p.label}</b>
              <span>{p.hint}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="input-panel panel">
        <div className="section-head"><div><div className="step-label">01 / DEFINE THE PROBLEM</div><h2>What are we designing?</h2></div><span className="optional">Start with plain language</span></div>
        <label className="field-label">BUSINESS REQUIREMENT / PROBLEM STATEMENT</label>
        <textarea value={problem} onChange={(e) => setProblem(e.target.value)} placeholder="Describe users, business outcomes, integrations, constraints, data sensitivity, scale..." />
        <div className="textarea-footer">
          <span>{problem.length} characters · Be specific about outcomes and constraints</span>
          <button className="text-btn" onClick={() => setProblem('Build an enterprise AI assistant for operations teams. It must answer policy questions, query governed business metrics, call internal APIs, execute multi-step tasks with human approval, and provide traceability and cost controls.')}><RotateCcw size={13} /> Load example</button>
        </div>
        <div className="context-grid">
          <div className="select-field"><label>CLOUD / PLATFORM</label><select value={cloud} onChange={(e) => setCloud(e.target.value)}>{CLOUD_OPTIONS.map((o) => <option key={o}>{o}</option>)}</select></div>
          <div className="select-field"><label>EXPECTED SCALE</label><select value={scale} onChange={(e) => setScale(e.target.value)}><option>Prototype</option><option>Department</option><option>Enterprise</option><option>Mission-critical global</option></select></div>
          <div className="select-field"><label>GOVERNANCE NEED</label><select value={risk} onChange={(e) => setRisk(e.target.value)}><option>Standard</option><option>High governance</option><option>Strict data residency</option><option>Regulated / zero-trust</option></select></div>
          <div className="select-field"><label>DELIVERY TARGET</label><select value={delivery} onChange={(e) => setDelivery(e.target.value)}><option>Prototype</option><option>Production</option><option>Modernization</option></select></div>
          <div className="select-field"><label>DATA PROFILE</label><select value={dataType} onChange={(e) => setDataType(e.target.value)}><option>Structured + documents</option><option>Mostly analytics</option><option>Mostly documents</option><option>Real-time events</option><option>Transactional systems</option></select></div>
          <div className="select-field"><label>TEAM STRENGTH</label><select value={team} onChange={(e) => setTeam(e.target.value)}><option>Microsoft + React</option><option>Microsoft low-code</option><option>Python / AI engineering</option><option>Cloud platform engineering</option><option>Mixed / no preference</option></select></div>
          <div className="select-field"><label>EXPECTED USERS</label><select value={usersScale} onChange={(e) => setUsersScale(e.target.value)}><option>{'< 50 users (demo / pilot)'}</option><option>{'50 – 5,000 users (department / line of business)'}</option><option>{'5,000 – 100,000 users (business unit / product)'}</option><option>{'100,000+ users (public internet scale)'}</option></select></div>
          <div className="select-field"><label>TRAFFIC PATTERN</label><select value={trafficPattern} onChange={(e) => setTrafficPattern(e.target.value)}><option>Steady, predictable load</option><option>Bursty / spiky traffic</option><option>Event-driven (webhooks / schedules)</option><option>Long-running / always-on processes</option></select></div>
          <div className="select-field"><label>OBSERVABILITY NEED</label><select value={observabilityNeed} onChange={(e) => setObservabilityNeed(e.target.value)}><option>Basic logs only</option><option>Standard monitoring + tracing</option><option>Full audit trail, evals &amp; compliance reporting</option></select></div>
        </div>
        <div className="panel-action">
          <div className="secure-note"><LockKeyhole size={14} /> Demo runs in your browser · No data is sent to an AI service</div>
          <button className="primary-btn" onClick={() => { setAnalyzed(true); setTab('blueprint'); }} disabled={!problem.trim()}><Sparkles size={17} /> Generate architecture decisions <ArrowRight size={16} /></button>
        </div>
      </section>

      <section className="results-head">
        <div><div className="step-label">02 / COMPARE DEPLOYMENT PATHS</div><h2>Deployment stack trade-off comparison <span className="count">{ranked.length} patterns scored</span></h2><p>Every pattern (A–I) is scored against your org scale, user volume, traffic shape, governance and observability needs, cost sensitivity, and team fit. This is a side-by-side trade-off comparison, not a single "best" answer — review the runner-ups before committing.</p></div>
      </section>

      <section className="panel stackcmp-panel">
        <div className="stackcmp-grid">
          {topStacks.map(({ stack: s, score: fit }, i) => (
            <div className="stackcmp-card" key={s.id}>
              <div className="stackcmp-rank">{i === 0 ? <Trophy size={13} /> : <span>#{i + 1}</span>}</div>
              <div className="stackcmp-head">
                <span className="stackcmp-letter">{s.id}</span>
                <div><b>{s.name}</b><span>{s.tagline}</span></div>
              </div>
              <div className="stackcmp-score"><span style={{ width: fit + '%' }} /></div>
              <div className="stackcmp-score-num">{fit}% context fit</div>
              <div className="stackcmp-badges">
                <span>Enterprise: {s.badges.enterprise}</span>
                <span>Cost: {s.badges.cost}</span>
                <span>Complexity: {s.badges.complexity}</span>
              </div>
              <div className="stackcmp-section"><b>Strengths here</b><ul>{s.strengths.map((st) => <li key={st}>{st}</li>)}</ul></div>
              <div className="stackcmp-section caution"><b><AlertTriangle size={12} /> Trade-offs to weigh</b><ul>{s.cons.slice(0, 2).map((c) => <li key={c}>{c}</li>)}</ul></div>
              <button className="secondary-btn" onClick={() => onOpenStack(s.id)}>Open Stack {s.id} in Deployment Guide <ArrowRight size={14} /></button>
            </div>
          ))}
        </div>

        <div className="stackcmp-matrix">
          <div className="stackcmp-matrix-head"><BarChart3 size={15} /><b>Scoring matrix — top candidates side by side</b></div>
          <div className="tablewrap-dark">
            <table>
              <thead><tr><th>Dimension (1–5)</th>{topStacks.map(({ stack: s }) => <th key={s.id}>Stack {s.id}</th>)}</tr></thead>
              <tbody>
                {SCORE_DIMENSIONS.map((d) => (
                  <tr key={d.key}>
                    <td>{d.label}</td>
                    {topStacks.map(({ stack: s }) => (
                      <td key={s.id}>
                        <div className="stackcmp-dimbar"><span style={{ width: (s.scores[d.key] / 5) * 100 + '%' }} /></div>
                        {s.scores[d.key]}/5
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="muted-note">Scores are an illustrative, explainable weighting of each stack's known operating characteristics against your selected context — not a live benchmark. Validate against real load tests, compliance review, and team capacity before committing.</p>
        </div>
      </section>

      <section className="results-head">
        <div><div className="step-label">03 / REVIEW THE BLUEPRINT</div><h2>Architecture decision map <span className="count">10 layers</span></h2><p>{analyzed ? 'Recommendations updated from your selected context. Review each choice before treating it as an architecture decision.' : 'Your initial reference blueprint is ready. Generate decisions to apply your project context.'}</p></div>
        <button className="outline-btn" onClick={exportBlueprint}><Download size={15} /> Export JSON</button>
      </section>

      <div className="results-layout">
        <section className="blueprint panel">
          <div className="tabs">
            <button className={tab === 'blueprint' ? 'tab active-tab' : 'tab'} onClick={() => setTab('blueprint')}>Decision map</button>
            <button className={tab === 'flow' ? 'tab active-tab' : 'tab'} onClick={() => setTab('flow')}>Request flow</button>
            <button className={tab === 'risks' ? 'tab active-tab' : 'tab'} onClick={() => setTab('risks')}>Risk & validation</button>
          </div>
          {tab === 'blueprint' && (
            <>
              <div className="map-summary">
                <div><span className="summary-icon"><Network size={17} /></span><div><b>Recommended reference architecture</b><span>10 decision domains · editable technology choices</span></div></div>
                <span className="confidence"><span />{score}% fit indicator*</span>
              </div>
              <div className="layer-list">
                {filtered.map((layer, i) => {
                  const Icon = iconMap[layer.icon] || Boxes;
                  return (
                    <div className="layer-row" key={layer.id}>
                      <div className="layer-index">{String(i + 1).padStart(2, '0')}</div>
                      <div className="layer-icon"><Icon size={17} /></div>
                      <div className="layer-body">
                        <div className="layer-title">{layer.name}<span className="decision-tag">DECISION</span></div>
                        <select value={layer.choice} onChange={(e) => updateLayer(layer.id, e.target.value)}>{layer.options.map((o) => <option key={o}>{o}</option>)}</select>
                        <p>{layer.why}</p>
                        <div className="tradeoff"><CircleHelp size={13} /><span>{layer.risk}</span></div>
                      </div>
                      <div className="layer-state"><Check size={14} /></div>
                    </div>
                  );
                })}
                {filtered.length === 0 && <div className="empty">No layers match that search.</div>}
              </div>
              <div className="blueprint-foot"><span>*Fit indicator is illustrative, not an AI confidence score or validated architecture rating.</span><button className="text-btn" onClick={() => setSearch(search ? '' : '')}>10 domains <ArrowDownRight size={14} /></button></div>
            </>
          )}
          {tab === 'flow' && (
            <div className="flow-view">
              <div className="flow-step"><div className="flow-icon"><Search size={18} /></div><div><b>1. Understand intent & constraints</b><p>Extract actors, outcomes, data classes, integrations, latency, availability, budget, and compliance needs.</p></div></div>
              <div className="flow-line" />
              <div className="flow-step"><div className="flow-icon"><GitBranch size={18} /></div><div><b>2. Apply decision rules</b><p>Filter patterns using constraints; compare options against fit, skills, risk, cost, and operational maturity.</p></div></div>
              <div className="flow-line" />
              <div className="flow-step"><div className="flow-icon"><Bot size={18} /></div><div><b>3. Produce an explainable proposal</b><p>Generate chosen patterns, rationale, alternatives, assumptions, unresolved questions, and confidence evidence.</p></div></div>
              <div className="flow-line" />
              <div className="flow-step"><div className="flow-icon"><ShieldCheck size={18} /></div><div><b>4. Architect review & gates</b><p>Require security, data, platform, and reliability approval before promoting the proposal to a production blueprint.</p></div></div>
              <div className="demo-callout"><Sparkles size={16} /><span>This prototype illustrates the workflow. A production build should connect an LLM, a curated architecture pattern library, and deterministic policy checks.</span></div>
            </div>
          )}
          {tab === 'risks' && (
            <div className="risk-view">
              <div className="risk-banner"><ShieldCheck size={21} /><div><b>Architecture is a decision, not a model answer</b><p>Use the following gates before approving a production design.</p></div></div>
              {[['Security & identity', 'Threat model, least-privilege tool access, tenant isolation, secrets, audit and PII controls.'], ['Data & semantic correctness', 'Source-of-truth definitions, row-level permissions, lineage, freshness, retrieval citations and access tests.'], ['Agent reliability', 'Tool allowlists, bounded retries, timeouts, idempotency, approval gates, fallback behavior and recovery.'], ['Quality & evaluation', 'Golden question set, task success rate, groundedness, unsafe-action tests, latency and regression suite.'], ['Cost & operations', 'Cost per successful task, token budgets, trace retention, SLOs, alerting, rollback and ownership.']].map((x, i) => (
                <div className="risk-row" key={x[0]}><span className="risk-num">0{i + 1}</span><div><b>{x[0]}</b><p>{x[1]}</p></div><span className="review-pill">Review required</span></div>
              ))}
            </div>
          )}
        </section>
        <aside className="right-rail">
          <div className="score-card panel">
            <div className="score-top"><span>ARCHITECTURE FIT</span><span className="tiny-spark"><Sparkles size={14} /></span></div>
            <div className="score-number">{score}<small>/100</small></div>
            <div className="score-track"><span style={{ width: score + '%' }} /></div>
            <p>Illustrative alignment based on the selected context. Not a validated quality or confidence score.</p>
            <div className="score-stats"><div><span>Decision layers</span><b>10</b></div><div><span>Human review</span><b>Required</b></div></div>
          </div>

          <div className="panel stackrec-card">
            <div className="rail-heading"><Rocket size={16} /><b>Top-ranked deployment stack</b></div>
            <div className="stackrec-pick">
              <span className="stackrec-letter">{topStack.id}</span>
              <div><b>{topStack.name}</b><span>{ranked[0].score}% context fit · full comparison above</span></div>
            </div>
            <button className="secondary-btn" onClick={() => onOpenStack(topStack.id)}>Open Stack {topStack.id} in Deployment Guide <ArrowRight size={14} /></button>
          </div>

          <div className="panel next-panel">
            <div className="rail-heading"><Sparkles size={16} /><b>Architect's next actions</b></div>
            <div className="next-item"><span className="check-circle"><Check size={12} /></span><div><b>Confirm non-functional requirements</b><p>Throughput, latency, availability, RTO/RPO and cost ceiling.</p></div></div>
            <div className="next-item"><span className="check-circle"><Check size={12} /></span><div><b>Validate data access boundaries</b><p>Identity propagation, tool permissions, and row-level security.</p></div></div>
            <div className="next-item"><span className="pending-circle">3</span><div><b>Benchmark candidate patterns</b><p>Measure accuracy, latency, reliability and cost on representative tasks.</p></div></div>
            <div className="next-item"><span className="pending-circle">4</span><div><b>Approve ADRs</b><p>Record decisions, rejected alternatives, owners and revisit triggers.</p></div></div>
            <button className="secondary-btn" onClick={exportBlueprint}><Download size={15} /> Export decision record</button>
          </div>
          <div className="principle-card">
            <div className="principle-icon"><Zap size={17} /></div>
            <b>Architecture principle</b>
            <p>Choose the simplest architecture that satisfies the requirements. Add agents, graph retrieval, eventing, and orchestration only when the use case justifies their complexity.</p>
          </div>
        </aside>
      </div>
    </>
  );
}
