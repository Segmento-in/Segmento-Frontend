"use client";
import { EyeOff, Lock } from 'lucide-react';

const S = {
  shell: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column' as const, borderRadius: 10, border: '1px solid var(--theme-border)', background: 'var(--theme-bg-surface)', boxShadow: '0 32px 80px rgba(0,0,0,0.5),0 0 0 1px rgba(91,110,245,0.12)', overflow: 'hidden', fontFamily: 'system-ui,sans-serif' },
  chrome: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', background: 'var(--theme-bg-surface-high)', borderBottom: '1px solid var(--theme-border-subtle)', flexShrink: 0 as const },
  urlbar: { flex: 1, margin: '0 12px', display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 5, background: 'var(--theme-bg)', border: '1px solid var(--theme-border-subtle)' },
  sidebar: { width: 110, flexShrink: 0 as const, background: '#0d0d14', borderRight: '1px solid var(--theme-border-subtle)', display: 'flex', flexDirection: 'column' as const },
  logoRow: { padding: '10px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid var(--theme-border-subtle)' },
  logoBox: { width: 16, height: 16, borderRadius: 4, background: '#5b6ef5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', fontWeight: 700 },
};

function Chrome({ url }: { url: string }) {
  return (
    <div style={S.chrome}>
      <div style={{ display: 'flex', gap: 5 }}>
        {['#ff5f57', '#febc2e', '#28c840'].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.8 }} />)}
      </div>
      <div style={S.urlbar}>
        <Lock size={8} color="var(--theme-fg-muted)" />
        <span style={{ fontSize: 10, color: 'var(--theme-fg-muted)', fontFamily: 'monospace' }}>{url}</span>
      </div>
    </div>
  );
}

