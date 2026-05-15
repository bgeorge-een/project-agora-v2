import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const { violations } = await req.json()

  const violationsSummary = violations
    .map((v: { ts: string; type: string; description: string; location: string; severity: string; status: string }) =>
      `- [${v.severity.toUpperCase()}] ${new Date(v.ts).toLocaleTimeString()} | ${v.type} | ${v.location}: ${v.description} (${v.status})`
    )
    .join('\n')

  const userMessage = `Generate a weekly EHS compliance report from the following violation log:

${violationsSummary}

Include:
1. Executive Summary (2-3 sentences)
2. Violation breakdown by type and severity
3. Open items requiring immediate action
4. Top 3 corrective action recommendations
5. Workers' compensation risk assessment (reference the $41K average claim cost and 20-40% insurer premium reduction from documented monitoring)
6. Attestation statement for the safety officer to sign

Date of report: ${new Date().toLocaleDateString()}`

  const stream = await client.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 900,
    system: 'You are an EHS (Environmental Health & Safety) compliance reporting specialist. Write formal, actionable weekly compliance reports for safety officers and risk managers. Use professional tone. Include OSHA references where relevant.',
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
