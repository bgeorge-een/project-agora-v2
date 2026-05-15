import Link from 'next/link'
import { StatusPill } from '@/components/ui/StatusPill'
import { MaterialIcon } from '@/components/ui/MaterialIcon'
import type { Journey } from '@/lib/mock-data/journeys'

const statusVariant = {
  complete: 'resolved',
  active:   'open',
  flagged:  'active',
} as const

const statusLabel = {
  complete: 'Complete',
  active:   'On-Premises',
  flagged:  'Flagged',
} as const

const statusBorder = {
  complete: 'border-l-comp-green',
  active:   'border-l-ops-blue',
  flagged:  'border-l-sec-red',
} as const

const eventTypeConfig = {
  access:   { icon: 'key',           color: '#5644D0' },
  camera:   { icon: 'videocam',      color: '#43474c' },
  elevator: { icon: 'elevator',      color: '#2563EB' },
  parking:  { icon: 'local_parking', color: '#16A34A' },
  tailgate: { icon: 'warning',       color: '#DC2626' },
} as const

function duration(entry: string, exit: string): string {
  if (exit === '—') return 'Ongoing'
  const [eh, em] = entry.split(':').map(Number)
  const [xh, xm] = exit.split(':').map(Number)
  const mins = (xh * 60 + xm) - (eh * 60 + em)
  if (mins < 60) return `${mins}m`
  return `${Math.floor(mins / 60)}h ${mins % 60}m`
}

export function JourneyCard({ journey }: { journey: Journey }) {
  const dur = duration(journey.entryTime, journey.exitTime)
  const denied = journey.events.filter((e) => e.detail.toLowerCase().includes('denied')).length
  const isTailgater = journey.person.type === 'unknown'

  const typeCounts = journey.events.reduce<Partial<Record<keyof typeof eventTypeConfig, number>>>((acc, e) => {
    acc[e.type] = (acc[e.type] ?? 0) + 1
    return acc
  }, {})

  const initials = journey.person.initials ?? '?'
  const avatarColor = journey.person.avatarColor ?? '#5644D0'

  return (
    <Link
      href={`/journey/${journey.id}`}
      className={`block bg-surface-card rounded shadow-card border-l-4 ${statusBorder[journey.status]} hover:shadow-md transition-all hover:-translate-y-px`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-extrabold flex-shrink-0"
              style={{ backgroundColor: avatarColor }}
            >
              {isTailgater ? <MaterialIcon name="person_off" size="sm" color="white" /> : initials}
            </div>
            <div>
              <p className="font-semibold text-sm text-on-surface leading-tight">{journey.personLabel}</p>
              <p className="text-xs text-on-muted">
                {isTailgater ? (
                  <span className="text-sec-red font-medium">No credentials — tailgating</span>
                ) : (
                  journey.person.title
                )}
              </p>
            </div>
          </div>
          <StatusPill label={statusLabel[journey.status]} variant={statusVariant[journey.status]} />
        </div>

        <div className="flex items-center gap-4 text-xs text-on-muted mb-3">
          <span className="flex items-center gap-1">
            <MaterialIcon name="login" size="sm" />
            {journey.entryTime}
          </span>
          <span className="text-on-surface/20">→</span>
          <span className="flex items-center gap-1">
            <MaterialIcon name="logout" size="sm" />
            {journey.exitTime}
          </span>
          <span className="ml-auto flex items-center gap-1 font-medium">
            <MaterialIcon name="schedule" size="sm" />
            {dur}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {(Object.entries(typeCounts) as [keyof typeof eventTypeConfig, number][]).map(([type, count]) => {
            const cfg = eventTypeConfig[type]
            return (
              <span
                key={type}
                className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded ${type === 'tailgate' ? 'bg-red-50 text-sec-red' : 'bg-surface-low text-on-muted'}`}
              >
                <MaterialIcon name={cfg.icon} size="sm" color={cfg.color} />
                {count}
              </span>
            )
          })}
          {denied > 0 && (
            <span className="inline-flex items-center gap-1 bg-red-50 text-sec-red text-[11px] px-2 py-0.5 rounded font-semibold ml-auto">
              <MaterialIcon name="block" size="sm" color="#DC2626" />
              {denied} denied
            </span>
          )}
          {journey.licensePlate && (
            <span className="inline-flex items-center gap-1 bg-surface-low text-on-muted text-[11px] px-2 py-0.5 rounded font-mono ml-auto">
              <MaterialIcon name="directions_car" size="sm" color="#43474c" />
              {journey.licensePlate}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
