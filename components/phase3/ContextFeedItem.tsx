import { MaterialIcon } from '@/components/ui/MaterialIcon'
import { StatusPill } from '@/components/ui/StatusPill'
import type { ContextFeedItem } from '@/lib/mock-data/context-feeds'

const typeIcon: Record<string, string> = {
  weather: 'thunderstorm',
  news: 'newspaper',
  traffic: 'traffic',
  event: 'event',
  social: 'forum',
}

interface ContextFeedItemCardProps {
  item: ContextFeedItem
}

export function ContextFeedItemCard({ item }: ContextFeedItemCardProps) {
  return (
    <div className="bg-surface-card rounded shadow-card p-4 flex gap-3">
      <div className="mt-0.5 flex-shrink-0">
        <MaterialIcon
          name={typeIcon[item.type] ?? 'info'}
          size="sm"
          color={item.relevance === 'high' ? '#DC2626' : '#43474c'}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-on-surface">{item.source}</span>
          <StatusPill
            label={item.relevance}
            variant={item.relevance === 'high' ? 'active' : item.relevance === 'medium' ? 'warning' : 'info'}
          />
        </div>
        <p className="text-sm text-on-surface leading-relaxed">{item.summary}</p>
        {item.affectedSites && (
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {item.affectedSites.map((s) => (
              <span key={s} className="bg-surface-low text-on-muted text-[10px] font-medium px-2 py-0.5 rounded">{s}</span>
            ))}
          </div>
        )}
        <p className="text-xs text-on-muted mt-1 font-mono">
          {new Date(item.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}
