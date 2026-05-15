'use client'
import { use, useState } from 'react'
import Link from 'next/link'
import { useSimulation } from '@/lib/use-simulation'
import { TimelineEvent } from '@/components/phase1/TimelineEvent'
import { Card } from '@/components/ui/Card'
import { MaterialIcon } from '@/components/ui/MaterialIcon'
import { StatusPill } from '@/components/ui/StatusPill'

const statusVariant = {
  complete: 'resolved',
  active: 'open',
  flagged: 'active',
} as const

export default function JourneyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { journeys } = useSimulation()
  const journey = journeys.find((j) => j.id === id)

  const [narrative, setNarrative] = useState('')
  const [generating, setGenerating] = useState(false)

  if (!journey) {
    return (
      <div className="max-w-3xl mx-auto">
        <p className="text-on-muted">Journey not found.</p>
        <Link href="/journey" className="text-xs text-violet hover:underline mt-2 block">← Back to journeys</Link>
      </div>
    )
  }

  async function generateNarrative() {
    setGenerating(true)
    setNarrative('')
    try {
      const res = await fetch('/api/journey-narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ journey }),
      })
      if (!res.body) return
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setNarrative((prev) => prev + decoder.decode(value))
      }
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/journey" className="text-xs text-on-muted hover:text-violet flex items-center gap-1">
        <MaterialIcon name="arrow_back" size="sm" />
        Back to journeys
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">{journey.personLabel}</h1>
          <p className="text-sm text-on-muted">{journey.date} · Entry {journey.entryTime} → Exit {journey.exitTime}</p>
        </div>
        <StatusPill label={journey.status} variant={statusVariant[journey.status]} />
      </div>

      <Card>
        <p className="text-xs font-bold uppercase tracking-widest text-on-muted mb-4">Event Timeline</p>
        {journey.events.map((event, i) => (
          <TimelineEvent key={event.id} event={event} isLast={i === journey.events.length - 1} />
        ))}
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MaterialIcon name="auto_awesome" size="sm" color="#5644D0" />
            <p className="font-bold text-sm">Journey Narrative Generator</p>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet/10 text-violet">Claude AI</span>
          </div>
          <button
            onClick={generateNarrative}
            disabled={generating}
            className="flex items-center gap-1.5 bg-violet text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-violet/90 disabled:opacity-50 transition-colors"
          >
            <MaterialIcon name="description" size="sm" />
            {generating ? 'Generating…' : 'Generate Court-Ready Narrative'}
          </button>
        </div>
        {narrative ? (
          <div className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap bg-surface-low rounded p-4">
            {narrative}
          </div>
        ) : (
          <p className="text-sm text-on-muted italic">
            Click to generate a court-ready narrative from this journey&apos;s event timeline using Claude.
          </p>
        )}
      </Card>
    </div>
  )
}
