"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { User, Session } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  userProfile: any
  session: Session | null
  loading: boolean
  loginWithEmail: (email: string, password: string) => Promise<void>
  signupWithEmail: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  // 1. Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession()

        setSession(currentSession)
        setUser(currentSession?.user ?? null)

        // If user exists, fetch their profile
        if (currentSession?.user) {
          await fetchUserProfile(currentSession.user.id)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // 2. Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)

      // Fetch profile when session changes
      if (newSession?.user) {
        await fetchUserProfile(newSession.user.id)
      } else {
        setUserProfile(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return
      }

      setUserProfile(data)
    } catch (error) {
      console.error('Exception fetching profile:', error)
    }
  }

  // 3. Login with email & password
  const loginWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      })

      if (error) throw error

      // Wait a moment for session to update
      await new Promise((resolve) => setTimeout(resolve, 500))
      router.push("/")
    } catch (error: any) {
      throw error
    }
  }

  // 4. Signup with email & password
  const signupWithEmail = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      // Call server-side signup API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password,
          displayName,
        }),
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error)
      }

      const data = await response.json()
      return data
    } catch (error: any) {
      throw error
    }
  }

  // 5. Logout
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // Clear local state
      setUserProfile(null)
      setUser(null)
      setSession(null)
      
      // Redirect to login
      router.push("/login")
    } catch (error: any) {
      console.error("Logout error:", error)
      // Even if there's an error, still redirect to login
      router.push("/login")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        session,
        loading,
        loginWithEmail,
        signupWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}