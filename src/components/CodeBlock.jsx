import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function CodeBlock({ label, code }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }
  return (
    <div className="codeblock">
      {label && <div className="codeblock-label">{label}</div>}
      <div className="codeblock-body">
        <button className="codeblock-copy" onClick={copy} type="button">
          {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy'}
        </button>
        <pre><code>{code}</code></pre>
      </div>
    </div>
  );
}
