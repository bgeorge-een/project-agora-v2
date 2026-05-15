export interface ContextFeedItem {
  id: string
  ts: string
  source: string
  type: 'weather' | 'news' | 'traffic' | 'event' | 'social'
  summary: string
  relevance: 'high' | 'medium' | 'low'
  affectedSites?: string[]
}

export const MOCK_CONTEXT_FEEDS: ContextFeedItem[] = [
  {
    id: 'ctx-001',
    ts: '2026-05-15T06:00:00',
    source: 'National Weather Service',
    type: 'weather',
    summary: 'Severe thunderstorm warning — Austin metro. Wind gusts 60mph expected 14:00–18:00 local.',
    relevance: 'high',
    affectedSites: ['Austin HQ', 'Austin Warehouse'],
  },
  {
    id: 'ctx-002',
    ts: '2026-05-15T08:30:00',
    source: 'Local News — KVUE',
    type: 'news',
    summary: 'Active protest march scheduled downtown Austin 11:00 AM — estimated 500 attendees, routed past Congress Ave.',
    relevance: 'medium',
    affectedSites: ['Downtown Austin Branch'],
  },
  {
    id: 'ctx-003',
    ts: '2026-05-15T09:00:00',
    source: 'Austin PD Alerts',
    type: 'news',
    summary: 'BOLO issued for vehicle matching description of prior warehouse break-in suspect vehicle — dark blue sedan.',
    relevance: 'high',
    affectedSites: ['Austin Warehouse', 'Cedar Park Facility'],
  },
  {
    id: 'ctx-004',
    ts: '2026-05-15T10:15:00',
    source: 'TxDOT',
    type: 'traffic',
    summary: 'Major accident I-35 northbound at 183 — expect 45+ min delays for afternoon deliveries.',
    relevance: 'medium',
    affectedSites: ['Austin Warehouse'],
  },
]
