import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const { incident, messages } = await req.json()

  const systemPrompt = `You are an AI security investigator assistant analyzing a physical security incident.

Incident context:
- Title: ${incident.title}
- Location: ${incident.location}
- Description: ${incident.description}
- Severity: ${incident.severity}
- Status: ${incident.status}
- Data sources: ${incident.sources.join(', ')}
- Timestamp: ${incident.ts}

Answer investigator questions about this incident concisely and helpfully. Suggest next steps when relevant. Reference the specific data sources available. When asked about people or access patterns, reason from what access control and camera data would show. Keep responses under 150 words.`

  const stream = await client.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    system: systemPrompt,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
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
