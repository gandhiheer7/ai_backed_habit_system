export type HabitStatus = "pending" | "completed" | "missed"

export interface Habit {
  id: string
  userId: string
  name: string
  description: string
  duration: string
  status: HabitStatus
  streak: number
  category?: string // e.g., "Deep Work", "Health"
  weight?: number // For cognitive load (1-10)
  createdAt: string
}

export interface CheckIn {
  id: string
  habitId: string
  userId: string
  status: HabitStatus
  date: string // ISO Date YYYY-MM-DD
  timestamp: string
  notes?: string
}

export interface UserProfile {
  id: string
  name: string
  role: string // e.g., "Product Manager"
  focus: string
  coachingIntensity: number
  theme: "light" | "dark" | "system"
}

// Analytics response shape
export interface AnalyticsData {
  intensityData: { day: string; intensity: number; focus: number }[]
  completionRate: number
  totalFocusMinutes: number
  currentStreak: number
  cognitiveLoadScore: number
}