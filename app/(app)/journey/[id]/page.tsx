'use client'
import { use, useState } from 'react'
import Link from 'next/link'
import { useSimulation } from '@/lib/use-simulation'
import { TimelineEvent } from '@/components/phase1/TimelineEvent'
import { PersonProfile } from '@/components/phase1/PersonProfile'
import { CameraClipModal } from '@/components/phase1/CameraClipModal'
import { Card } from '@/components/ui/Card'
import { MaterialIcon } from '@/components/ui/MaterialIcon'
import { StatusPill } from '@/components/ui/StatusPill'
import type { TimelineEvent as TEvent } from '@/lib/mock-data/journeys'
import { SEED_ANNOTATIONS, type Annotation, type AnnotationMap } from '@/lib/annotations'
import { NarrativeReport } from '@/components/phase1/NarrativeReport'
import { ImportEventModal } from '@/components/phase1/ImportEventModal'

const statusVariant = {
  complete: 'resolved',
  active:   'open',
  flagged:  'active',
} as const

const statusLabel = {
  complete: 'Complete',
  active:   'On-Premises',
  flagged:  'Flagged',
} as const

const statusHeaderBg = {
  complete: 'bg-comp-green/10 border-comp-green/20',
  active:   'bg-ops-blue/10 border-ops-blue/20',
  flagged:  'bg-sec-red/10 border-sec-red/20',
} as const

function duration(entry: string, exit: string): string {
  if (exit === '—') return 'Ongoing'
  const [eh, em] = entry.split(':').map(Number)
  const [xh, xm] = exit.split(':').map(Number)
  const mins = (xh * 60 + xm) - (eh * 60 + em)
  if (mins < 60) return `${mins}m`
  return `${Math.floor(mins / 60)}h ${mins % 60}m`
}

