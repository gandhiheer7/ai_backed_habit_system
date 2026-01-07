import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: "You are a high-performance executive coach. Generate ONE short, powerful, unique motivational quote (max 20 words) about discipline, focus, or relentless execution. Do not attribute it to anyone. Do not use quotation marks."
          }
        ],
        temperature: 0.9,
      }),
    })

    if (!response.ok) {
      throw new Error(`Groq API Error: ${response.status}`)
    }

    const data = await response.json()
    const quote = data.choices[0]?.message?.content || "Discipline is the bridge between goals and accomplishment."

    return NextResponse.json({ quote: quote.replace(/"/g, '') })
  } catch (error: any) {
    logger.error("Quote API Failed", error)
    return NextResponse.json(
      { quote: "The secret of getting ahead is getting started." },
      { status: 200 } // Return 200 with fallback to prevent UI errors
    )
  }
}