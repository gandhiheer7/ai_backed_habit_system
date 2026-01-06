"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const { user, userProfile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (user && userProfile) {
      // User is logged in with profile loaded, go to dashboard
      router.push("/dashboard")
    } else if (user && !loading) {
      // User logged in but profile still loading, wait a bit then redirect
      const timer = setTimeout(() => {
        router.push("/dashboard")
      }, 500)
      return () => clearTimeout(timer)
    } else {
      // User is not logged in, go to login
      router.push("/login")
    }
  }, [user, userProfile, loading, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
      <p>Redirecting...</p>
    </div>
  )
}