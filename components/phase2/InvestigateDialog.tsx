'use client'
import { useState, useRef, useEffect } from 'react'
import { MaterialIcon } from '@/components/ui/MaterialIcon'
import type { Incident } from '@/lib/mock-data/incidents'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface InvestigateDialogProps {
  incident: Incident
  onClose: () => void
}

const STARTER_QUESTIONS = [
  'Who was in the building at the time?',
  'What cameras cover this area?',
  'Has this person triggered alerts before?',
  'What should I do next?',
]

export function InvestigateDialog({ incident, onClose }: InvestigateDialogProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch('/api/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incident, messages: newMessages }),
      })
      if (!res.body) return
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let assistantText = ''
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }])
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        assistantText += decoder.decode(value)
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: assistantText },
        ])
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-card rounded shadow-card w-full max-w-lg flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-low">
          <div className="flex items-center gap-2">
            <MaterialIcon name="search" size="sm" color="#5644D0" />
            <p className="font-bold text-sm">Investigate Incident</p>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet/10 text-violet">Claude AI</span>
          </div>
          <button onClick={onClose} className="text-on-muted hover:text-on-surface">
            <MaterialIcon name="close" size="sm" />
          </button>
        </div>

        <div className="px-4 py-3 bg-surface-low">
          <p className="text-xs font-semibold text-on-surface truncate">{incident.title}</p>
          <p className="text-xs text-on-muted">{incident.location}</p>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="space-y-2">
              <p className="text-xs text-on-muted italic">Ask anything about this incident:</p>
              {STARTER_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="block w-full text-left text-xs text-violet bg-violet/5 px-3 py-2 rounded hover:bg-violet/10"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs text-xs rounded px-3 py-2 leading-relaxed ${
                  msg.role === 'user' ? 'bg-violet text-white' : 'bg-surface-low text-on-surface'
                }`}
              >
                {msg.content || (loading && i === messages.length - 1 ? '…' : '')}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={sendMessage} className="px-4 py-3 border-t border-surface-low flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this incident…"
            className="flex-1 text-xs bg-surface-low rounded px-3 py-2 outline-none focus:ring-1 focus:ring-violet text-on-surface"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-violet text-white text-xs px-3 py-2 rounded disabled:opacity-50 hover:bg-violet/90"
          >
            <MaterialIcon name="send" size="sm" />
          </button>
        </form>
      </div>
    </div>
  )
}
