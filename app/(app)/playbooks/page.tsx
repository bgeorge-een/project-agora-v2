'use client'
import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { MaterialIcon } from '@/components/ui/MaterialIcon'
import { PlaybookBuilder } from '@/components/phase3/PlaybookBuilder'

const EXAMPLE_PLAYBOOKS = [
  { id: 'pb-1', name: 'After-Hours Intrusion Response', triggers: 3, actions: 4, lastUpdated: '2026-05-10' },
  { id: 'pb-2', name: 'Tailgate Detection Protocol', triggers: 2, actions: 3, lastUpdated: '2026-05-08' },
  { id: 'pb-3', name: 'PPE Violation Escalation', triggers: 2, actions: 2, lastUpdated: '2026-05-12' },
]

export default function PlaybooksPage() {
  const [generatedPolicy, setGeneratedPolicy] = useState('')

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <MaterialIcon name="menu_book" size="md" color="#2563EB" />
          <h1 className="text-2xl font-extrabold">Agentic Playbooks</h1>
        </div>
        <p className="text-sm text-on-muted mt-1">
          Author automated response policies in plain English — Claude converts them into structured rules.
        </p>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <MaterialIcon name="auto_awesome" size="sm" color="#5644D0" />
          <p className="font-bold text-sm">Playbook Policy Authoring</p>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet/10 text-violet">Claude AI</span>
        </div>
        <PlaybookBuilder onPolicyGenerated={setGeneratedPolicy} />
        {generatedPolicy && (
          <div className="mt-4 bg-surface-low rounded p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-on-muted mb-2">Generated Policy Structure</p>
            <pre className="text-xs text-on-surface overflow-auto whitespace-pre-wrap leading-relaxed">{generatedPolicy}</pre>
          </div>
        )}
      </Card>

      <Card>
        <p className="text-xs font-bold uppercase tracking-widest text-on-muted mb-4">Existing Playbooks</p>
        <div className="space-y-3">
          {EXAMPLE_PLAYBOOKS.map((pb) => (
            <div key={pb.id} className="flex items-center justify-between py-2 border-b border-surface-low last:border-0">
              <div>
                <p className="text-sm font-semibold text-on-surface">{pb.name}</p>
                <p className="text-xs text-on-muted">
                  {pb.triggers} triggers · {pb.actions} actions · Updated {pb.lastUpdated}
                </p>
              </div>
              <button className="text-xs text-violet hover:underline">Edit</button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
