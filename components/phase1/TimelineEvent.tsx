import { MaterialIcon } from '@/components/ui/MaterialIcon'
import type { TimelineEvent as TEvent } from '@/lib/mock-data/journeys'

const iconMap = {
  access: { icon: 'key', color: '#5644D0' },
  camera: { icon: 'videocam', color: '#43474c' },
  elevator: { icon: 'elevator', color: '#2563EB' },
  parking: { icon: 'local_parking', color: '#16A34A' },
} as const

interface TimelineEventProps {
  event: TEvent
  isLast: boolean
}

export function TimelineEvent({ event, isLast }: TimelineEventProps) {
  const { icon, color } = iconMap[event.type]
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-surface-low flex items-center justify-center flex-shrink-0">
          <MaterialIcon name={icon} size="sm" color={color} />
        </div>
        {!isLast && <div className="w-px flex-1 bg-surface-low mt-1" />}
      </div>
      <div className="pb-4 min-w-0">
        <p className="text-xs text-on-muted font-mono">{event.ts}</p>
        <p className="text-sm font-medium text-on-surface">{event.location}</p>
        <p className="text-xs text-on-muted leading-relaxed">{event.detail}</p>
      </div>
    </div>
  )
}
