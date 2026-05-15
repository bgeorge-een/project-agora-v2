export interface TimelineEvent {
  id: string
  ts: string
  type: 'access' | 'camera' | 'elevator' | 'parking'
  location: string
  detail: string
}

export interface Journey {
  id: string
  personId: string
  personLabel: string
  date: string
  entryTime: string
  exitTime: string
  status: 'complete' | 'active' | 'flagged'
  events: TimelineEvent[]
}

export const MOCK_JOURNEYS: Journey[] = [
  {
    id: 'j-001',
    personId: 'badge-8821',
    personLabel: 'Badge #8821',
    date: '2026-05-15',
    entryTime: '08:14',
    exitTime: '17:42',
    status: 'complete',
    events: [
      { id: 'e1', ts: '08:14:03', type: 'parking', location: 'Parking Garage B', detail: 'Vehicle entry detected — License plate match' },
      { id: 'e2', ts: '08:16:22', type: 'access', location: 'Main Lobby', detail: 'Badge swipe granted — Door A1' },
      { id: 'e3', ts: '08:17:05', type: 'camera', location: 'Lobby Camera 3', detail: 'Person detected moving toward elevator bank' },
      { id: 'e4', ts: '08:17:31', type: 'elevator', location: 'Elevator Bank C', detail: 'Floor 4 selected' },
      { id: 'e5', ts: '08:18:10', type: 'camera', location: 'Floor 4 Hallway Cam', detail: 'Person exits elevator, moves toward Suite 401' },
      { id: 'e6', ts: '08:18:47', type: 'access', location: 'Suite 401', detail: 'Badge swipe granted — Door F401' },
      { id: 'e7', ts: '12:31:15', type: 'access', location: 'Cafeteria Level 1', detail: 'Badge swipe granted — Door C1' },
      { id: 'e8', ts: '17:41:02', type: 'access', location: 'Main Lobby Exit', detail: 'Badge swipe exit recorded' },
      { id: 'e9', ts: '17:42:19', type: 'parking', location: 'Parking Garage B', detail: 'Vehicle exit detected' },
    ],
  },
  {
    id: 'j-002',
    personId: 'badge-4410',
    personLabel: 'Badge #4410',
    date: '2026-05-15',
    entryTime: '09:05',
    exitTime: '—',
    status: 'flagged',
    events: [
      { id: 'f1', ts: '09:05:11', type: 'access', location: 'Main Lobby', detail: 'Badge swipe granted — Door A1' },
      { id: 'f2', ts: '09:06:40', type: 'camera', location: 'Lobby Camera 1', detail: 'Person detected' },
      { id: 'f3', ts: '09:07:22', type: 'access', location: 'Server Room 2B', detail: 'Badge swipe DENIED — insufficient clearance' },
      { id: 'f4', ts: '09:07:45', type: 'access', location: 'Server Room 2B', detail: 'Badge swipe DENIED — second attempt' },
      { id: 'f5', ts: '09:08:03', type: 'camera', location: 'Hallway Cam 2B', detail: 'Person lingering outside Server Room 2B — 4+ minutes' },
    ],
  },
  {
    id: 'j-003',
    personId: 'visitor-220',
    personLabel: 'Visitor #220',
    date: '2026-05-15',
    entryTime: '13:30',
    exitTime: '15:15',
    status: 'complete',
    events: [
      { id: 'v1', ts: '13:30:00', type: 'access', location: 'Visitor Entrance', detail: 'Visitor badge issued — escorted entry' },
      { id: 'v2', ts: '13:31:12', type: 'camera', location: 'Visitor Lobby Cam', detail: 'Person and escort detected' },
      { id: 'v3', ts: '13:35:00', type: 'access', location: 'Conference Room 3A', detail: 'Badge swipe granted' },
      { id: 'v4', ts: '15:14:00', type: 'access', location: 'Visitor Entrance Exit', detail: 'Visitor badge returned — exit confirmed' },
    ],
  },
]
