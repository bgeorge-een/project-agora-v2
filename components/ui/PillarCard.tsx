import { MaterialIcon } from './MaterialIcon'
import { PILLARS, type PillarKey } from '@/lib/design-tokens'

interface PillarCardProps {
  pillar: PillarKey
  href?: string
}

export function PillarCard({ pillar, href }: PillarCardProps) {
  const p = PILLARS[pillar]
  return (
    <a
      href={href}
      className="block bg-surface-card rounded shadow-card p-6 hover:shadow-md transition-shadow w-full text-left"
    >
      <MaterialIcon name={p.icon} size="lg" color={p.color} />
      <p className="mt-3 font-bold text-on-surface text-sm">{p.label}</p>
      <p className="mt-1 text-xs text-on-muted">Starts {p.phase}</p>
    </a>
  )
}
