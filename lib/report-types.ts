export type Classification =
  | 'CONFIDENTIAL'
  | 'INTERNAL USE ONLY'
  | 'RESTRICTED — LAW ENFORCEMENT'

export interface AuditEntry {
  id: string
  action: 'generated' | 'regenerated' | 'modified' | 'exported'
  actor: string
  timestamp: string
  detail: string
  hash?: string
}

export async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function nowString(): string {
  return new Date().toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}
