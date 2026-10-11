import React, { useMemo, useState } from 'react';
import { Sparkles, Search } from 'lucide-react';
import { glossary } from '../data/glossary.js';

export default function Glossary() {
  const [search, setSearch] = useState('');
  const filtered = useMemo(
    () => glossary.filter(([term, def]) => (term + def).toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  return (
    <>
      <section className="hero sg-hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14} /> REFERENCE</div>
          <h1>Glossary of deployment &amp; architecture terms<br /><span>Plain-English explanations.</span></h1>
          <p>{glossary.length} terms used across the Decision Workbench, Deployment Stack Guide and Production Playbook.</p>
        </div>
      </section>
      <section className="panel gl-panel">
        <div className="gl-search"><Search size={14} /><input placeholder="Search terms..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <div className="gl-grid">
          {filtered.map(([term, def]) => (
            <div className="gl-item" key={term}><h3>{term}</h3><p>{def}</p></div>
          ))}
          {filtered.length === 0 && <div className="empty">No terms match that search.</div>}
        </div>
      </section>
    </>
  );
}
