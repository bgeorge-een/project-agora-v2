'use client'
import { useSimulation } from '@/lib/use-simulation'
import { ContextFeedItemCard } from '@/components/phase3/ContextFeedItem'
import { MaterialIcon } from '@/components/ui/MaterialIcon'

export default function WorldAwarePage() {
  const { contextFeeds, incidents } = useSimulation()

  const highRelevance = contextFeeds.filter((c) => c.relevance === 'high').length
  const sorted = [...contextFeeds].sort((a, b) =>
    a.relevance === 'high' ? -1 : b.relevance === 'high' ? 1 : 0
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <MaterialIcon name="public" size="md" color="#2563EB" />
          <h1 className="text-2xl font-extrabold">World-Aware Response</h1>
        </div>
        <p className="text-sm text-on-muted mt-1">
          External signals — weather, news, public safety alerts — automatically correlated against your physical footprint.
        </p>
      </div>

      <div className="flex items-center gap-3 bg-ops-blue/5 border border-ops-blue/20 rounded px-4 py-3 text-sm">
        <MaterialIcon name="hub" size="sm" color="#2563EB" />
        <span className="text-on-muted">
          Monitoring <strong className="text-on-surface">{incidents.length} incidents</strong> against{' '}
          <strong className="text-on-surface">{highRelevance} high-relevance external signals</strong>
        </span>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-on-muted mb-3">External Context Feed</p>
        <div className="space-y-3">
          {sorted.map((item) => (
            <ContextFeedItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
