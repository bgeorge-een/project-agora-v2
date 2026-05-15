'use client'
import { useState } from 'react'
import { useSimulation } from '@/lib/use-simulation'
import { JourneyCard } from '@/components/phase1/JourneyCard'
import { MaterialIcon } from '@/components/ui/MaterialIcon'

type Filter = 'all' | 'flagged' | 'active' | 'complete'

const filters: { key: Filter; label: string }[] = [
  { key: 'all',      label: 'All' },
  { key: 'flagged',  label: 'Flagged' },
  { key: 'active',   label: 'On-Premises' },
  { key: 'complete', label: 'Complete' },
]

const statusOrder = { flagged: 0, active: 1, complete: 2 }

export default function JourneyListPage() {
  const { journeys } = useSimulation()
  const [filter, setFilter] = useState<Filter>('all')

  const sorted = [...journeys].sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
  const filtered = filter === 'all' ? sorted : sorted.filter((j) => j.status === filter)

  const flaggedCount = journeys.filter((j) => j.status === 'flagged').length
  const activeCount  = journeys.filter((j) => j.status === 'active').length

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <MaterialIcon name="route" size="md" color="#DC2626" />
          <h1 className="text-2xl font-extrabold">Person Journey Reconstruction</h1>
        </div>
        <p className="text-sm text-on-muted mt-1">
          Correlates access control events, camera detections, and environmental signals into a complete physical journey.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface-card rounded shadow-card p-4 text-center">
          <p className="text-2xl font-extrabold text-on-surface">{journeys.length}</p>
          <p className="text-xs text-on-muted mt-0.5">Journeys today</p>
        </div>
        <div className={`rounded shadow-card p-4 text-center ${flaggedCount > 0 ? 'bg-red-50' : 'bg-surface-card'}`}>
          <p className={`text-2xl font-extrabold ${flaggedCount > 0 ? 'text-sec-red' : 'text-on-surface'}`}>{flaggedCount}</p>
          <p className="text-xs text-on-muted mt-0.5">Flagged</p>
        </div>
        <div className="bg-surface-card rounded shadow-card p-4 text-center">
          <p className="text-2xl font-extrabold text-ops-blue">{activeCount}</p>
          <p className="text-xs text-on-muted mt-0.5">On-Premises</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-surface-low rounded p-1 w-fit">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`text-xs font-semibold px-3 py-1.5 rounded transition-colors ${
              filter === f.key
                ? 'bg-surface-card text-on-surface shadow-sm'
                : 'text-on-muted hover:text-on-surface'
            }`}
          >
            {f.label}
            {f.key !== 'all' && (
              <span className="ml-1.5 text-[10px] text-on-muted/70">
                {journeys.filter((j) => j.status === f.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List — flagged always float to top */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-sm text-on-muted italic py-4">No journeys match this filter.</p>
        ) : (
          filtered.map((j) => <JourneyCard key={j.id} journey={j} />)
        )}
      </div>
    </div>
  )
}
