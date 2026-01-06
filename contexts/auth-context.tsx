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
  signupWithEmail: (email: string, password: string, displayName: string, role: string) => Promise<void>
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

  useEffect(() => {
    let mounted = true
    console.log("[AuthContext] Initializing...")

    const initializeAuth = async () => {
      try {
        // 1. Check Session (Fast)
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        console.log("[AuthContext] Session checked:", currentSession ? "Found" : "Null")
        
        if (mounted) {
          setSession(currentSession)
          setUser(currentSession?.user ?? null)
        }

        // 2. Fetch Profile (Background) - CRITICAL FIX: Removed 'await' so this doesn't block the UI
        if (currentSession?.user) {
          fetchUserProfile(currentSession.user.id)
        }
      } catch (error) {
        console.error("[AuthContext] Error initializing auth:", error)
      } finally {
        // 3. Unblock UI immediately
        if (mounted) {
          setLoading(false)
          console.log("[AuthContext] Loading state set to false (UI Unblocked)")
        }
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log(`[AuthContext] Auth Change: ${event}`)
      if (!mounted) return
      
      setSession(newSession)
      setUser(newSession?.user ?? null)

      if (newSession?.user) {
        // Fetch profile in background on auth change
        fetchUserProfile(newSession.user.id)
      } else {
        setUserProfile(null)
      }
      
      if (event === 'SIGNED_IN') {
        router.refresh()
      }
      if (event === 'SIGNED_OUT') {
        router.refresh()
        router.push('/')
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [router, supabase])

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("[AuthContext] Fetching user profile (Background)...")
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        // It's okay if this fails, we just won't show the name
        console.warn("[AuthContext] Profile fetch warning:", error.message)
      } else if (data) {
        console.log("[AuthContext] Profile loaded:", data)
        setUserProfile(data)
      }
    } catch (error) {
      console.error('[AuthContext] Exception fetching profile:', error)
    }
  }

  const loginWithEmail = async (email: string, password: string) => {
    try {
      console.log("[AuthContext] Login requested")
      const { error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      })

      if (error) throw error

      console.log("[AuthContext] Login success, redirecting...")
      window.location.href = "/dashboard"
      
    } catch (error: any) {
      console.error("[AuthContext] Login failed:", error)
      throw error
    }
  }

  const signupWithEmail = async (
    email: string,
    password: string,
    displayName: string,
    role: string
  ) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password,
          displayName,
          role,
        }),
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || 'Signup failed')
      }
      
      return await response.json()
    } catch (error: any) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUserProfile(null)
      setUser(null)
      setSession(null)
      window.location.href = "/login"
    } catch (error: any) {
      console.error("Logout error:", error)
      window.location.href = "/login"
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