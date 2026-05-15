'use client'
import { useState } from 'react'
import { useSimulation } from '@/lib/use-simulation'
import { ViolationRow } from '@/components/phase2/ViolationRow'
import { Card } from '@/components/ui/Card'
import { MaterialIcon } from '@/components/ui/MaterialIcon'

export default function CompliancePage() {
  const { violations } = useSimulation()
  const [report, setReport] = useState('')
  const [generating, setGenerating] = useState(false)

  async function generateReport() {
    setGenerating(true)
    setReport('')
    try {
      const res = await fetch('/api/compliance-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ violations }),
      })
      if (!res.body) return
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setReport((prev) => prev + decoder.decode(value))
      }
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <MaterialIcon name="health_and_safety" size="md" color="#16A34A" />
          <h1 className="text-2xl font-extrabold">Workplace Compliance Detection</h1>
        </div>
        <p className="text-sm text-on-muted mt-1">
          PPE violations, proximity breaches, and safety policy non-compliance — with accountable records.
        </p>
      </div>

      <Card>
        <p className="text-xs font-bold uppercase tracking-widest text-on-muted mb-4">Violation Log</p>
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-bold uppercase tracking-widest text-on-muted border-b border-surface-low">
              <th className="pb-2 pr-4">Description</th>
              <th className="pb-2 pr-4">Time</th>
              <th className="pb-2 pr-4">Severity</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {violations.map((v) => <ViolationRow key={v.id} violation={v} />)}
          </tbody>
        </table>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MaterialIcon name="summarize" size="sm" color="#16A34A" />
            <p className="font-bold text-sm">EHS Weekly Report Generator</p>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-comp-green">Claude AI</span>
          </div>
          <button
            onClick={generateReport}
            disabled={generating}
            className="flex items-center gap-1.5 bg-comp-green text-white text-xs font-semibold px-3 py-1.5 rounded hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            <MaterialIcon name="auto_awesome" size="sm" />
            {generating ? 'Generating…' : 'Generate EHS Report'}
          </button>
        </div>
        {report ? (
          <div className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap bg-surface-low rounded p-4 font-mono text-xs">
            {report}
          </div>
        ) : (
          <p className="text-sm text-on-muted italic">
            Click to generate an EHS weekly safety report from the violation log above using Claude.
          </p>
        )}
      </Card>
    </div>
  )
}
