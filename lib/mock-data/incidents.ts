export interface Incident {
  id: string
  ts: string
  title: string
  description: string
  severity: 'critical' | 'high' | 'medium'
  status: 'open' | 'investigating' | 'resolved'
  sources: string[]
  location: string
  relatedJourneyId?: string
}

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'inc-001',
    ts: '2026-05-15T09:08:00',
    title: 'Repeated unauthorized access attempt — Server Room 2B',
    description: 'Badge #4410 attempted access to Server Room 2B twice within 45 seconds, both denied. Person lingered in hallway 4+ minutes. No escort detected.',
    severity: 'high',
    status: 'open',
    sources: ['Access Control', 'Hallway Camera 2B'],
    location: 'Floor 2 — Server Room Corridor',
    relatedJourneyId: 'j-002',
  },
  {
    id: 'inc-002',
    ts: '2026-05-15T02:17:00',
    title: 'After-hours motion detected — Executive Suite 8',
    description: 'Camera detected motion in Executive Suite 8 at 02:17 AM. No badge activity within 30 minutes of motion event. Door access log shows no authorized entry.',
    severity: 'critical',
    status: 'investigating',
    sources: ['Suite 8 Camera', 'Access Control Log'],
    location: 'Floor 8 — Executive Suite',
  },
  {
    id: 'inc-003',
    ts: '2026-05-15T11:45:00',
    title: 'Tailgating detected — Loading Dock',
    description: 'Single badge swipe followed by two individuals entering — camera counted 2 persons passing through single-access door after 1 badge read.',
    severity: 'medium',
    status: 'resolved',
    sources: ['Loading Dock Camera', 'Door Sensor D7'],
    location: 'Loading Dock — Door D7',
  },
]
