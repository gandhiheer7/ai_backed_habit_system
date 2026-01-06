import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all checkins for the user from the past 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0]

    const { data: checkins, error: checkinsError } = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', thirtyDaysAgoStr)

    if (checkinsError) {
      throw checkinsError
    }

    // Get all habits for the user
    const { data: habits, error: habitsError } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)

    if (habitsError) {
      throw habitsError
    }

    // Calculate metrics
    const completedCheckins = checkins?.filter((c) => c.status === 'completed').length || 0
    const totalCheckins = checkins?.length || 0
    const completionRate = totalCheckins > 0 ? Math.round((completedCheckins / totalCheckins) * 100) : 0

    // Calculate total focus minutes
    const totalFocusMinutes = habits?.reduce((sum, habit) => {
      const durationMatch = habit.duration?.match(/(\d+)/)
      const minutes = durationMatch ? parseInt(durationMatch[1]) : 0
      const habitCheckins = checkins?.filter((c) => c.habit_id === habit.id && c.status === 'completed') || []
      return sum + minutes * habitCheckins.length
    }, 0) || 0

    // Calculate current streak (consecutive completed days)
    // We use a Set of dates where at least one habit was completed to start
    // But logically, a streak means "All habits for that day were completed" or "At least one"? 
    // Usually it's "User logged in and did something". 
    // Based on previous code: "allCompleted".
    
    const today = new Date()
    let currentStreak = 0
    let checkDate = new Date(today)
    
    // Safety break after 365 days to prevent infinite loops
    let daysChecked = 0
    
    while (daysChecked < 30) {
        const dateStr = checkDate.toISOString().split('T')[0]
        
        // Find checkins for this specific date
        const dayCheckins = checkins?.filter((c) => c.date === dateStr) || []
        
        // If no checkins found for a date, streak is broken
        if (dayCheckins.length === 0) {
            // Edge case: If it's today and user hasn't done anything yet, don't break streak from yesterday
            if (daysChecked === 0) {
                checkDate.setDate(checkDate.getDate() - 1)
                daysChecked++
                continue
            }
            break
        }
        
        // Check if all recorded checkins for that day were completed
        const allCompleted = dayCheckins.every((c) => c.status === 'completed')
        
        if (allCompleted) {
            currentStreak++
        } else {
            break
        }
        
        checkDate.setDate(checkDate.getDate() - 1)
        daysChecked++
    }

    // Calculate cognitive load score (weighted by habit weight)
    const cognitiveLoadScore = habits?.reduce((sum, habit) => {
      const weight = habit.weight || 5
      const habitCheckins = checkins?.filter((c) => c.habit_id === habit.id && c.status === 'completed') || []
      return sum + weight * habitCheckins.length
    }, 0) || 0

    // Generate intensity data for chart (last 30 days)
    const intensityData = []
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayCheckins = checkins?.filter((c) => c.date === dateStr) || []
      const dayIntensity = dayCheckins.filter((c) => c.status === 'completed').length
      const dayFocus = dayCheckins.reduce((sum, checkin) => {
        const habit = habits?.find((h) => h.id === checkin.habit_id)
        const durationMatch = habit?.duration?.match(/(\d+)/)
        return sum + (durationMatch ? parseInt(durationMatch[1]) : 0)
      }, 0)

      intensityData.push({
        day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        intensity: dayIntensity,
        focus: dayFocus,
      })
    }

    return NextResponse.json({
      intensityData,
      completionRate,
      totalFocusMinutes,
      currentStreak,
      cognitiveLoadScore: Math.round(cognitiveLoadScore),
    })
  } catch (error: any) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}