import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/mail'
import { logger } from '@/lib/logger'

export async function GET(request: Request) {
  // 1. Security Check
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 2. ADMIN CLIENT SETUP (The Fix)
    // We use the Service Role Key to bypass Row Level Security (RLS)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // 3. Fetch Users (Using Admin Client)
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('email, display_name')
      .eq('deep_work_protection', false)

    if (error) throw error

    if (!users || users.length === 0) {
      logger.info('Cron Job: No users to notify')
      return NextResponse.json({ message: 'No users found (Check Deep Work Settings)' })
    }

    logger.info(`Cron Job: Sending morning briefing to ${users.length} users`)

    // 4. Send Emails
    let sentCount = 0
    for (const user of users) {
      if (user.email) {
        await sendEmail(
          user.email,
          'AXON: Morning Protocol Briefing',
          `
            <div style="font-family: sans-serif; color: #333;">
              <h1>Good Morning, ${user.display_name || 'Operator'}</h1>
              <p>Your executive protocol is ready. Initialize your stack to maintain momentum.</p>
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
    console.error('Cron Job Failed:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}