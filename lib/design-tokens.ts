export const PILLARS = {
  security: {
    label: 'Brivo for Security',
    icon: 'lock',
    color: '#DC2626',
    badgeClass: 'bg-sec-red text-white',
    pillClass: 'bg-red-50 text-sec-red',
    phase: 'Phase 1',
  },
  compliance: {
    label: 'Brivo for Compliance',
    icon: 'health_and_safety',
    color: '#16A34A',
    badgeClass: 'bg-comp-green text-white',
    pillClass: 'bg-green-50 text-comp-green',
    phase: 'Phase 2',
  },
  operations: {
    label: 'Brivo for Operations',
    icon: 'hub',
    color: '#2563EB',
    badgeClass: 'bg-ops-blue text-white',
    pillClass: 'bg-blue-50 text-ops-blue',
    phase: 'Phase 3',
  },
} as const

export type PillarKey = keyof typeof PILLARS

export const PHASES = [
  { id: 1, label: 'Phase 1', range: 'Months 1–6', theme: 'Person Journey Reconstruction', badgeClass: 'bg-ph1-badge text-white' },
  { id: 2, label: 'Phase 2', range: 'Months 7–12', theme: 'Incident Intelligence + Compliance', badgeClass: 'bg-ph2-badge text-white' },
  { id: 3, label: 'Phase 3', range: 'Months 13–18', theme: 'Agentic Physical Intelligence', badgeClass: 'bg-ph3-badge text-white' },
]
