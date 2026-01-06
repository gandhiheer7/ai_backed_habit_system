import { z } from 'zod'

// Habit validation
export const habitSchema = z.object({
  name: z.string().min(1, 'Habit name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  duration: z.string().regex(/^\d+\s*min$/, 'Invalid duration format'),
  category: z.string().max(50, 'Category too long').optional(),
  weight: z.number().min(1, 'Weight must be at least 1').max(10, 'Weight max 10').optional(),
})

// Check-in validation
export const checkinSchema = z.object({
  habitId: z.string().uuid('Invalid habit ID'),
  status: z.enum(['pending', 'completed', 'missed']),
  reason: z.string().max(200, 'Reason too long').optional(),
  notes: z.string().max(500, 'Notes too long').optional(),
})

// User profile validation
export const userProfileSchema = z.object({
  display_name: z.string().max(100, 'Name too long').optional(),
  role: z.string().max(100, 'Role too long').optional(),
  professional_focus: z.string().max(200, 'Focus too long').optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  ai_intensity: z.number().min(0).max(100).optional(),
  weekend_monitoring: z.boolean().optional(),
  smart_rescheduling: z.boolean().optional(),
  briefing_time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format').optional(),
  deep_work_protection: z.boolean().optional(),
})

// Auth validation
export const signupSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  displayName: z.string().min(1, 'Name is required').max(100, 'Name too long'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

// Type exports for TypeScript
export type HabitInput = z.infer<typeof habitSchema>
export type CheckinInput = z.infer<typeof checkinSchema>
export type UserProfileInput = z.infer<typeof userProfileSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>