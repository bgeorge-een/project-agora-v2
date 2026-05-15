import Link from 'next/link'
import { MaterialIcon } from '@/components/ui/MaterialIcon'

export function TopNav() {
  return (
    <header className="bg-nav h-14 flex items-center px-6 gap-4 flex-shrink-0">
      <Link href="/" className="text-white font-extrabold text-base tracking-tight hover:text-white/90">
        Project Agora
      </Link>
      <span className="text-white/40 text-sm">×</span>
      <span className="text-white/70 text-sm">Interactive Prototype</span>
      <div className="ml-auto flex items-center gap-3">
        <Link href="/" className="text-white/60 hover:text-white text-xs flex items-center gap-1 transition-colors">
          <MaterialIcon name="map" size="sm" />
          Roadmap
        </Link>
        <span className="inline-flex items-center gap-1 bg-white/10 text-white/80 text-xs px-2 py-1 rounded">
          <MaterialIcon name="bolt" size="sm" />
          Live Simulation
        </span>
      </div>
    </header>
  )
}
