import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { scenarios } from '../data/scenarios.js';
import { getStack } from '../data/stacks.js';

export default function Scenarios({ onOpenStack }) {
  const [revealed, setRevealed] = useState({});
  function toggle(i) { setRevealed((r) => ({ ...r, [i]: !r[i] })); }

  return (
    <>
      <section className="hero sg-hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14} /> KNOWLEDGE CHECK</div>
          <h1>20 scenario-based stack decisions<br /><span>Train the team's judgment, not vendor trivia.</span></h1>
          <p>Try to pick the stack before revealing the answer. The goal is to learn the design reasoning behind each call — give learners 60–90 seconds per case.</p>
        </div>
      </section>
      <section className="panel sc-list">
        {scenarios.map((s, i) => {
          const stack = getStack(s.stack.split(' ')[0].replace(/[^A-Z]/g, ''));
          return (
            <div className="sc-item" key={i}>
              <div className="sc-head" onClick={() => toggle(i)}>
                <span className="sc-num">{i + 1}</span>
                <p>{s.situation}</p>
              </div>
              {revealed[i] && (
                <div className="sc-answer">
                  <span className="sc-pick">Stack {s.stack}</span>
                  <p>{s.why}</p>
                  {stack && <button className="text-btn" onClick={() => onOpenStack(stack.id)}>Open Stack {stack.id} in the guide <ArrowRight size={13} /></button>}
                </div>
              )}
              {!revealed[i] && <button className="text-btn sc-reveal" onClick={() => toggle(i)}>Reveal answer</button>}
            </div>
          );
        })}
      </section>
    </>
  );
}
