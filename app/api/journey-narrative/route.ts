import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const { journey } = await req.json()

  const eventsText = journey.events
    .map((e: { ts: string; type: string; location: string; detail: string }) =>
      `  ${e.ts} | ${e.type.toUpperCase()} | ${e.location} | ${e.detail}`)
    .join('\n')

  const deniedCount = journey.events.filter((e: { detail: string }) =>
    e.detail.toLowerCase().includes('denied')).length

  const personDesc = journey.person?.type === 'unknown'
    ? `Unknown individual (no credentials on record) — entered via tailgating`
    : `${journey.person?.name ?? journey.personLabel}, ${journey.person?.title ?? ''}, ${journey.person?.department ?? ''}`

  const userMessage = `You are writing the "Incident Narrative" section of a formal physical security incident report that will be submitted as a legal exhibit.

Subject: ${personDesc}
Date: ${journey.date}
Entry: ${journey.entryTime} | Exit: ${journey.exitTime}
Status: ${journey.status.toUpperCase()}
Access denied attempts: ${deniedCount}

Chronological event log:
${eventsText}

Write 3–4 tight paragraphs in formal third-person past tense. Structure as follows:
1. Opening paragraph: Identify the subject, date, and overall nature of the recorded activity.
2. Movement narrative: Describe the sequence of access events and camera detections as a continuous narrative, referencing exact timestamps.
3. Anomalies paragraph (if any denied attempts, tailgating, or lingering): State each anomaly factually with the timestamp, location, and what occurred. If no anomalies, note the absence of flagged events.
4. Closing attestation: State that the record is derived from tamper-evident physical security infrastructure and represents a complete, unbroken chain of custody from the security management system.

Use precise legal language. Do not speculate. Do not add events not in the log.`

  const stream = await client.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 900,
    system: 'You are a forensic documentation specialist. Write exclusively in formal, court-admissible prose. Reference all timestamps exactly as provided. Never speculate or add detail beyond the documented event log.',
    messages: [{ role: 'user', content: userMessage }],
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          controller.enqueue(encoder.encode(event.delta.text))
        }
      }
      controller.close()
    },
  })

  return new Response(readable, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
