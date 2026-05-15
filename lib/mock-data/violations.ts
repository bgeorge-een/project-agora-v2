export interface Violation {
  id: string
  ts: string
  type: 'ppe' | 'proximity' | 'ergonomic' | 'access'
  description: string
  location: string
  cameraId: string
  personId?: string
  status: 'open' | 'acknowledged' | 'resolved'
  severity: 'high' | 'medium' | 'low'
}

export const MOCK_VIOLATIONS: Violation[] = [
  {
    id: 'vio-001',
    ts: '2026-05-15T07:32:00',
    type: 'ppe',
    description: 'Hard hat not worn in active construction zone. Camera detected bare head in mandatory PPE area.',
    location: 'Warehouse Zone C — Active Construction',
    cameraId: 'cam-wh-003',
    personId: 'badge-1192',
    status: 'open',
    severity: 'high',
  },
  {
    id: 'vio-002',
    ts: '2026-05-15T08:15:00',
    type: 'proximity',
    description: 'Person within 3ft of operating forklift without high-vis vest.',
    location: 'Receiving Bay 2',
    cameraId: 'cam-rb-002',
    status: 'acknowledged',
    severity: 'high',
  },
  {
    id: 'vio-003',
    ts: '2026-05-15T09:48:00',
    type: 'ppe',
    description: 'Safety glasses not worn at chemical mixing station.',
    location: 'Lab — Chemical Prep Room',
    cameraId: 'cam-lab-001',
    personId: 'badge-3304',
    status: 'open',
    severity: 'medium',
  },
  {
    id: 'vio-004',
    ts: '2026-05-15T10:21:00',
    type: 'ppe',
    description: 'No gloves worn while handling hazardous material containers.',
    location: 'Warehouse Zone A — Hazmat Storage',
    cameraId: 'cam-wh-001',
    status: 'resolved',
    severity: 'high',
  },
]
