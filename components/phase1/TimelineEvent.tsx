'use client'
import { useState } from 'react'
import { CameraStill } from './CameraStill'
import { MaterialIcon } from '@/components/ui/MaterialIcon'
import type { TimelineEvent as TEvent } from '@/lib/mock-data/journeys'
import type { Annotation } from '@/lib/annotations'

const iconMap = {
  access:   { icon: 'key',           color: '#5644D0', bg: 'bg-violet/10' },
  camera:   { icon: 'videocam',      color: '#43474c', bg: 'bg-surface-low' },
  elevator: { icon: 'elevator',      color: '#2563EB', bg: 'bg-blue-50' },
  parking:  { icon: 'local_parking', color: '#16A34A', bg: 'bg-green-50' },
  tailgate: { icon: 'warning',       color: '#DC2626', bg: 'bg-red-100' },
} as const

function formatDate(isoDate?: string): string {
  if (!isoDate) return ''
  const [, m, d] = isoDate.split('-').map(Number)
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[m - 1]} ${d}`
}

interface TimelineEventProps {
  event: TEvent
  date: string
  isLast: boolean
  onPreviewClick: (event: TEvent) => void
  annotations: Annotation[]
  onAddAnnotation: (eventId: string, note: string) => void
}

export function TimelineEvent({ event, date, isLast, onPreviewClick, annotations, onAddAnnotation }: TimelineEventProps) {
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState('')

  const cfg = iconMap[event.type]
  const isDenied = event.detail.toLowerCase().includes('denied')
  const isAlert = event.type === 'tailgate' || event.detail.toLowerCase().includes('lingering') || event.detail.toLowerCase().includes('attempting')

  const dotBg    = isDenied || event.type === 'tailgate' ? 'bg-red-100' : cfg.bg
  const dotColor = isDenied || event.type === 'tailgate' ? '#DC2626' : cfg.color
  const dotIcon  = isDenied ? 'block' : cfg.icon

  function saveNote() {
    const trimmed = draft.trim()
    if (trimmed) onAddAnnotation(event.id, trimmed)
    setDraft('')
    setAdding(false)
  }

  return (
    <div className="flex gap-3">
      {/* Dot + connector */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-8 h-8 rounded-full ${dotBg} flex items-center justify-center`}>
          <MaterialIcon name={dotIcon} size="sm" color={dotColor} />
        </div>
        {!isLast && (
          <div className={`w-px flex-1 mt-1 ${isDenied || isAlert ? 'bg-red-200' : 'bg-surface-low'}`} />
        )}
      </div>

      {/* Content row: text left, thumbnail right */}
      <div className={`flex-1 flex gap-3 pb-5 min-w-0 ${isDenied || isAlert ? 'bg-red-50/40 -mx-1 px-1 rounded' : event.injected ? 'bg-amber-50/70 -mx-1 px-2 rounded border-l-2 border-amber-400' : ''}`}>

        {/* Text column */}
        <div className="flex-1 min-w-0">
          {/* Timestamp with date */}
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="text-[11px] text-on-muted font-mono tabular-nums">
              <span className="text-on-muted/60">{formatDate(date)} · </span>{event.ts}
            </span>
            {event.injected && (
              <span className="inline-flex items-center gap-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                <MaterialIcon name="edit_note" size="sm" color="#D97706" />
                OPERATOR ADDED
              </span>
            )}
            {isDenied && (
              <span className="inline-flex items-center gap-0.5 bg-red-100 text-sec-red text-[10px] font-bold px-1.5 py-0.5 rounded">
                DENIED
              </span>
            )}
            {event.type === 'tailgate' && (
              <span className="inline-flex items-center gap-0.5 bg-red-100 text-sec-red text-[10px] font-bold px-1.5 py-0.5 rounded">
                TAILGATE
              </span>
            )}
            {isAlert && !isDenied && event.type !== 'tailgate' && (
              <span className="inline-flex items-center gap-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                ALERT
              </span>
            )}
          </div>

          <p className={`text-sm font-semibold leading-tight ${isDenied || event.type === 'tailgate' ? 'text-sec-red' : 'text-on-surface'}`}>
            {event.location}
          </p>
          <p className={`text-xs leading-relaxed mt-0.5 ${isDenied || isAlert ? 'text-red-600' : 'text-on-muted'}`}>
            {event.detail}
          </p>
          {event.injected && event.injectedBy && (
            <p className="text-[10px] text-amber-600 mt-0.5 italic">
              Added by {event.injectedBy}{event.injectedReason ? ` — "${event.injectedReason}"` : ''}
            </p>
          )}

          {/* Annotation thread */}
          {annotations.length > 0 && (
            <div className="mt-3 border-l-2 border-amber-200 pl-3 space-y-2">
              {annotations.map((ann, i) => {
                const initials = (ann.author ?? '?').split(' ').map((n) => n[0]).join('')
                return (
                  <div key={i} className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-[9px] font-extrabold text-white flex-shrink-0">
                        {initials}
                      </div>
                      <span className="text-[11px] font-semibold text-amber-800">{ann.author}</span>
                      <span className="text-[10px] text-amber-500 ml-auto tabular-nums">{ann.addedAt}</span>
                    </div>
                    <p className="text-xs text-amber-900 leading-snug">{ann.note}</p>
                  </div>
                )
              })}
            </div>
          )}

          {/* Add annotation */}
          {adding ? (
            <div className="mt-2">
              <textarea
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveNote() } if (e.key === 'Escape') { setAdding(false); setDraft('') } }}
                placeholder="Add observation or note… (Enter to save)"
                className="w-full text-xs rounded border border-amber-300 bg-amber-50 px-2.5 py-2 resize-none outline-none focus:ring-1 focus:ring-amber-400 placeholder:text-amber-400 text-amber-900"
                rows={2}
              />
              <div className="flex gap-2 mt-1">
                <button
                  onClick={saveNote}
                  className="text-[11px] font-semibold px-2.5 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
                >
                  Save note
                </button>
                <button
                  onClick={() => { setAdding(false); setDraft('') }}
                  className="text-[11px] text-on-muted hover:text-on-surface transition-colors px-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="mt-1.5 flex items-center gap-1 text-[11px] text-on-muted/60 hover:text-amber-600 transition-colors group"
            >
              <MaterialIcon name="add_comment" size="sm" color="currentColor" className="group-hover:text-amber-600" />
              Add note
            </button>
          )}
        </div>

        {/* Camera thumbnail — right column */}
        {event.cameraPreview && (
          <div className="flex-shrink-0 w-36">
            <CameraStill
              channel={event.cameraPreview.channel}
              sceneType={event.cameraPreview.sceneType}
              location={event.location}
              timestamp={event.ts}
              onClick={() => onPreviewClick(event)}
            />
            <p className="text-[10px] text-on-muted mt-1 text-center">Tap to play clip</p>
          </div>
        )}
      </div>
    </div>
  )
}
