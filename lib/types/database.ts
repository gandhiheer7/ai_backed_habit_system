// Auto-generated types for your Supabase database
// These match the tables we created in Phase 1

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          display_name: string | null
          photo_url: string | null
          role: string
          professional_focus: string | null
          theme: 'light' | 'dark' | 'system'
          ai_intensity: number
          weekend_monitoring: boolean
          smart_rescheduling: boolean
          briefing_time: string
          deep_work_protection: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string
          photo_url?: string
          role?: string
          professional_focus?: string
          theme?: 'light' | 'dark' | 'system'
          ai_intensity?: number
          weekend_monitoring?: boolean
          smart_rescheduling?: boolean
          briefing_time?: string
          deep_work_protection?: boolean
        }
        Update: {
          display_name?: string
          photo_url?: string
          role?: string
          professional_focus?: string
          theme?: 'light' | 'dark' | 'system'
          ai_intensity?: number
          weekend_monitoring?: boolean
          smart_rescheduling?: boolean
          briefing_time?: string
          deep_work_protection?: boolean
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          duration: string
          status: 'pending' | 'completed' | 'missed'
          streak: number
          category: string | null
          weight: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          name: string
          description?: string
          duration: string
          status?: 'pending' | 'completed' | 'missed'
          streak?: number
          category?: string
          weight?: number
        }
        Update: {
          name?: string
          description?: string
          duration?: string
          status?: 'pending' | 'completed' | 'missed'
          streak?: number
          category?: string
          weight?: number
        }
      }
      checkins: {
        Row: {
          id: string
          habit_id: string
          user_id: string
          status: 'pending' | 'completed' | 'missed'
          date: string
          timestamp: string
          notes: string | null
          reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          habit_id: string
          user_id: string
          status: 'pending' | 'completed' | 'missed'
          date: string
          notes?: string
          reason?: string
        }
        Update: {
          status?: 'pending' | 'completed' | 'missed'
          notes?: string
          reason?: string
        }
      }
      notification_preferences: {
        Row: {
          id: string
          user_id: string
          email_enabled: boolean
          daily_briefing: boolean
          missed_habit_alerts: boolean
          streak_milestones: boolean
          ai_insights: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          email_enabled?: boolean
          daily_briefing?: boolean
          missed_habit_alerts?: boolean
          streak_milestones?: boolean
          ai_insights?: boolean
        }
        Update: {
          email_enabled?: boolean
          daily_briefing?: boolean
          missed_habit_alerts?: boolean
          streak_milestones?: boolean
          ai_insights?: boolean
        }
      }
      analytics_cache: {
        Row: {
          id: string
          user_id: string
          date: string
          completion_rate: number
          total_focus_minutes: number
          current_streak: number
          cognitive_load_score: number
          intensity_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          date: string
          completion_rate?: number
          total_focus_minutes?: number
          current_streak?: number
          cognitive_load_score?: number
          intensity_score?: number
        }
        Update: {
          completion_rate?: number
          total_focus_minutes?: number
          current_streak?: number
          cognitive_load_score?: number
          intensity_score?: number
        }
      }
    }
  }
}