'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MaterialIcon } from '@/components/ui/MaterialIcon'

const nav = [
  { href: '/journey', icon: 'route', label: 'Person Journey', phase: 1 },
  { href: '/incidents', icon: 'emergency', label: 'Incidents', phase: 2 },
  { href: '/compliance', icon: 'health_and_safety', label: 'Compliance', phase: 2 },
  { href: '/world-aware', icon: 'public', label: 'World-Aware', phase: 3 },
  { href: '/playbooks', icon: 'menu_book', label: 'Playbooks', phase: 3 },
] as const

const phaseBadge: Record<number, string> = {
  1: 'bg-ph1-badge text-white',
  2: 'bg-ph2-badge text-white',
  3: 'bg-ph3-badge text-white',
}

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="bg-sidebar w-52 flex-shrink-0 flex flex-col py-2 gap-0.5">
      {/* Back to Roadmap */}
      <Link
        href="/"
        className="flex items-center gap-2 px-4 py-2.5 mx-2 mb-2 rounded text-xs text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors border-b border-white/10 pb-3"
      >
        <MaterialIcon name="arrow_back" size="sm" />
        Back to Roadmap
      </Link>

      {nav.map((item) => {
        const active = pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded mx-2 text-sm transition-colors ${
              active ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white/90 hover:bg-white/5'
            }`}
          >
            <MaterialIcon name={item.icon} size="sm" />
            <span className="flex-1">{item.label}</span>
            {item.phase && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${phaseBadge[item.phase]}`}>
                P{item.phase}
              </span>
            )}
          </Link>
        )
      })}
    </aside>
  )
}
