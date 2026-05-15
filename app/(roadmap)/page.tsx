import Link from 'next/link'

function PillarPill({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm"
      style={{ backgroundColor: `${color}18`, color }}
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
      {label}
    </div>
  )
}

function PillarPillSmall({ icon, color }: { icon: string; color: string }) {
  return (
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded-full"
      style={{ backgroundColor: `${color}18`, color }}
    >
      <span className="material-symbols-outlined text-[14px]">{icon}</span>
    </span>
  )
}

function PillarTag({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${color}18`, color }}
    >
      <span className="material-symbols-outlined text-[13px]">{icon}</span>
      {label}
    </span>
  )
}

function StatBlock({ number, label, source }: { number: string; label: string; source: string }) {
  return (
    <div>
      <p className="text-2xl font-black text-[#001629] leading-none">{number}</p>
      <p className="text-xs text-on-surface mt-0.5">{label}</p>
      <p className="text-[10px] text-on-muted italic mt-0.5">{source}</p>
    </div>
  )
}

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-block bg-surface-low text-on-muted text-[11px] font-medium px-2.5 py-1 rounded">
      {label}
    </span>
  )
}

function Quote({ text, accentColor }: { text: string; accentColor: string }) {
  return (
    <blockquote
      className="pl-4 italic text-on-muted text-sm leading-relaxed mt-4"
      style={{ borderLeft: `2px solid ${accentColor}33` }}
    >
      &ldquo;{text}&rdquo;
    </blockquote>
  )
}

const ROW_LABEL_CLASS = 'w-40 shrink-0 bg-[#001629] text-white p-5 rounded flex items-center'
const CELL_CLASS = 'flex-1 bg-surface-card p-5 rounded shadow-card flex flex-col gap-3'
const ROW_MUTED_CLASS = 'flex gap-6 mb-6 items-stretch'
const ROW_TINTED_CLASS = 'flex gap-6 mb-6 bg-surface-low p-4 rounded-xl items-stretch'

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-canvas text-on-surface">
      {/* Top Navigation */}
      <nav className="bg-nav text-white flex justify-between items-center px-8 h-16 sticky top-0 z-50" style={{ boxShadow: '0 2px 16px rgba(0,22,41,0.12)' }}>
        <span className="font-extrabold text-base tracking-tight">Project Agora</span>
        <span className="text-white/50 text-sm hidden md:block">Eagle Eye Networks × Brivo OS</span>
        <span className="inline-flex items-center gap-1.5 bg-white/10 text-white/80 text-xs px-3 py-1.5 rounded">
          <span className="material-symbols-outlined text-base">bolt</span>
          Live Demo Available
        </span>
      </nav>

      <main className="max-w-[1400px] mx-auto px-8 py-12">
        {/* Hero */}
        <header className="mb-14">
          <h1 className="text-5xl font-extrabold tracking-tight text-[#001629] mb-4 leading-tight">
            Physical AI Events Marketplace
          </h1>
          <p className="text-xl text-on-muted max-w-3xl leading-relaxed">
            Vendor-agnostic platform correlating physical signals from any vendor into actionable intelligence — Brivo OS
          </p>
        </header>

        {/* Pillar Badges */}
        <div className="flex flex-wrap gap-3 mb-16">
          <PillarPill icon="lock" label="Brivo for Security" color="#DC2626" />
          <PillarPill icon="health_and_safety" label="Brivo for Compliance" color="#16A34A" />
          <PillarPill icon="hub" label="Brivo for Operations" color="#2563EB" />
        </div>

        {/* Roadmap Grid */}
        <div className="w-full overflow-x-auto pb-8">
          <div className="min-w-[900px]">

            {/* Column Headers */}
            <div className="flex mb-8 items-end gap-6">
              <div className="w-40 shrink-0" />

              {/* Phase 1 */}
              <div className="flex-1">
                <div className="h-1 w-full bg-[#1E3A5F] mb-4 rounded-t" />
                <h2 className="font-extrabold text-2xl text-[#001629] mb-1">Phase 1</h2>
                <p className="text-on-muted text-sm mb-5">Months 1–6</p>
                <Link
                  href="/journey"
                  className="flex items-center justify-between w-full bg-[#1E3A5F] text-white py-3 px-4 rounded font-semibold text-sm hover:opacity-90 transition-opacity"
                  style={{ boxShadow: '0 4px 16px rgba(30,58,95,0.25)' }}
                >
                  Explore Phase 1 Demo
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>

              {/* Phase 2 */}
              <div className="flex-1">
                <div className="h-1 w-full bg-violet mb-4 rounded-t" />
                <h2 className="font-extrabold text-2xl text-[#001629] mb-1">Phase 2</h2>
                <p className="text-on-muted text-sm mb-5">Months 7–12</p>
                <Link
                  href="/incidents"
                  className="flex items-center justify-between w-full bg-violet text-white py-3 px-4 rounded font-semibold text-sm hover:opacity-90 transition-opacity"
                  style={{ boxShadow: '0 4px 16px rgba(86,68,208,0.25)' }}
                >
                  Explore Phase 2 Demo
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>

              {/* Phase 3 */}
              <div className="flex-1">
                <div className="h-1 w-full bg-ph3-badge mb-4 rounded-t" />
                <h2 className="font-extrabold text-2xl text-[#001629] mb-1">Phase 3</h2>
                <p className="text-on-muted text-sm mb-5">Months 13–18</p>
                <Link
                  href="/world-aware"
                  className="flex items-center justify-between w-full bg-ph3-badge text-white py-3 px-4 rounded font-semibold text-sm hover:opacity-90 transition-opacity"
                  style={{ boxShadow: '0 4px 16px rgba(217,119,6,0.25)' }}
                >
                  Explore Phase 3 Demo
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Row 1 — Use Case & Outcome */}
            <div className={ROW_TINTED_CLASS}>
              <div className={ROW_LABEL_CLASS}>
                <h3 className="font-semibold text-sm leading-snug">Use Case &amp; Outcome</h3>
              </div>
              <div className={CELL_CLASS}>
                <PillarTag icon="lock" label="Brivo for Security" color="#DC2626" />
                <h4 className="font-bold text-[#001629] text-base">Person Journey Reconstruction</h4>
                <Quote text="I can reconstruct exactly where Badge #8821 was — timestamped, camera-corroborated, court-ready." accentColor="#1E3A5F" />
              </div>
              <div className={CELL_CLASS}>
                <div className="flex gap-2">
                  <PillarTag icon="lock" label="Security" color="#DC2626" />
                  <PillarTag icon="health_and_safety" label="Compliance" color="#16A34A" />
                </div>
                <h4 className="font-bold text-[#001629] text-base">Incident Intelligence + Workplace Compliance Detection</h4>
                <Quote text="The system caught the PPE breach and linked it to a named employee via access control — before anyone filed a claim." accentColor="#5644D0" />
              </div>
              <div className={CELL_CLASS}>
                <div className="flex gap-2 flex-wrap">
                  <PillarPillSmall icon="lock" color="#DC2626" />
                  <PillarPillSmall icon="health_and_safety" color="#16A34A" />
                  <PillarPillSmall icon="hub" color="#2563EB" />
                </div>
                <h4 className="font-bold text-[#001629] text-base">Agentic Physical Intelligence + World-Aware Response</h4>
                <Quote text="The platform saw the storm warning, cross-referenced our Austin sites, and pre-positioned the response — no one had to ask." accentColor="#D97706" />
              </div>
            </div>

            {/* Row 2 — Market Opportunity */}
            <div className={ROW_MUTED_CLASS}>
              <div className={ROW_LABEL_CLASS} style={{ opacity: 0.9 }}>
                <h3 className="font-semibold text-sm leading-snug">Market Opportunity</h3>
              </div>
              <div className={CELL_CLASS}>
                <div className="space-y-4">
                  <StatBlock number="~$58K" label="avg security investigation cost" source="Splunk, Apr 2025" />
                  <StatBlock number="$4B→$10.9B" label="AI video surveillance market" source="MarketsandMarkets, May 2026" />
                </div>
              </div>
              <div className={CELL_CLASS}>
                <div className="grid grid-cols-2 gap-3">
                  <StatBlock number="$171B" label="annual workplace injury cost" source="NSC, 2024" />
                  <StatBlock number="$41K" label="avg Workers&rsquo; Comp claim" source="NCCI, 2023" />
                  <StatBlock number="4–6×" label="ROI per $1 safety investment" source="OSHA" />
                  <StatBlock number="$16.5K" label="max OSHA violation penalty" source="OSHA, 2024" />
                </div>
              </div>
              <div className={CELL_CLASS}>
                <div className="space-y-4">
                  <StatBlock number="$319B" label="physical security services market" source="SIA/ASIS/Omdia, Feb 2024" />
                  <StatBlock number="$1.65B→$13.5B" label="agentic AI security market" source="MarketsandMarkets, 2025" />
                </div>
              </div>
            </div>

            {/* Row 3 — Value to Customers */}
            <div className={ROW_TINTED_CLASS}>
              <div className={ROW_LABEL_CLASS}>
                <h3 className="font-semibold text-sm leading-snug">Value to Customers</h3>
              </div>
              <div className={CELL_CLASS}>
                <ul className="space-y-2 text-sm text-on-surface leading-relaxed">
                  <li className="flex gap-2"><span className="text-[#1E3A5F] font-bold shrink-0">—</span>Full person journey in &lt;5 min, not days</li>
                  <li className="flex gap-2"><span className="text-[#1E3A5F] font-bold shrink-0">—</span>Court-admissible narrative from camera + access events</li>
                  <li className="flex gap-2"><span className="text-[#1E3A5F] font-bold shrink-0">—</span>Reduces investigation labor from ~32 hrs to &lt;1 hr</li>
                  <li className="flex gap-2"><span className="text-[#1E3A5F] font-bold shrink-0">—</span>Replay-ready timeline for insurance or legal proceedings</li>
                </ul>
              </div>
              <div className={CELL_CLASS}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-muted mb-1">Security</p>
                <ul className="space-y-1.5 text-sm text-on-surface leading-relaxed mb-4">
                  <li className="flex gap-2"><span className="text-sec-red font-bold shrink-0">—</span>Corroborated incident record: camera + access = who + when + where</li>
                  <li className="flex gap-2"><span className="text-sec-red font-bold shrink-0">—</span>Removes &ldquo;he said / she said&rdquo; from HR investigations</li>
                </ul>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-muted mb-1">Compliance</p>
                <ul className="space-y-1.5 text-sm text-on-surface leading-relaxed">
                  <li className="flex gap-2"><span className="text-comp-green font-bold shrink-0">—</span>Named violations: camera detects PPE breach + access control identifies person = accountable record</li>
                  <li className="flex gap-2"><span className="text-comp-green font-bold shrink-0">—</span>Documented monitoring = 20–40% insurer premium reduction</li>
                  <li className="flex gap-2"><span className="text-comp-green font-bold shrink-0">—</span>Defensible incident record changes liability calculus if a claim is filed</li>
                </ul>
              </div>
              <div className={CELL_CLASS}>
                <ul className="space-y-2 text-sm text-on-surface leading-relaxed">
                  <li className="flex gap-2"><span className="text-ph3-badge font-bold shrink-0">—</span>Automated threat context reduces analyst workload by ~60%</li>
                  <li className="flex gap-2"><span className="text-ph3-badge font-bold shrink-0">—</span>World-aware playbooks auto-trigger without human prompt</li>
                  <li className="flex gap-2"><span className="text-ph3-badge font-bold shrink-0">—</span>Seamless cross-vendor response across your full physical footprint</li>
                  <li className="flex gap-2"><span className="text-ph3-badge font-bold shrink-0">—</span>Proactive risk scoring before incidents occur</li>
                </ul>
              </div>
            </div>

            {/* Row 4 — Value to Brivo */}
            <div className={ROW_MUTED_CLASS}>
              <div className={ROW_LABEL_CLASS} style={{ opacity: 0.9 }}>
                <h3 className="font-semibold text-sm leading-snug">Value to Brivo</h3>
              </div>
              <div className={CELL_CLASS}>
                <ul className="space-y-2 text-sm text-on-surface leading-relaxed">
                  <li className="flex gap-2"><span className="text-[#1E3A5F] font-bold shrink-0">—</span>Competitive moat — no access-only vendor can do this</li>
                  <li className="flex gap-2"><span className="text-[#1E3A5F] font-bold shrink-0">—</span>Upsell hook: customers need cameras on Brivo platform</li>
                  <li className="flex gap-2"><span className="text-[#1E3A5F] font-bold shrink-0">—</span>Sticky workflow: investigators return daily</li>
                </ul>
              </div>
              <div className={CELL_CLASS}>
                <ul className="space-y-2 text-sm text-on-surface leading-relaxed">
                  <li className="flex gap-2"><span className="text-violet font-bold shrink-0">—</span><span><strong>New buyers:</strong> EHS / Safety Officer + Risk Manager — both with direct financial incentive tied to Workers&rsquo; Comp premium reduction</span></li>
                  <li className="flex gap-2"><span className="text-violet font-bold shrink-0">—</span>Enables outcome-based pricing (per-violation-prevented)</li>
                  <li className="flex gap-2"><span className="text-violet font-bold shrink-0">—</span>Expands TAM into HSE software market ($171B)</li>
                </ul>
              </div>
              <div className={CELL_CLASS}>
                <ul className="space-y-2 text-sm text-on-surface leading-relaxed">
                  <li className="flex gap-2"><span className="text-ph3-badge font-bold shrink-0">—</span>Platform becomes infrastructure — not a product</li>
                  <li className="flex gap-2"><span className="text-ph3-badge font-bold shrink-0">—</span>Agentic capabilities create long-term data moat</li>
                  <li className="flex gap-2"><span className="text-ph3-badge font-bold shrink-0">—</span>NRR flywheel: more devices = richer context = better outcomes = more devices</li>
                </ul>
              </div>
            </div>

            {/* Row 5 — Capabilities We Ship */}
            <div className={ROW_TINTED_CLASS}>
              <div className={ROW_LABEL_CLASS}>
                <h3 className="font-semibold text-sm leading-snug">Capabilities We Ship</h3>
              </div>
              <div className={CELL_CLASS}>
                <ul className="space-y-1.5 text-sm text-on-surface leading-relaxed">
                  <li className="flex gap-2"><span className="text-[#1E3A5F] font-bold shrink-0">—</span>Cross-vendor journey stitching engine</li>
                  <li className="flex gap-2"><span className="text-[#1E3A5F] font-bold shrink-0">—</span>Timeline reconstruction from multi-source events</li>
                  <li className="flex gap-2"><span className="text-[#1E3A5F] font-bold shrink-0">—</span>Court-ready narrative generation (AI)</li>
                  <li className="flex gap-2"><span className="text-[#1E3A5F] font-bold shrink-0">—</span>Journey Replay UI with camera thumbnails</li>
                </ul>
              </div>
              <div className={CELL_CLASS}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-muted mb-1">Security</p>
                <ul className="space-y-1 text-sm text-on-surface leading-relaxed mb-4">
                  <li className="flex gap-2"><span className="text-sec-red font-bold shrink-0">—</span>Multi-source incident clustering</li>
                  <li className="flex gap-2"><span className="text-sec-red font-bold shrink-0">—</span>Corroboration scoring engine</li>
                  <li className="flex gap-2"><span className="text-sec-red font-bold shrink-0">—</span>Incident Investigation AI (chat interface)</li>
                </ul>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-muted mb-1">Compliance</p>
                <ul className="space-y-1 text-sm text-on-surface leading-relaxed">
                  <li className="flex gap-2"><span className="text-comp-green font-bold shrink-0">—</span>PPE violation → identity resolution pipeline</li>
                  <li className="flex gap-2"><span className="text-comp-green font-bold shrink-0">—</span>Violation log with accountability chain</li>
                  <li className="flex gap-2"><span className="text-comp-green font-bold shrink-0">—</span>EHS report generator (AI)</li>
                </ul>
              </div>
              <div className={CELL_CLASS}>
                <ul className="space-y-1.5 text-sm text-on-surface leading-relaxed">
                  <li className="flex gap-2"><span className="text-ph3-badge font-bold shrink-0">—</span>World-aware signal ingestion (weather, news, traffic, public safety)</li>
                  <li className="flex gap-2"><span className="text-ph3-badge font-bold shrink-0">—</span>Agentic response playbooks with auto-trigger</li>
                  <li className="flex gap-2"><span className="text-ph3-badge font-bold shrink-0">—</span>Playbook Policy Authoring (AI — plain English → structured rules)</li>
                  <li className="flex gap-2"><span className="text-ph3-badge font-bold shrink-0">—</span>Proactive site risk scoring</li>
                </ul>
              </div>
            </div>

            {/* Row 6 — Platform Foundation */}
            <div className={ROW_MUTED_CLASS}>
              <div className={ROW_LABEL_CLASS} style={{ opacity: 0.9 }}>
                <h3 className="font-semibold text-sm leading-snug">Platform Foundation</h3>
              </div>
              <div className={CELL_CLASS}>
                <div className="flex flex-wrap gap-2">
                  <Chip label="Vendor-Agnostic Physical Event Schema" />
                  <Chip label="Digital Twin Spatial Graph" />
                  <Chip label="Multi-Vendor Event Normalizer" />
                </div>
              </div>
              <div className={CELL_CLASS}>
                <div className="flex flex-wrap gap-2">
                  <Chip label="Cross-Source Correlation Engine" />
                  <Chip label="Identity Resolution Layer" />
                  <Chip label="Compliance Audit Trail" />
                </div>
              </div>
              <div className={CELL_CLASS}>
                <div className="flex flex-wrap gap-2">
                  <Chip label="World-Signal Ingestion API" />
                  <Chip label="Agentic Orchestration Engine" />
                  <Chip label="Predictive Risk Model" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-surface-low flex items-center justify-between text-xs text-on-muted">
          <span>Project Agora — Eagle Eye Networks × Brivo OS</span>
          <span>18-Month Physical AI Roadmap</span>
        </footer>
      </main>
    </div>
  )
}
