'use client'
import { MaterialIcon } from '@/components/ui/MaterialIcon'
import type { SceneType } from '@/lib/mock-data/journeys'

interface CameraStillProps {
  channel: string
  sceneType: SceneType
  location: string
  timestamp: string
  onClick: () => void
}

const sceneBg: Record<SceneType, string> = {
  parking:    'from-zinc-800 via-zinc-700 to-zinc-800',
  lobby:      'from-zinc-600 via-zinc-500 to-zinc-600',
  hallway:    'from-zinc-900 via-zinc-700 to-zinc-900',
  elevator:   'from-zinc-700 via-zinc-650 to-zinc-800',
  exterior:   'from-slate-700 via-slate-600 to-slate-700',
  restricted: 'from-zinc-900 via-stone-800 to-zinc-900',
}

const sceneOverlay: Record<SceneType, string> = {
  parking:    'from-transparent via-transparent to-zinc-900/40',
  lobby:      'from-transparent via-transparent to-zinc-700/30',
  hallway:    'from-zinc-900/60 via-transparent to-zinc-900/60',
  elevator:   'from-transparent via-transparent to-zinc-900/40',
  exterior:   'from-slate-800/30 via-transparent to-slate-800/20',
  restricted: 'from-red-950/20 via-transparent to-zinc-950/50',
}

export function CameraStill({ channel, sceneType, location, timestamp, onClick }: CameraStillProps) {
  return (
    <div
      className={`relative bg-gradient-to-br ${sceneBg[sceneType]} rounded overflow-hidden cursor-pointer group aspect-video w-full`}
      onClick={onClick}
    >
      {/* Scan lines */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.4) 3px, rgba(255,255,255,0.4) 4px)' }}
      />

      {/* Scene depth overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${sceneOverlay[sceneType]} pointer-events-none`} />

      {/* Scene-specific suggestion shapes */}
      {sceneType === 'hallway' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
          <div className="w-8 h-32 bg-white/20 rounded-sm" style={{ perspective: '100px' }} />
          <div className="w-4 h-28 bg-white/10 rounded-sm ml-1" />
        </div>
      )}
      {sceneType === 'parking' && (
        <div className="absolute bottom-8 left-0 right-0 pointer-events-none opacity-15">
          <div className="border-t border-white/40 mx-6" />
          <div className="border-t border-white/30 mx-6 mt-3" />
        </div>
      )}
      {sceneType === 'restricted' && (
        <div className="absolute inset-0 border-2 border-red-800/30 m-1 rounded pointer-events-none" />
      )}

      {/* Top HUD bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-2 py-1 bg-black/50 backdrop-blur-[1px]">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[8px] font-bold text-white/90 font-mono tracking-widest">REC</span>
        </div>
        <span className="text-[8px] text-white/50 font-mono">{channel}</span>
      </div>

      {/* Bottom info bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-2 pb-1.5 pt-4 pointer-events-none">
        <p className="text-[8px] text-white/50 font-mono tabular-nums">{timestamp}</p>
        <p className="text-[10px] text-white/90 font-medium leading-tight truncate">{location.toUpperCase()}</p>
      </div>

      {/* Hover play overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/25 pointer-events-none">
        <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-lg scale-95 group-hover:scale-100 transition-transform">
          <MaterialIcon name="play_arrow" size="sm" color="#1b1c1b" />
        </div>
      </div>
    </div>
  )
}
