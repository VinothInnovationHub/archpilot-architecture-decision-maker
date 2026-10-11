import React, { useState } from 'react';
import { Sparkles, ListChecks, CircleHelp } from 'lucide-react';
import { productionSections, labChecklist } from '../data/production.js';
import CodeBlock from '../components/CodeBlock.jsx';

export default function Production() {
  const [active, setActive] = useState(productionSections[0].id);
  const section = productionSections.find((s) => s.id === active) || productionSections[0];

  return (
    <>
      <section className="hero sg-hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14} /> PRACTICAL ENGINEERING MODULE</div>
          <h1>Containerization &amp; Production Delivery<br /><span>The hands-on companion to the stack guide.</span></h1>
          <p>The Deployment Stack Guide answers "which pattern fits my workload?". This playbook answers "once I choose a container-based path, how do I package and ship it professionally?" — most relevant to Stacks B, C, E, H and I.</p>
        </div>
      </section>

      <nav className="pp-subtabs">
        {productionSections.map((s) => (
          <button key={s.id} className={s.id === active ? 'pp-subtab active' : 'pp-subtab'} onClick={() => setActive(s.id)}>{s.title}</button>
        ))}
      </nav>

      <section className="panel pp-panel">
        <div className="pp-scenario">
          <div className="pp-scenario-label">Start with the problem</div>
          <p><b>{section.problem}</b></p>
          <div className="pp-reveal"><b>Concept:</b> {section.concept}</div>
        </div>
        <ul className="sg-cons">{section.points.map((p) => <li key={p}>{p}</li>)}</ul>
        {section.code.map((c) => <CodeBlock key={c.label} label={c.label} code={c.code} />)}
      </section>

      <section className="panel pp-labs">
        <div className="section-head"><div><div className="step-label">HANDS-ON CLASSWORK</div><h2><ListChecks size={18} /> Lab progression checklist</h2></div></div>
        <div className="pp-lab-list">
          {labChecklist.map((l, i) => (
            <div className="pp-lab-row" key={l.stage}>
              <span className="pp-lab-num">{i}</span>
              <div><b>{l.stage}</b><p>{l.goal}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="callout plain-dark pp-debug">
        <CircleHelp size={16} />
        <div>
          <b>Universal debugging prompt (for Claude Code or any AI pair-programmer):</b>
          <p>"The following command failed: &lt;command&gt;. Exact output: &lt;error&gt;. Current goal: &lt;one sentence&gt;. Explain the likely root cause in beginner language, inspect only relevant files, propose the smallest fix, and tell me exactly what to rerun to verify. Do not run cloud commands that create/delete resources or incur cost."</p>
        </div>
      </section>
    </>
  );
}