export default function JourneyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { journeys } = useSimulation()
  const journey = journeys.find((j) => j.id === id)

  const [showReport, setShowReport] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [injectedEvents, setInjectedEvents] = useState<TEvent[]>([])
  const [activeClip, setActiveClip] = useState<TEvent | null>(null)
  const [annotations, setAnnotations] = useState<AnnotationMap>(
    () => SEED_ANNOTATIONS[id] ?? {}
  )

  const CURRENT_OPERATOR = 'Basil George'

  function handleImportEvent(event: TEvent) {
    setInjectedEvents((prev) =>
      [...prev, event].sort((a, b) => a.ts.localeCompare(b.ts))
    )
  }

  function addAnnotation(eventId: string, note: string) {
    const now = new Date()
    const month = now.toLocaleString('en-US', { month: 'short' })
    const day = now.getDate()
    const year = now.getFullYear()
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    const newAnnotation: Annotation = {
      author: CURRENT_OPERATOR,
      addedAt: `${month} ${day}, ${year} · ${time}`,
      note,
    }
    setAnnotations((prev) => ({
      ...prev,
      [eventId]: [...(prev[eventId] ?? []), newAnnotation],
    }))
  }

  if (!journey) {
    return (
      <div className="max-w-3xl mx-auto">
        <p className="text-on-muted">Journey not found.</p>
        <Link href="/journey" className="text-xs text-violet hover:underline mt-2 block">← Back to journeys</Link>
      </div>
    )
  }

  const allEvents = [...journey.events, ...injectedEvents].sort((a, b) => a.ts.localeCompare(b.ts))

  const dur = duration(journey.entryTime, journey.exitTime)
  const zones = new Set(journey.events.map((e) => e.location)).size
  const cameras = journey.events.filter((e) => e.type === 'camera' || e.type === 'tailgate').length
  const denied = journey.events.filter((e) => e.detail.toLowerCase().includes('denied')).length


  return (
    <>
      {/* Import event modal */}
      {showImport && (
        <ImportEventModal
          journeyDate={journey.date}
          operator={CURRENT_OPERATOR}
          onImport={handleImportEvent}
          onClose={() => setShowImport(false)}
        />
      )}

      {/* Court-ready report modal */}
      {showReport && (
        <NarrativeReport
          journey={{ ...journey, events: allEvents }}
          annotations={annotations}
          operator={CURRENT_OPERATOR}
          onClose={() => setShowReport(false)}
        />
      )}

      {/* Camera clip modal */}
      {activeClip && activeClip.cameraPreview && (
        <CameraClipModal
          event={activeClip}
          licensePlate={journey.licensePlate}
          onClose={() => setActiveClip(null)}
        />
      )}

      <div className="max-w-3xl mx-auto space-y-5">
        <Link href="/journey" className="text-xs text-on-muted hover:text-violet flex items-center gap-1 w-fit">
          <MaterialIcon name="arrow_back" size="sm" />
          Back to journeys
        </Link>

        {/* Person profile */}
        <PersonProfile
          person={journey.person}
          licensePlate={journey.licensePlate}
          entryTime={journey.entryTime}
          cameraDetections={cameras}
        />

        {/* Journey header bar */}
        <div className={`rounded-xl p-4 border ${statusHeaderBg[journey.status]}`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-widest text-on-muted">Journey Summary</p>
            <StatusPill label={statusLabel[journey.status]} variant={statusVariant[journey.status]} />
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1.5 bg-white/70 rounded px-3 py-1.5">
              <MaterialIcon name="schedule" size="sm" color="#43474c" />
              <span className="font-semibold">{dur}</span>
              <span className="text-on-muted">duration</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/70 rounded px-3 py-1.5">
              <MaterialIcon name="login" size="sm" color="#43474c" />
              <span className="font-semibold">{journey.entryTime}</span>
              <span className="text-on-muted">entry</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/70 rounded px-3 py-1.5">
              <MaterialIcon name="logout" size="sm" color="#43474c" />
              <span className="font-semibold">{journey.exitTime}</span>
              <span className="text-on-muted">exit</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/70 rounded px-3 py-1.5">
              <MaterialIcon name="location_on" size="sm" color="#43474c" />
              <span className="font-semibold">{zones}</span>
              <span className="text-on-muted">zones</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/70 rounded px-3 py-1.5">
              <MaterialIcon name="videocam" size="sm" color="#43474c" />
              <span className="font-semibold">{cameras}</span>
              <span className="text-on-muted">camera detections</span>
            </div>
            {denied > 0 && (
              <div className="flex items-center gap-1.5 bg-red-100 rounded px-3 py-1.5 text-sec-red font-semibold">
                <MaterialIcon name="block" size="sm" color="#DC2626" />
                {denied} denied
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <MaterialIcon name="timeline" size="sm" color="#5644D0" />
            <p className="text-xs font-bold uppercase tracking-widest text-on-muted">Event Timeline</p>
            {injectedEvents.length > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                +{injectedEvents.length} added
              </span>
            )}
            <span className="ml-auto text-xs text-on-muted">{allEvents.length} events</span>
            <button
              onClick={() => setShowImport(true)}
              className="flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded transition-colors"
            >
              <MaterialIcon name="add_circle" size="sm" color="#D97706" />
              Import Event
            </button>
          </div>
          {allEvents.map((event, i) => (
            <TimelineEvent
              key={event.id}
              event={event}
              date={journey.date}
              isLast={i === allEvents.length - 1}
              onPreviewClick={setActiveClip}
              annotations={annotations[event.id] ?? []}
              onAddAnnotation={addAnnotation}
            />
          ))}
        </Card>

        {/* Court-Ready Report trigger */}
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MaterialIcon name="gavel" size="sm" color="#5644D0" />
              <p className="font-bold text-sm">Court-Ready Incident Report</p>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet/10 text-violet">Claude AI</span>
            </div>
            <button
              onClick={() => setShowReport(true)}
              className="flex items-center gap-1.5 bg-violet text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-violet/90 transition-colors"
            >
              <MaterialIcon name="description" size="sm" />
              Generate Report
            </button>
          </div>
          <p className="text-xs text-on-muted mt-2 leading-relaxed">
            Generates a structured, court-admissible security incident report with chain-of-custody hash, inline editing, audit log, and PDF export.
          </p>
        </Card>
      </div>
    </>
  )
}
