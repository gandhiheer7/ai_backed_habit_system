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

    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        
        if (mounted) {
          setSession(currentSession)
          setUser(currentSession?.user ?? null)
        }

        if (currentSession?.user) {
          // Fetch profile without blocking
          fetchUserProfile(currentSession.user.id)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return
      
      setSession(newSession)
      setUser(newSession?.user ?? null)

      if (newSession?.user) {
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
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.warn('Profile fetch warning:', error.message)
      } else if (data) {
        setUserProfile(data)
      }
    } catch (error) {
      console.error('Exception fetching profile:', error)
    }
  }

  const loginWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      })

      if (error) throw error

      window.location.href = "/dashboard"
      
    } catch (error: any) {
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