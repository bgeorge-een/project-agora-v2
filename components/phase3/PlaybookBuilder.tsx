'use client'
import { useState } from 'react'
import { MaterialIcon } from '@/components/ui/MaterialIcon'

interface PlaybookBuilderProps {
  onPolicyGenerated: (policy: string) => void
}

const EXAMPLES = [
  'If a badge is denied 3 times in 5 minutes, trigger a security alert and lock the door for 15 minutes.',
  'Alert the on-call security officer whenever motion is detected in the server room outside business hours.',
  'Automatically request a compliance review when more than 2 PPE violations occur at the same location in one day.',
]

export function PlaybookBuilder({ onPolicyGenerated }: PlaybookBuilderProps) {
  const [description, setDescription] = useState('')
  const [generating, setGenerating] = useState(false)

  async function generatePolicy() {
    if (!description.trim()) return
    setGenerating(true)
    try {
      const res = await fetch('/api/playbook-author', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      })
      if (!res.body) return
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let text = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        text += decoder.decode(value)
      }
      onPolicyGenerated(text)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest text-on-muted">Describe the policy in plain English</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="e.g. If a badge is denied access 3 times in 5 minutes, alert the security team and temporarily lock the door…"
          className="w-full text-sm bg-surface-low rounded px-3 py-2 outline-none focus:ring-1 focus:ring-violet resize-none text-on-surface"
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => setDescription(ex)}
            className="text-[10px] text-violet bg-violet/5 px-2 py-1 rounded hover:bg-violet/10 text-left"
          >
            {ex.slice(0, 50)}…
          </button>
        ))}
      </div>
      <button
        onClick={generatePolicy}
        disabled={!description.trim() || generating}
        className="flex items-center gap-1.5 bg-violet text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-violet/90 disabled:opacity-50"
      >
        <MaterialIcon name="auto_awesome" size="sm" />
        {generating ? 'Authoring Policy…' : 'Author Policy with Claude'}
      </button>
    </div>
  )
}
