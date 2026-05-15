import Link from 'next/link'
import { StatusPill } from '@/components/ui/StatusPill'
import { MaterialIcon } from '@/components/ui/MaterialIcon'
import type { Journey } from '@/lib/mock-data/journeys'

interface JourneyCardProps {
  journey: Journey
}

const statusVariant = {
  complete: 'resolved',
  active: 'open',
  flagged: 'active',
} as const

export function JourneyCard({ journey }: JourneyCardProps) {
  return (
    <Link
      href={`/journey/${journey.id}`}
      className="block bg-surface-card rounded shadow-card p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <MaterialIcon name="person" size="sm" color="#5644D0" />
          <span className="font-semibold text-sm">{journey.personLabel}</span>
        </div>
        <StatusPill label={journey.status} variant={statusVariant[journey.status]} />
      </div>
      <div className="text-xs text-on-muted space-y-0.5">
        <p>Date: {journey.date}</p>
        <p>Entry: {journey.entryTime} — Exit: {journey.exitTime}</p>
        <p>{journey.events.length} events reconstructed</p>
      </div>
    </Link>
  )
}
