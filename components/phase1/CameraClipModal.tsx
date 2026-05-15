'use client'
import { useState, useEffect } from 'react'
import { CameraStill } from './CameraStill'
import { MaterialIcon } from '@/components/ui/MaterialIcon'
import type { TimelineEvent } from '@/lib/mock-data/journeys'

interface CameraClipModalProps {
  event: TimelineEvent
  licensePlate?: string
  onClose: () => void
}

export function CameraClipModal({ event, licensePlate, onClose }: CameraClipModalProps) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [copied, setCopied] = useState(false)

  const preview = event.cameraPreview!

  useEffect(() => {
    if (!playing) return
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); setPlaying(false); return 100 }
        return p + 100 / 50 // ~3s at 60ms ticks
      })
    }, 60)
    return () => clearInterval(interval)
  }, [playing])

  function togglePlay() {
    if (progress >= 100) setProgress(0)
    setPlaying((p) => !p)
  }

  function copyPlate() {
    if (!licensePlate) return
    navigator.clipboard.writeText(licensePlate)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const elapsed = Math.round((progress / 100) * 30)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-surface-card rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-surface-low">
          <div className="flex items-center gap-2">
            <MaterialIcon name="videocam" size="sm" color="#5644D0" />
            <span className="font-semibold text-sm">{event.location}</span>
            <span className="text-[10px] text-on-muted font-mono bg-surface-low px-1.5 py-0.5 rounded">
              {preview.channel}
            </span>
          </div>
          <button onClick={onClose} className="text-on-muted hover:text-on-surface transition-colors p-1">
            <MaterialIcon name="close" size="sm" />
          </button>
        </div>

        {/* Camera still — larger */}
        <div className="relative">
          <CameraStill
            channel={preview.channel}
            sceneType={preview.sceneType}
            location={event.location}
            timestamp={event.ts}
            onClick={togglePlay}
          />
          {!playing && progress === 0 && (
            <div
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={togglePlay}
            >
              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
                <MaterialIcon name="play_arrow" size="md" color="#1b1c1b" />
              </div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-surface-low">
          <div
            className="h-full bg-violet transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Playback controls */}
        <div className="px-4 py-2.5 flex items-center gap-3 border-b border-surface-low">
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-surface-low flex items-center justify-center hover:bg-surface-card transition-colors"
          >
            <MaterialIcon name={playing ? 'pause' : 'play_arrow'} size="sm" color="#43474c" />
          </button>
          <div
            className="flex-1 h-1.5 bg-surface-low rounded-full cursor-pointer relative"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              setProgress(((e.clientX - rect.left) / rect.width) * 100)
            }}
          >
            <div className="h-full bg-violet rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-[11px] font-mono text-on-muted tabular-nums">{elapsed}s / 30s</span>
        </div>

        {/* Event metadata */}
        <div className="px-4 py-3 space-y-3">
          <p className="text-xs text-on-muted leading-relaxed">{event.detail}</p>

          {licensePlate && (
            <div className="flex items-center gap-3 bg-surface-low rounded-lg px-3 py-2.5">
              <MaterialIcon name="directions_car" size="sm" color="#43474c" />
              <div className="flex-1">
                <p className="text-[10px] text-on-muted uppercase tracking-wide">License Plate</p>
                <p className="text-sm font-extrabold font-mono tracking-[0.15em] text-on-surface">{licensePlate}</p>
              </div>
              <button
                onClick={copyPlate}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded transition-colors bg-surface-card hover:bg-white border border-surface-low"
                style={{ color: copied ? '#16A34A' : '#5644D0' }}
              >
                <MaterialIcon name={copied ? 'check' : 'content_copy'} size="sm" color={copied ? '#16A34A' : '#5644D0'} />
                {copied ? 'Copied!' : 'Copy plate'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
