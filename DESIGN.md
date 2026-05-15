# Project Agora V2 — Design System Reference

## Design System: Brivo Editorial "Silent Authority"

### Color Tokens

Defined in `app/globals.css` via Tailwind v4 `@theme`. Use via Tailwind utilities (`bg-nav`, `text-violet`, etc.).

| Token | Hex | Tailwind class | Usage |
|---|---|---|---|
| `nav` | `#002B49` | `bg-nav` | Top navigation bar |
| `sidebar` | `#001629` | `bg-sidebar` | Left sidebar |
| `canvas` | `#fbf9f8` | `bg-canvas` | Page background |
| `surface-low` | `#f5f3f2` | `bg-surface-low` | Muted containers, inputs |
| `surface-card` | `#ffffff` | `bg-surface-card` | Cards |
| `on-surface` | `#1b1c1b` | `text-on-surface` | Primary text |
| `on-muted` | `#43474c` | `text-on-muted` | Secondary/label text |
| `violet` | `#5644D0` | `text-violet`, `bg-violet` | Phase 2 badge, interactive |
| `ph1-badge` | `#1E3A5F` | `bg-ph1-badge` | Phase 1 badge |
| `ph3-badge` | `#D97706` | `bg-ph3-badge` | Phase 3 badge |
| `sec-red` | `#DC2626` | `text-sec-red`, `bg-sec-red` | Security pillar |
| `comp-green` | `#16A34A` | `text-comp-green`, `bg-comp-green` | Compliance pillar |
| `ops-blue` | `#2563EB` | `text-ops-blue`, `bg-ops-blue` | Operations pillar |

### Typography

- **Font:** Inter (loaded via `next/font/google`)
- **Headings:** `font-extrabold` (800)
- **Body:** `text-sm` (14px), `leading-relaxed`
- **Labels/caps:** `text-xs font-bold uppercase tracking-widest`
- **Mono/timestamps:** `font-mono text-xs`

### Key Design Rules

- **No borders** — use tonal surface shifts (`surface-low` vs `surface-card` vs `canvas`)
- **Shadow:** `shadow-card` (`0 12px 32px rgba(0,22,41,0.06)`) on white cards only
- **Radius:** 4px everywhere (`rounded`)
- **Icons:** Google Material Symbols Outlined loaded via Google Fonts CDN, rendered via `<MaterialIcon>` component
- **Pillar colors** used for icons and accent elements only — never large background fills

### Component Patterns

- **Card:** `<Card>` — `bg-surface-card rounded shadow-card p-5`
- **Section label:** `text-xs font-bold uppercase tracking-widest text-on-muted mb-3`
- **AI feature badge:** `text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet/10 text-violet`
- **Phase 1 badge:** `bg-ph1-badge text-white`
- **Phase 2 badge:** `bg-ph2-badge text-white` (same as violet)
- **Phase 3 badge:** `bg-ph3-badge text-white`
- **Primary button:** `bg-violet text-white text-xs font-semibold px-3 py-1.5 rounded`
- **Source chip:** `bg-surface-low text-on-muted text-[10px] font-medium px-2 py-0.5 rounded`

### Icon Reference

| Use | Icon name |
|---|---|
| Security pillar | `lock` |
| Compliance pillar | `health_and_safety` |
| Operations pillar | `hub` |
| Person journey | `route` |
| Incidents | `emergency` |
| Playbooks | `menu_book` |
| World-aware | `public` |
| AI/Claude feature | `auto_awesome` |
| Investigate | `search` |
| Generate narrative | `description` |
| Generate report | `summarize` |
| Live/realtime | `bolt` |
| Back nav | `arrow_back` |

### Claude AI Integration

All Claude API calls go through server-side Route Handlers in `app/api/`. The `ANTHROPIC_API_KEY` is never exposed to the browser.

| Feature | Route | Model | Screen |
|---|---|---|---|
| Natural Language Investigation | `/api/investigate` | claude-haiku-4-5 | Incidents |
| Journey Narrative Generator | `/api/journey-narrative` | claude-haiku-4-5 | Journey detail |
| Playbook Policy Authoring | `/api/playbook-author` | claude-haiku-4-5 | Playbooks |
| EHS Report Generation | `/api/compliance-report` | claude-haiku-4-5 | Compliance |

All routes stream responses using `ReadableStream` + `TextEncoder` for real-time token display.