function Sidebar({ items, active = 0 }: { items: { e: string; l: string }[]; active?: number }) {
  return (
    <div style={S.sidebar}>
      <div style={S.logoRow}>
        <div style={S.logoBox}>S</div>
        <span style={{ fontSize: 9, fontWeight: 600, color: '#f0f0f5', letterSpacing: '0.04em' }}>Segmento</span>
      </div>
      <nav style={{ padding: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((item, i) => (
          <div key={item.l} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 6px', borderRadius: 5, background: i === active ? 'rgba(91,110,245,0.18)' : 'transparent' }}>
            <span style={{ fontSize: 10 }}>{item.e}</span>
            <span style={{ fontSize: 9, fontWeight: i === active ? 600 : 400, color: i === active ? '#5b6ef5' : '#6b6b82' }}>{item.l}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}

function Shell({ url, items, active, children }: { url: string; items: { e: string; l: string }[]; active?: number; children: React.ReactNode }) {
  return (
    <div style={S.shell}>
      <Chrome url={url} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar items={items} active={active} />
        <div style={{ flex: 1, overflow: 'hidden' }}>{children}</div>
      </div>
    </div>
  );
}

export function SenseShell() {
  const items = [{ e: '📊', l: 'Dashboard' }, { e: '🛡', l: 'Scan' }, { e: '📁', l: 'Reports' }, { e: '⚙️', l: 'Settings' }, { e: '🤖', l: 'AI Models' }];
  const rows = [{ label: 'Name', chips: ['NAME', 'SURNAME'] }, { label: 'DOB', chips: ['DATE'] }, { label: 'Address', chips: ['STREET', 'CITY'] }, { label: 'Email', chips: ['EMAIL'] }];
  const lines: (number | string)[][] = [[50, 'PII', 60], [40, 'DNI', 35, 'EMAIL', 30], [85], [30, 'ACCOUNT', 55]];
  return (
    <Shell url="app.segmento.in/sense" items={items} active={1}>
      <div style={{ flex: 1, background: '#f6f8ff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 14px', background: '#fff', borderBottom: '1px solid #e2e4ef', flexShrink: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#1b1b20' }}>Q3 Financial Report.pdf</span>
          <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 8, fontWeight: 600, background: 'rgba(16,232,152,0.1)', border: '1px solid rgba(16,232,152,0.25)', color: '#10e898', fontFamily: 'monospace' }}>✓ Scanned</span>
        </div>
        <div style={{ flex: 1, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
          <div className="scanner-line" />
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1b1b20', marginBottom: 8 }}>Q3 Financial Report</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {rows.map(({ label, chips }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: '#9090a0', fontFamily: 'monospace', minWidth: 46 }}>{label}:</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {chips.map(t => <span key={t} className="chip-redacted"><EyeOff size={7} />{t}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {lines.map((blocks, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                {blocks.map((b, j) => typeof b === 'number'
                  ? <div key={j} style={{ height: 7, width: `${b}px`, borderRadius: 2, background: 'rgba(100,100,120,0.15)' }} />
                  : <span key={j} className="chip-redacted"><EyeOff size={7} />{b}</span>
                )}
              </div>
            ))}
          </div>
          <div style={{ position: 'absolute', bottom: 10, left: 14, right: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderRadius: 8, background: 'rgba(91,110,245,0.06)', border: '1px solid rgba(91,110,245,0.15)' }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: '#5b6ef5', fontFamily: 'monospace' }}>18 AI Models · Self-Hosted</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#10e898', fontFamily: 'monospace' }}>99.8% Confidence</span>
          </div>
        </div>
      </div>
    </Shell>
  );
}

export function PulseShell() {
  const items = [{ e: '📊', l: 'Dashboard' }, { e: '🌐', l: 'Regulatory' }, { e: '🗺️', l: 'Map' }, { e: '🔔', l: 'Alerts' }, { e: '⚙️', l: 'Settings' }];
  const feed = [
    { color: '#ef4444', label: 'BREAKING', title: 'EU AI Act enforcement begins Q3 2025', src: 'EUR-Lex · 2h ago' },
    { color: '#f59e0b', label: 'WATCH', title: 'DPDP Act rules finalised by MeitY', src: 'MeitY · 5h ago' },
    { color: '#10e898', label: 'INFO', title: 'HIPAA safe-harbour updated for cloud processors', src: 'HHS.gov · 1d ago' },
  ];
  const regions = [
    { label: 'EU', fill: '#ef4444' }, { label: 'US', fill: '#f59e0b' }, { label: 'IN', fill: '#f59e0b' },
    { label: 'UK', fill: '#10e898' }, { label: 'CN', fill: '#6b6b82' }, { label: 'AU', fill: '#10e898' },
  ];
  return (
    <Shell url="app.segmento.in/pulse" items={items} active={1}>
      <div style={{ flex: 1, background: 'var(--theme-bg-surface)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 14px', borderBottom: '1px solid var(--theme-border-subtle)', flexShrink: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--theme-fg)' }}>Regulatory Feed</span>
          <span className="urgency-live" style={{ padding: '2px 8px', borderRadius: 999, fontSize: 8, fontWeight: 600, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontFamily: 'monospace' }}>● LIVE</span>
        </div>
        <div style={{ padding: '10px 12px', display: 'flex', gap: 6, flexWrap: 'wrap', borderBottom: '1px solid var(--theme-border-subtle)' }}>
          {regions.map(r => (
            <div key={r.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <div style={{ width: 28, height: 18, borderRadius: 3, background: r.fill + '22', border: `1px solid ${r.fill}55`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 7, fontWeight: 700, color: r.fill }}>{r.label}</span>
              </div>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: r.fill }} />
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 6, overflow: 'hidden' }}>
          {feed.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, padding: '8px 10px', borderRadius: 6, background: 'var(--theme-bg-surface-high)', border: '1px solid var(--theme-border-subtle)' }}>
              <span style={{ padding: '2px 6px', borderRadius: 999, fontSize: 7, fontWeight: 700, background: item.color + '22', color: item.color, fontFamily: 'monospace', flexShrink: 0, height: 'fit-content' }}>{item.label}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--theme-fg)' }}>{item.title}</span>
                <span style={{ fontSize: 8, color: 'var(--theme-fg-muted)', fontFamily: 'monospace' }}>{item.src}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

export function CollectShell() {
  const items = [{ e: '📊', l: 'Dashboard' }, { e: '🔌', l: 'Sources' }, { e: '⚡', l: 'Pipelines' }, { e: '🔁', l: 'Recovery' }, { e: '⚙️', l: 'Settings' }];
  const sources = [{ e: '☁️', l: 'AWS S3' }, { e: '💬', l: 'Slack' }, { e: '🐘', l: 'Postgres' }, { e: '📂', l: 'G-Drive' }];
  const outputs = [{ e: '🗄️', l: 'Data Lake' }, { e: '📊', l: 'Reports' }, { e: '🔔', l: 'Alerts' }];
  return (
    <Shell url="app.segmento.in/collect" items={items} active={2}>
      <div style={{ flex: 1, background: 'var(--theme-bg-surface)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '7px 14px', borderBottom: '1px solid var(--theme-border-subtle)', flexShrink: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--theme-fg)' }}>Pipeline · Active</span>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '12px 16px', gap: 8, overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sources.map(s => (
              <div key={s.l} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 8px', borderRadius: 6, background: 'var(--theme-bg-surface-high)', border: '1px solid var(--theme-border-subtle)' }}>
                <span style={{ fontSize: 10 }}>{s.e}</span>
                <span style={{ fontSize: 8, fontWeight: 600, color: 'var(--theme-fg-muted)' }}>{s.l}</span>
              </div>
            ))}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', position: 'relative', padding: '0 8px' }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ width: '100%', height: 1, background: 'var(--theme-border-subtle)', position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div className="flow-dot" style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: '#5b6ef5', left: 0, top: -3 }} />
                <div className="flow-dot" style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: '#5b6ef5', left: 0, top: -3, animationDelay: `${i * 0.45}s` }} />
              </div>
            ))}
            <div style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(91,110,245,0.15)', border: '1px solid rgba(91,110,245,0.4)', position: 'absolute' }}>
              <span style={{ fontSize: 8, fontWeight: 700, color: '#5b6ef5', fontFamily: 'monospace' }}>Segmento Collect</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {outputs.map(o => (
              <div key={o.l} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 8px', borderRadius: 6, background: 'rgba(16,232,152,0.08)', border: '1px solid rgba(16,232,152,0.2)' }}>
                <span style={{ fontSize: 10 }}>{o.e}</span>
                <span style={{ fontSize: 8, fontWeight: 600, color: '#10e898' }}>{o.l}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '8px 16px', borderTop: '1px solid var(--theme-border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 8, color: 'var(--theme-fg-muted)', fontFamily: 'monospace' }}>12 sources connected</span>
          <span style={{ fontSize: 8, fontWeight: 700, color: '#10e898', fontFamily: 'monospace' }}>● All pipelines healthy</span>
        </div>
      </div>
    </Shell>
  );
}

export function ResolveShell() {
  const items = [{ e: '📊', l: 'Dashboard' }, { e: '📋', l: 'Requests' }, { e: '⏱️', l: 'SLA' }, { e: '🔍', l: 'Audit' }, { e: '⚙️', l: 'Settings' }];
  const cols = [
    { label: 'Incoming', color: '#6b6b82', cards: [{ init: 'AK', type: 'DSAR', sla: '28d', slac: '#10e898' }, { init: 'SR', type: 'Delete Req', sla: '14d', slac: '#f59e0b' }] },
    { label: 'In Review', color: '#f59e0b', cards: [{ init: 'MP', type: 'Access Req', sla: '7d', slac: '#f59e0b' }] },
    { label: 'Resolved', color: '#10e898', cards: [{ init: 'JD', type: 'Rectify', sla: '✓', slac: '#10e898' }, { init: 'LK', type: 'DSAR', sla: '✓', slac: '#10e898' }] },
  ];
  return (
    <Shell url="app.segmento.in/resolve" items={items} active={1}>
      <div style={{ flex: 1, background: 'var(--theme-bg-surface)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '7px 14px', borderBottom: '1px solid var(--theme-border-subtle)', flexShrink: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--theme-fg)' }}>Request Board</span>
        </div>
        <div style={{ flex: 1, display: 'flex', gap: 8, padding: '10px 12px', overflow: 'hidden' }}>
          {cols.map(col => (
            <div key={col.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: col.color }} />
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--theme-fg-muted)', fontFamily: 'monospace', textTransform: 'uppercase' as const }}>{col.label}</span>
              </div>
              {col.cards.map((card, i) => (
                <div key={i} style={{ padding: '7px 8px', borderRadius: 6, background: 'var(--theme-bg-surface-high)', border: '1px solid var(--theme-border-subtle)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(91,110,245,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 700, color: '#5b6ef5' }}>{card.init}</div>
                    <span style={{ fontSize: 8, fontWeight: 600, color: 'var(--theme-fg)' }}>{card.type}</span>
                  </div>
                  <span style={{ fontSize: 7, fontWeight: 600, fontFamily: 'monospace', color: card.slac }}>SLA: {card.sla}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

export function SprintQLShell() {
  const items = [{ e: '📋', l: 'Board' }, { e: '⚡', l: 'Actions' }, { e: '📈', l: 'Insights' }, { e: '👥', l: 'Team' }, { e: '⚙️', l: 'Settings' }];
  const cols = [
    { label: 'Went Well 🟢', cards: [{ text: 'API response time improved 40%', votes: 5, color: '#10e898' }, { text: 'Zero P1 bugs this sprint', votes: 3, color: '#10e898' }] },
    { label: 'Improve 🟡', cards: [{ text: 'Deploy pipeline too slow', votes: 4, color: '#f59e0b' }, { text: 'Missing staging env docs', votes: 2, color: '#f59e0b' }] },
    { label: 'Actions ⚡', cards: [{ text: 'Add caching layer to API', votes: 6, color: '#5b6ef5' }, { text: 'Write runbook for deploys', votes: 3, color: '#5b6ef5' }] },
  ];
  const cursors = [{ color: '#ef4444', x: 60, y: 30 }, { color: '#5b6ef5', x: 150, y: 80 }, { color: '#10e898', x: 260, y: 50 }];
  return (
    <Shell url="app.sprintql.io" items={items} active={0}>
      <div style={{ flex: 1, background: 'var(--theme-bg-surface)', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        {cursors.map((c, i) => (
          <div key={i} style={{ position: 'absolute', left: c.x, top: c.y, width: 10, height: 10, borderRadius: '50% 50% 50% 0', background: c.color, transform: 'rotate(-45deg)', zIndex: 10, opacity: 0.85 }} />
        ))}
        <div style={{ padding: '7px 14px', borderBottom: '1px solid var(--theme-border-subtle)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--theme-fg)' }}>Sprint 24 Retro</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {cursors.map((c, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }} />)}
            <span style={{ fontSize: 8, color: 'var(--theme-fg-muted)', fontFamily: 'monospace' }}>3 live</span>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', gap: 8, padding: '10px 12px', overflow: 'hidden' }}>
          {cols.map(col => (
            <div key={col.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 8, fontWeight: 600, color: 'var(--theme-fg-muted)' }}>{col.label}</span>
              {col.cards.map((card, i) => (
                <div key={i} style={{ padding: '7px 8px', borderRadius: 6, background: 'var(--theme-bg-surface-high)', border: `1px solid ${card.color}33`, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 8, color: 'var(--theme-fg)', lineHeight: 1.4 }}>{card.text}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ fontSize: 7, color: card.color }}>▲</span>
                    <span style={{ fontSize: 7, fontWeight: 700, color: card.color, fontFamily: 'monospace' }}>{card.votes}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ padding: '6px 14px', borderTop: '1px solid var(--theme-border-subtle)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#5b6ef5' }} className="urgency-live" />
          <span style={{ fontSize: 8, color: 'var(--theme-fg-muted)', fontFamily: 'monospace' }}>Sarah is typing an action item...</span>
        </div>
      </div>
    </Shell>
  );
}
