import React, { useMemo, useState } from 'react';
import { BarChart3, CircleHelp, ShieldCheck, Sparkles } from 'lucide-react';
import { stacks, decisionShortcuts, getStack, SCORE_DIMENSIONS } from '../data/stacks.js';

export default function StackGuide({ focusId, setFocusId }) {
  const [search, setSearch] = useState('');
  const active = getStack(focusId) || stacks[0];
  const filteredStacks = useMemo(
    () => stacks.filter((s) => (s.name + s.tagline + s.badges.usage).toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  return (
    <>
      <section className="hero sg-hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14} /> AGENT PRODUCTION DEPLOYMENT</div>
          <h1>Deployment Stack Guide<br /><span>Nine proven patterns, A through I.</span></h1>
          <p>There is no universally "best" deployment stack — the right one depends on UI style, execution duration, durable state, traffic pattern, security, and team skills. Compare the nine patterns below, or let the Decision Workbench recommend one from your project context.</p>
        </div>
      </section>

      <section className="panel sg-ladder-panel">
        <div className="section-head"><div><div className="step-label">PICK A STACK</div><h2>The nine-pattern mental model</h2></div></div>
        <div className="sg-ladder">
          {stacks.map((s) => (
            <button key={s.id} className={s.id === active.id ? 'sg-ladder-cell active' : 'sg-ladder-cell'} onClick={() => setFocusId(s.id)}>
              <b>{s.id}</b>
              <span>{s.name}</span>
              <small>{s.badges.usage}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="panel sg-detail">
        <div className="sg-detail-head">
          <div className="sg-detail-letter">{active.id}</div>
          <div>
            <div className="step-label">STACK {active.id}</div>
            <h2>{active.name}</h2>
            <p className="sg-tagline">{active.tagline}</p>
          </div>
        </div>
        <div className="sg-badges">
          <span>Usage: {active.badges.usage}</span>
          <span>Enterprise: {active.badges.enterprise}</span>
          <span>Solo/hobby: {active.badges.solo}</span>
          <span>Cost: {active.badges.cost}</span>
          <span>Complexity: {active.badges.complexity}</span>
        </div>

        <div className="callout plain-dark"><b>Explain it simply:</b> {active.explain}</div>

        <div className="sg-grid2">
          <div>
            <h3>When should I use this?</h3>
            <ul>{active.useCases.map((u) => <li key={u}>{u}</li>)}</ul>
            <p className="sg-designcall"><b>Design call:</b> {active.designCall}</p>
          </div>
          <div>
            <h3>Vendor options</h3>
            <div className="sg-vendor-list">
              {active.vendors.map((v) => (
                <div className="sg-vendor" key={v.name}>
                  <b>{v.name}</b>
                  <span>{v.why}</span>
                  <em>{v.cost}</em>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h3>How this stack wraps the agentic system</h3>
        <div className="sg-ownership">
          <div className="sg-own owned"><b>Direct ownership</b><p>{active.ownership.owned.join(', ')}</p></div>
          <div className="sg-own partial"><b>Integrated / shared</b><p>{active.ownership.partial.join(', ')}</p></div>
          <div className="sg-own external"><b>Usually external</b><p>{active.ownership.external.join(', ')}</p></div>
        </div>

        <div className="sg-grid2">
          <div>
            <h3>Mandatory conditions</h3>
            <ul>{active.mandatory.map((m) => <li key={m}>{m}</li>)}</ul>
          </div>
          <div>
            <h3>Good-to-have prerequisites</h3>
            <ul>{active.goodToHave.map((m) => <li key={m}>{m}</li>)}</ul>
          </div>
        </div>

        <h3>Typical system diagram</h3>
        <div className="sg-flow">
          {active.diagram.map((box, i) => (
            <React.Fragment key={box}>
              <span className="sg-flow-box">{box}</span>
              {i < active.diagram.length - 1 && <span className="sg-flow-arrow">→</span>}
            </React.Fragment>
          ))}
        </div>

        <div className="sg-grid2">
          <div className="callout plain-dark"><b>Cost implications:</b> {active.costNote}</div>
          <div className="callout plain-dark"><b>Latency implications:</b> {active.latencyNote}</div>
        </div>

        <h3>Scoring profile (1–5, independent of any project context)</h3>
        <div className="sg-scoreprofile">
          {SCORE_DIMENSIONS.map((d) => (
            <div className="sg-scorerow" key={d.key}>
              <span>{d.label}</span>
              <div className="stackcmp-dimbar"><span style={{ width: (active.scores[d.key] / 5) * 100 + '%' }} /></div>
              <b>{active.scores[d.key]}/5</b>
            </div>
          ))}
        </div>

        <h3>Cons / trade-offs</h3>
        <ul className="sg-cons">{active.cons.map((c) => <li key={c}>{c}</li>)}</ul>

        <h3>Step-by-step implementation</h3>
        <ol className="sg-steps">{active.steps.map((s) => <li key={s}>{s}</li>)}</ol>

        <h3>Things to be careful about</h3>
        <ul className="sg-cons">{active.careful.map((c) => <li key={c}>{c}</li>)}</ul>

        <h3>Interview questions</h3>
        <div className="sg-qa-list">
          {active.interview.map((qa) => (
            <details className="sg-qa" key={qa.q}>
              <summary><CircleHelp size={13} /> {qa.q}</summary>
              <p>{qa.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="panel sg-compare">
        <div className="section-head"><div><div className="step-label">COMPARE</div><h2>Master comparison <span className="count">{stacks.length} patterns</span></h2></div></div>
        <div className="select-field sg-search"><input placeholder="Search by name, usage..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <div className="tablewrap-dark">
          <table>
            <thead><tr><th>Pattern</th><th>Enterprise</th><th>Solo/hobby</th><th>Cost</th><th>Complexity</th></tr></thead>
            <tbody>
              {filteredStacks.map((s) => (
                <tr key={s.id} className={s.id === active.id ? 'sg-row-active' : ''} onClick={() => setFocusId(s.id)}>
                  <td><b>{s.id} · {s.name}</b><br /><span className="sg-row-sub">{s.badges.usage}</span></td>
                  <td>{s.badges.enterprise}</td>
                  <td>{s.badges.solo}</td>
                  <td>{s.badges.cost}</td>
                  <td>{s.badges.complexity}</td>
                </tr>
              ))}
              {filteredStacks.length === 0 && <tr><td colSpan={5} className="empty">No stacks match that search.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="section-head sg-matrix-head"><div><div className="step-label"><BarChart3 size={11} /> TRADE-OFF MATRIX</div><h2>Scalability, governance &amp; observability — all 9 patterns</h2></div></div>
        <div className="tablewrap-dark">
          <table>
            <thead><tr><th>Pattern</th>{SCORE_DIMENSIONS.map((d) => <th key={d.key}>{d.label}</th>)}</tr></thead>
            <tbody>
              {filteredStacks.map((s) => (
                <tr key={s.id} className={s.id === active.id ? 'sg-row-active' : ''} onClick={() => setFocusId(s.id)}>
                  <td><b>{s.id} · {s.name}</b></td>
                  {SCORE_DIMENSIONS.map((d) => (
                    <td key={d.key}>
                      <div className="stackcmp-dimbar"><span style={{ width: (s.scores[d.key] / 5) * 100 + '%' }} /></div>
                      {s.scores[d.key]}/5
                    </td>
                  ))}
                </tr>
              ))}
              {filteredStacks.length === 0 && <tr><td colSpan={SCORE_DIMENSIONS.length + 1} className="empty">No stacks match that search.</td></tr>}
            </tbody>
          </table>
        </div>
        <p className="muted-note">Scores are illustrative, relative ratings of each pattern's known operating characteristics (1 = weak fit, 5 = strong fit) — use them to shortlist and discuss trade-offs, not as a certified benchmark.</p>
      </section>

      <section className="panel sg-shortcuts">
        <div className="section-head"><div><div className="step-label">QUICK REFERENCE</div><h2>Decision shortcut</h2></div></div>
        <div className="sg-shortcut-grid">
          {decisionShortcuts.map((d) => (
            <button className="sg-shortcut-item" key={d.q} onClick={() => setFocusId(d.a)}>
              <span>{d.q}</span>
              <b>→ {d.a}</b>
            </button>
          ))}
        </div>
        <div className="callout plain-dark sg-note">
          <ShieldCheck size={16} /> A custom domain is a routing/branding layer on top of a stack — it does not create a tenth compute architecture.
        </div>
      </section>
    </>
  );
}
