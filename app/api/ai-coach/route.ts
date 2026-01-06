import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's habits and recent checkins
    const { data: habits } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)

    const { data: checkins } = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])

    // Get user profile for context
    const { data: userProfile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    // Calculate current metrics
    const completedToday = checkins?.filter(
      (c) => c.date === new Date().toISOString().split('T')[0] && c.status === 'completed'
    ).length || 0

    const completionRate = checkins && checkins.length > 0
      ? Math.round((checkins.filter((c) => c.status === 'completed').length / checkins.length) * 100)
      : 0

    // Build context for AI
    const habitsList = habits?.map((h) => `- ${h.name} (${h.duration}, streak: ${h.streak})`).join('\n') || 'No habits yet'

    const prompt = `You are an executive coach AI assistant for a habit tracking system called AXON.

User Profile:
- Name: ${userProfile?.display_name || 'Executive'}
- Role: ${userProfile?.role || 'Not specified'}
- Focus: ${userProfile?.professional_focus || 'General productivity'}

Current Habits:
${habitsList}

Recent Performance (Last 7 days):
- Completion Rate: ${completionRate}%
- Completed Today: ${completedToday} habits
- Total Habits: ${habits?.length || 0}

Based on this data, provide:
1. A brief analysis of their habit performance (2-3 sentences)
2. ONE specific, actionable suggestion to improve their protocol
3. If applicable, suggest adjusting a specific habit

Keep your response concise and direct. Format your response as JSON with these fields:
{
  "analysis": "brief performance analysis",
  "suggestedAdjustment": {
    "habitName": "habit name or 'New Habit'",
    "action": "Add/Reduce/Move/Focus",
    "details": "specific change to make",
    "reason": "why this will help"
  }
}

If performance is good, still provide one optimization suggestion.`

    // Call Groq API with currently available model
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!groqResponse.ok) {
      const error = await groqResponse.text()
      console.error('Groq API error:', error)
      throw new Error('Failed to get AI analysis')
    }

    const groqData = await groqResponse.json()
    const aiMessage = groqData.choices[0]?.message?.content

    if (!aiMessage) {
      throw new Error('No response from AI')
    }

    // Parse the JSON response from AI
    let parsedResponse
    try {
      // Extract JSON from response (in case AI adds extra text)
      const jsonMatch = aiMessage.match(/\{[\s\S]*\}/)
      parsedResponse = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(aiMessage)
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Raw response:', aiMessage)
      // If parsing fails, return a structured response
      parsedResponse = {
        analysis: aiMessage,
        suggestedAdjustment: null,
      }
    }

    return NextResponse.json(parsedResponse)
  } catch (error: any) {
    console.error('AI Coach error:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate coaching analysis',
        analysis: 'Unable to generate analysis at this moment. Try again later.',
        suggestedAdjustment: null,
      },
      { status: 500 }
    )
  }
}