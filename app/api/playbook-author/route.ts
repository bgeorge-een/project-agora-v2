import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const { description } = await req.json()

  const stream = await client.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    system: `You are a physical security policy engine. Convert plain English security policy descriptions into structured JSON policy objects for the Agora playbook engine.

The JSON schema:
{
  "name": "Policy name",
  "description": "Brief policy description",
  "triggers": [
    {
      "type": "access_denied | motion_detected | badge_swipe | ppe_violation | tailgate",
      "conditions": { "count": number, "window_seconds": number, "location": "optional string" }
    }
  ],
  "actions": [
    {
      "type": "alert | lock_door | notify_team | create_incident | request_review",
      "target": "string",
      "delay_seconds": number
    }
  ],
  "priority": "critical | high | medium | low",
  "enabled": true
}

Return only valid JSON with no explanation text.`,
    messages: [{ role: 'user', content: description }],
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
