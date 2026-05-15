import { StatusPill } from '@/components/ui/StatusPill'
import { MaterialIcon } from '@/components/ui/MaterialIcon'
import type { Incident } from '@/lib/mock-data/incidents'

interface IncidentCardProps {
  incident: Incident
  onInvestigate: (incident: Incident) => void
}

const severityVariant = {
  critical: 'active',
  high: 'warning',
  medium: 'info',
} as const

const statusVariant = {
  open: 'active',
  investigating: 'warning',
  resolved: 'resolved',
} as const

export function IncidentCard({ incident, onInvestigate }: IncidentCardProps) {
  return (
    <div className="bg-surface-card rounded shadow-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <StatusPill label={incident.severity} variant={severityVariant[incident.severity]} />
            <StatusPill label={incident.status} variant={statusVariant[incident.status]} />
          </div>
          <p className="font-semibold text-sm text-on-surface">{incident.title}</p>
          <p className="text-xs text-on-muted mt-0.5">{incident.location}</p>
        </div>
        <button
          onClick={() => onInvestigate(incident)}
          className="flex items-center gap-1 text-xs text-violet font-semibold hover:underline flex-shrink-0 mt-1"
        >
          <MaterialIcon name="search" size="sm" />
          Investigate
        </button>
      </div>
      <p className="text-xs text-on-muted leading-relaxed">{incident.description}</p>
      <div className="flex gap-1.5 flex-wrap">
        {incident.sources.map((s) => (
          <span key={s} className="bg-surface-low text-on-muted text-[10px] font-medium px-2 py-0.5 rounded">{s}</span>
        ))}
      </div>
    </div>
  )
}
