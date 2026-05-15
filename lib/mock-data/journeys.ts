export type SceneType = 'parking' | 'lobby' | 'hallway' | 'elevator' | 'exterior' | 'restricted'

export interface CameraPreview {
  channel: string
  sceneType: SceneType
}

export interface TimelineEvent {
  id: string
  ts: string
  type: 'access' | 'camera' | 'elevator' | 'parking' | 'tailgate'
  location: string
  detail: string
  cameraPreview?: CameraPreview
  injected?: boolean
  injectedBy?: string
  injectedReason?: string
}

export interface JourneyPerson {
  type: 'employee' | 'visitor' | 'unknown'
  name?: string
  title?: string
  department?: string
  email?: string
  phone?: string
  badgeId?: string
  badgeIssued?: string
  accessLevel?: string
  company?: string
  hostName?: string
  initials?: string
  avatarColor?: string
}

export interface Journey {
  id: string
  personId: string
  personLabel: string
  person: JourneyPerson
  date: string
  entryTime: string
  exitTime: string
  status: 'complete' | 'active' | 'flagged'
  licensePlate?: string
  events: TimelineEvent[]
}

export const MOCK_JOURNEYS: Journey[] = [
  {
    id: 'j-001',
    personId: 'badge-8821',
    personLabel: 'Sarah Chen',
    person: {
      type: 'employee',
      name: 'Sarah Chen',
      title: 'Security Analyst',
      department: 'IT Security · Floor 4',
      email: 's.chen@company.com',
      phone: '+1 (512) 555-0142',
      badgeId: '#8821',
      badgeIssued: '2024-03-15',
      accessLevel: 'Level 3 — Standard',
      initials: 'SC',
      avatarColor: '#5644D0',
    },
    date: '2026-05-15',
    entryTime: '08:14',
    exitTime: '17:42',
    status: 'complete',
    licensePlate: 'KLM-4402',
    events: [
      { id: 'e1', ts: '08:14:03', type: 'parking', location: 'Parking Garage B', detail: 'Vehicle entry detected — License plate match: KLM-4402', cameraPreview: { channel: 'CH-01', sceneType: 'parking' } },
      { id: 'e2', ts: '08:16:22', type: 'access', location: 'Main Lobby', detail: 'Badge swipe granted — Door A1', cameraPreview: { channel: 'CH-04', sceneType: 'lobby' } },
      { id: 'e3', ts: '08:17:05', type: 'camera', location: 'Lobby Camera 3', detail: 'Person detected moving toward elevator bank', cameraPreview: { channel: 'CH-06', sceneType: 'lobby' } },
      { id: 'e4', ts: '08:17:31', type: 'elevator', location: 'Elevator Bank C', detail: 'Floor 4 selected', cameraPreview: { channel: 'CH-09', sceneType: 'elevator' } },
      { id: 'e5', ts: '08:18:10', type: 'camera', location: 'Floor 4 Hallway Cam', detail: 'Person exits elevator, moves toward Suite 401', cameraPreview: { channel: 'CH-12', sceneType: 'hallway' } },
      { id: 'e6', ts: '08:18:47', type: 'access', location: 'Suite 401', detail: 'Badge swipe granted — Door F401', cameraPreview: { channel: 'CH-14', sceneType: 'hallway' } },
      { id: 'e7', ts: '12:31:15', type: 'access', location: 'Cafeteria Level 1', detail: 'Badge swipe granted — Door C1', cameraPreview: { channel: 'CH-22', sceneType: 'lobby' } },
      { id: 'e8', ts: '17:41:02', type: 'access', location: 'Main Lobby Exit', detail: 'Badge swipe exit recorded', cameraPreview: { channel: 'CH-05', sceneType: 'lobby' } },
      { id: 'e9', ts: '17:42:19', type: 'parking', location: 'Parking Garage B', detail: 'Vehicle exit — License plate confirmed: KLM-4402', cameraPreview: { channel: 'CH-02', sceneType: 'parking' } },
    ],
  },
  {
    id: 'j-002',
    personId: 'badge-4410',
    personLabel: 'Marcus Webb',
    person: {
      type: 'employee',
      name: 'Marcus Webb',
      title: 'IT Contractor',
      department: 'Infrastructure · Vendor',
      email: 'm.webb@techsupply.co',
      phone: '+1 (737) 555-0088',
      badgeId: '#4410',
      badgeIssued: '2026-04-01',
      accessLevel: 'Level 1 — Restricted',
      initials: 'MW',
      avatarColor: '#2563EB',
    },
    date: '2026-05-15',
    entryTime: '09:05',
    exitTime: '—',
    status: 'flagged',
    events: [
      { id: 'f1', ts: '09:05:11', type: 'access', location: 'Main Lobby', detail: 'Badge swipe granted — Door A1', cameraPreview: { channel: 'CH-04', sceneType: 'lobby' } },
      { id: 'f2', ts: '09:06:40', type: 'camera', location: 'Lobby Camera 1', detail: 'Person detected moving toward stairwell', cameraPreview: { channel: 'CH-06', sceneType: 'lobby' } },
      { id: 'f3', ts: '09:07:22', type: 'access', location: 'Server Room 2B', detail: 'Badge swipe DENIED — insufficient clearance', cameraPreview: { channel: 'CH-18', sceneType: 'restricted' } },
      { id: 'f4', ts: '09:07:45', type: 'access', location: 'Server Room 2B', detail: 'Badge swipe DENIED — second attempt', cameraPreview: { channel: 'CH-18', sceneType: 'restricted' } },
      { id: 'f5', ts: '09:08:03', type: 'camera', location: 'Hallway Cam 2B', detail: 'Person lingering outside Server Room 2B — 4+ minutes', cameraPreview: { channel: 'CH-19', sceneType: 'hallway' } },
    ],
  },
  {
    id: 'j-004',
    personId: 'unknown-001',
    personLabel: 'Unknown — Tailgater',
    person: {
      type: 'unknown',
      initials: '?',
      avatarColor: '#DC2626',
    },
    date: '2026-05-15',
    entryTime: '14:28',
    exitTime: '15:47',
    status: 'flagged',
    licensePlate: 'HXT-7291',
    events: [
      { id: 't1', ts: '14:26:03', type: 'parking', location: 'Parking Lot A', detail: 'Unknown vehicle entry — License plate captured: HXT-7291', cameraPreview: { channel: 'CH-01', sceneType: 'parking' } },
      { id: 't2', ts: '14:28:11', type: 'tailgate', location: 'Main Entrance', detail: 'Tailgating event detected — individual followed credentialed badge holder through Door A1. No credential presented.', cameraPreview: { channel: 'CH-04', sceneType: 'lobby' } },
      { id: 't3', ts: '14:29:45', type: 'camera', location: 'Main Lobby Camera 2', detail: 'Unescorted individual detected moving toward elevator bank', cameraPreview: { channel: 'CH-06', sceneType: 'lobby' } },
      { id: 't4', ts: '14:31:02', type: 'camera', location: 'Floor 3 Hallway Cam', detail: 'Individual exits elevator on Floor 3 unescorted', cameraPreview: { channel: 'CH-12', sceneType: 'hallway' } },
      { id: 't5', ts: '14:33:18', type: 'camera', location: 'Finance Wing Cam', detail: 'Individual observed attempting door handles — Finance Suite 3C. No access granted.', cameraPreview: { channel: 'CH-15', sceneType: 'restricted' } },
      { id: 't6', ts: '14:41:55', type: 'camera', location: 'Stairwell Cam B', detail: 'Individual descending stairwell B from Floor 3 to Floor 1', cameraPreview: { channel: 'CH-19', sceneType: 'hallway' } },
      { id: 't7', ts: '14:55:30', type: 'camera', location: 'Cafeteria Cam', detail: 'Individual seated in cafeteria — stationary for 14 minutes', cameraPreview: { channel: 'CH-22', sceneType: 'lobby' } },
      { id: 't8', ts: '15:44:12', type: 'camera', location: 'Main Lobby Camera 1', detail: 'Security officer escort initiated — individual directed toward exit', cameraPreview: { channel: 'CH-05', sceneType: 'lobby' } },
      { id: 't9', ts: '15:46:33', type: 'parking', location: 'Parking Lot A', detail: 'Vehicle departure confirmed — License plate: HXT-7291', cameraPreview: { channel: 'CH-02', sceneType: 'parking' } },
    ],
  },
  {
    id: 'j-003',
    personId: 'visitor-220',
    personLabel: 'James Okafor',
    person: {
      type: 'visitor',
      name: 'James Okafor',
      title: 'Facilities Vendor',
      company: 'Meridian HVAC Services',
      email: 'j.okafor@meridianhvac.com',
      phone: '+1 (512) 555-0231',
      badgeId: 'V-220',
      badgeIssued: '2026-05-15',
      accessLevel: 'Visitor — Escorted only',
      hostName: 'Facilities Dept. (Dana Park)',
      initials: 'JO',
      avatarColor: '#D97706',
    },
    date: '2026-05-15',
    entryTime: '13:30',
    exitTime: '15:15',
    status: 'complete',
    events: [
      { id: 'v1', ts: '13:30:00', type: 'access', location: 'Visitor Entrance', detail: 'Visitor badge V-220 issued — escorted entry with Dana Park', cameraPreview: { channel: 'CH-03', sceneType: 'lobby' } },
      { id: 'v2', ts: '13:31:12', type: 'camera', location: 'Visitor Lobby Cam', detail: 'Visitor and escort detected moving toward freight elevator', cameraPreview: { channel: 'CH-07', sceneType: 'lobby' } },
      { id: 'v3', ts: '13:35:00', type: 'access', location: 'Conference Room 3A', detail: 'Visitor badge granted — Conference 3A', cameraPreview: { channel: 'CH-13', sceneType: 'hallway' } },
      { id: 'v4', ts: '15:14:00', type: 'access', location: 'Visitor Entrance Exit', detail: 'Visitor badge V-220 returned — exit confirmed by escort', cameraPreview: { channel: 'CH-03', sceneType: 'lobby' } },
    ],
  },
]
