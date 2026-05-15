import { StatusPill } from '@/components/ui/StatusPill'
import type { Violation } from '@/lib/mock-data/violations'

interface ViolationRowProps {
  violation: Violation
}

const severityVariant = { high: 'active', medium: 'warning', low: 'info' } as const
const statusVariant = { open: 'active', acknowledged: 'warning', resolved: 'resolved' } as const

export function ViolationRow({ violation }: ViolationRowProps) {
  return (
    <tr className="border-b border-surface-low last:border-0">
      <td className="py-3 pr-4">
        <p className="text-sm text-on-surface leading-snug">{violation.description}</p>
        <p className="text-xs text-on-muted mt-0.5">{violation.location}</p>
      </td>
      <td className="py-3 pr-4 text-xs text-on-muted font-mono whitespace-nowrap">
        {new Date(violation.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </td>
      <td className="py-3 pr-4">
        <StatusPill label={violation.severity} variant={severityVariant[violation.severity]} />
      </td>
      <td className="py-3">
        <StatusPill label={violation.status} variant={statusVariant[violation.status]} />
      </td>
    </tr>
  )
}
