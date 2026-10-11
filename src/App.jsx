import React, { useState } from 'react';
import {
  Boxes, ChevronDown, CircleHelp, GitBranch,
  Layers3, Server, BookOpen, ListChecks,
} from 'lucide-react';
import Workbench from './views/Workbench.jsx';
import StackGuide from './views/StackGuide.jsx';
import Production from './views/Production.jsx';
import Glossary from './views/Glossary.jsx';
import Scenarios from './views/Scenarios.jsx';

const NAV = [
  { id: 'workbench', label: 'Decision Workbench', icon: Layers3 },
  { id: 'stacks', label: 'Deployment Stack Guide', icon: Boxes },
  { id: 'production', label: 'Production Playbook', icon: Server },
  { id: 'glossary', label: 'Glossary', icon: BookOpen },
  { id: 'scenarios', label: 'Scenario Drills', icon: ListChecks },
];

const CRUMB = {
  workbench: 'Decision Workbench',
  stacks: 'Deployment Stack Guide',
  production: 'Production Playbook',
  glossary: 'Glossary',
  scenarios: 'Scenario Drills',
};

export default function App() {
  const [view, setView] = useState('workbench');
  const [focusStack, setFocusStack] = useState('C');

  function openStack(id) {
    setFocusStack(id);
    setView('stacks');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><GitBranch size={21} /></div>
          <div><b>ARCHPILOT</b><span>ARCHITECTURE INTELLIGENCE</span></div>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        {NAV.map((n) => {
          const Icon = n.icon;
          const active = view === n.id;
          return (
            <button key={n.id} className={active ? 'nav active' : 'nav'} onClick={() => setView(n.id)}>
              <Icon size={17} /> {n.label} {active && <span className="nav-dot" />}
            </button>
          );
        })}
        <div className="sidebar-bottom">
          <div className="status-card">
            <div className="status-top"><span className="live-dot" /> DEMO MODE</div>
            <p>Recommendations run locally using illustrative decision rules. No external AI is connected.</p>
          </div>
          <div className="profile">
            <div className="avatar">EA</div>
            <div><b>Enterprise Architect</b><span>Solution design workspace</span></div>
            <ChevronDown size={15} />
          </div>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <div className="crumb">Architecture Studio <span>/</span> <b>{CRUMB[view]}</b></div>
          <div className="top-actions">
            <span className="env-pill"><span className="live-dot" /> Interactive prototype</span>
            <button className="icon-btn" title="Help"><CircleHelp size={18} /></button>
          </div>
        </header>
        <div className="content" key={view}>
          {view === 'workbench' && <Workbench onOpenStack={openStack} />}
          {view === 'stacks' && <StackGuide focusId={focusStack} setFocusId={setFocusStack} />}
          {view === 'production' && <Production />}
          {view === 'glossary' && <Glossary />}
          {view === 'scenarios' && <Scenarios onOpenStack={openStack} />}
        </div>
        <footer>
          <span>ARCHPILOT <span className="footer-dot">·</span> ENTERPRISE ARCHITECTURE &amp; DEPLOYMENT DECISION PLATFORM</span>
          <span>Interactive UI prototype · Rule-based demo · Not production-connected</span>
        </footer>
      </main>
    </div>
  );
}
