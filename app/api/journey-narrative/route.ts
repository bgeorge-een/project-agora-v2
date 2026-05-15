import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const { journey } = await req.json()

  const eventsText = journey.events
    .map((e: { ts: string; location: string; detail: string }) => `  ${e.ts} | ${e.location} | ${e.detail}`)
    .join('\n')

  const userMessage = `Generate a court-ready narrative for the following person journey record:

Person: ${journey.personLabel}
Date: ${journey.date}
Entry: ${journey.entryTime}
Exit: ${journey.exitTime}
Status: ${journey.status}

Event log:
${eventsText}

Write a 3–4 paragraph narrative suitable for a legal proceeding. Include: entry/exit summary, notable access patterns, any anomalies or flagged events, and a closing statement on the completeness of the corroborated record.`

  const stream = await client.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 700,
    system: 'You are a forensic documentation specialist creating court-admissible physical security narratives. Write in clear, precise, third-person past tense. Reference timestamps exactly as provided. Do not speculate beyond the documented events. Format as a formal incident narrative report.',
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

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
