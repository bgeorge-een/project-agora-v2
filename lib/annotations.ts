export interface Annotation {
  author: string
  addedAt: string
  note: string
}

export type AnnotationMap = Record<string, Annotation[]>

function ts(h: number, m: number): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `May 15, 2026 · ${pad(h)}:${pad(m)}`
}

export const SEED_ANNOTATIONS: Record<string, AnnotationMap> = {
  'j-002': {
    'f3': [
      { author: 'Alex Torres', addedAt: ts(9, 15), note: 'Access pattern matches two prior incidents this quarter. Escalating to security lead.' },
    ],
    'f5': [
      { author: 'Dana Park',   addedAt: ts(9, 22), note: 'Reviewed hallway footage — individual remained stationary outside door for 4m 18s before moving on.' },
      { author: 'Alex Torres', addedAt: ts(9, 31), note: 'Badge suspended pending HR review. Contractor manager notified.' },
    ],
  },
  'j-004': {
    't2': [
      { author: 'Dana Park',   addedAt: ts(14, 45), note: 'Entrance camera footage pulled. Attempting facial match against visitor log.' },
    ],
    't5': [
      { author: 'Alex Torres', addedAt: ts(14, 51), note: 'Contacted Finance team lead — no visitors or contractors expected on Floor 3 today.' },
      { author: 'Dana Park',   addedAt: ts(14, 55), note: 'Individual did not attempt to force entry. Behavior consistent with opportunistic reconnaissance.' },
    ],
    't8': [
      { author: 'Alex Torres', addedAt: ts(15, 46), note: 'Escort completed. Individual claimed to be visiting a friend in the building — no corroborating record found.' },
    ],
  },
}
