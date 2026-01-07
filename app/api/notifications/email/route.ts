import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/mail'
import { logger } from '@/lib/logger'

export async function GET(request: Request) {
  // 1. Security Check (CRON_SECRET)
  // This ensures only Vercel can trigger this route, not random people on the internet.
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createServerSupabaseClient()

    // 2. Fetch Users
    // Find users who have NOT blocked notifications via "Deep Work Protection"
    const { data: users, error } = await supabase
      .from('users')
      .select('email, display_name')
      .eq('deep_work_protection', false)

    if (error) throw error

    if (!users || users.length === 0) {
      logger.info('Cron Job: No users to notify')
      return NextResponse.json({ message: 'No users found' })
    }

    logger.info(`Cron Job: Sending morning briefing to ${users.length} users`)

    // 3. Send Emails (Loop)
    let sentCount = 0
    for (const user of users) {
      if (user.email) {
        // You could fetch their specific "Today's Habits" here to personalize it further
        await sendEmail(
          user.email,
          'AXON: Morning Protocol Briefing',
          `
            <div style="font-family: sans-serif; color: #333;">
              <h1>Good Morning, ${user.display_name}</h1>
              <p>It is time to initialize your protocol. Log in to check your tasks.</p>
              <br/>
              <a href="https://axonhabitsystem.vercel.app/dashboard" 
                 style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                 Initialize Protocol
              </a>
            </div>
          `
        )
        sentCount++
      }
    }

    return NextResponse.json({ success: true, emails_sent: sentCount })

  } catch (error: any) {
    logger.error('Cron Job Failed', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}