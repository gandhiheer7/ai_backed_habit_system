"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { HabitCard } from "@/components/habit-card"
import { AICoach } from "@/components/ai-coach"
import { SiteHeader } from "@/components/site-header"
import { AddHabitDialog } from "@/components/add-habit-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export default function Dashboard() {
  const { user, userProfile, loading: authLoading } = useAuth()
  const router = useRouter()

  const [habits, setHabits] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  
  // Dashboard-specific loading state
  const [dataLoading, setDataLoading] = useState(true)

  const [showMissedModal, setShowMissedModal] = useState(false)
  const [activeHabitId, setActiveHabitId] = useState<string | null>(null)

  // 1. Safe Data Fetching Logic
  useEffect(() => {
    // If auth is still loading, do nothing yet
    if (authLoading) return

    // If auth finished but no user, force redirect (backup to middleware)
    if (!user) {
      console.log("[Dashboard] No user found after auth load, redirecting...")
      router.push("/login")
      return
    }

    console.log("[Dashboard] User authenticated, fetching protocol data...")
    setDataLoading(true)

    const fetchHabits = fetch(`/api/habits`)
      .then(async res => {
        if (!res.ok) throw new Error(`API Error: ${res.status}`)
        return res.json()
      })
      .then(data => {
        console.log("[Dashboard] Habits loaded:", data.length)
        return Array.isArray(data) ? data : []
      })
      .catch(err => {
        console.error("[Dashboard] Failed to load habits:", err)
        toast({ variant: "destructive", title: "Connection Error", description: "Could not load habits." })
        return []
      })

    const fetchStats = fetch(`/api/analytics`)
      .then(async res => {
        if (!res.ok) throw new Error(`API Error: ${res.status}`)
        return res.json()
      })
      .then(data => {
        console.log("[Dashboard] Analytics loaded")
        return data
      })
      .catch(err => {
        console.error("[Dashboard] Failed to load analytics:", err)
        return null
      })

    // Execute both
    Promise.all([fetchHabits, fetchStats])
      .then(([habitsData, statsData]) => {
        setHabits(habitsData || [])
        setStats(statsData || null)
      })
      .finally(() => {
        console.log("[Dashboard] Loading sequence complete")
        setDataLoading(false)
      })

  }, [user, authLoading, router])

  // 2. Optimistic UI Updates
  const handleStatusChange = async (id: string, status: "completed" | "missed") => {
    const previousHabits = [...habits]
    setHabits(habits.map((h) => (h.id === id ? { ...h, status } : h)))

    if (status === "missed") {
      setActiveHabitId(id)
      setShowMissedModal(true)
    } else {
      try {
        const res = await fetch('/api/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ habitId: id, status })
        })

        if (!res.ok) throw new Error('Failed to check in')

      } catch (error) {
        console.error("Sync failed:", error)
        setHabits(previousHabits)
        toast({ 
          variant: "destructive", 
          title: "Sync Failed", 
          description: "Could not save your progress. Please try again." 
        })
      }
    }
  }

  const handleDeleteHabit = (id: string) => {
    setHabits(habits.filter((h) => h.id !== id))
  }

  const handleEditHabit = (id: string, updatedData: any) => {
    setHabits(habits.map((h) => (h.id === id ? { ...h, ...updatedData } : h)))
  }

  const handleAddHabit = async (newHabit: any) => {
    if (!user) return
    try {
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHabit)
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to create habit')
      }

      const savedHabit = await res.json()
      setHabits([savedHabit, ...habits])
      toast({ title: "Success", description: "Protocol initialized." })
    } catch (error: any) {
      console.error("Failed to create habit:", error)
      toast({ variant: "destructive", title: "Error", description: error.message })
    }
  }

  const confirmMissed = async (reason: string) => {
    const previousHabits = [...habits]
    setShowMissedModal(false)

    if (activeHabitId) {
      try {
        const res = await fetch('/api/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            habitId: activeHabitId,
            status: "missed",
            reason
          })
        })

        if (!res.ok) throw new Error('Failed to record missed habit')

      } catch (error) {
        console.error("Sync failed:", error)
        setHabits(previousHabits.map(h => h.id === activeHabitId ? { ...h, status: 'pending' } : h))
         toast({ 
          variant: "destructive", 
          title: "Sync Failed", 
          description: "Could not save reason. Please try again." 
        })
      }
    }
  }

  // RENDER LOADING STATE
  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="animate-pulse">
            {authLoading ? "Authenticating Neural Link..." : "Loading Protocol Data..."}
          </p>
        </div>
      </div>
    )
  }

  // CALCULATIONS
  const completedCount = habits.filter((h) => h.status === "completed").length
  const progressPercentage = habits.length > 0 ? (completedCount / habits.length) * 100 : 0

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto space-y-12">
      <SiteHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="mb-8">
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                Hi, {userProfile?.display_name || "Executive"}! 👋
              </h1>
              <p className="text-lg text-muted-foreground italic">
                "The secret of getting ahead is getting started." - Mark Twain
              </p>
            </div>

            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight mb-1">Today's Protocol</h2>
                <p className="text-muted-foreground">Daily Executive Stack</p>
              </div>
              <AddHabitDialog onAdd={handleAddHabit} />
            </div>

            <div className="mb-6 flex items-center justify-between bg-muted/20 p-4 rounded-xl">
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">Session Progress</span>
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-1000"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {habits.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-white/5">
                <p className="text-muted-foreground">No habits initialized. Start your protocol.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    {...habit}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteHabit}
                    onEdit={handleEditHabit}
                  />
                ))}
              </div>
            )}
          </section>

          <AICoach />
        </div>

        <aside className="space-y-6">
          <div className="glass-card p-8 rounded-2xl">
            <h3 className="text-lg font-semibold mb-6">Performance Summary</h3>

            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm text-muted-foreground">Completion Rate</span>
                  <span className="text-2xl font-bold">{stats?.completionRate || 0}%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-1000"
                    style={{ width: `${stats?.completionRate || 0}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Total Focus</p>
                  <p className="text-xl font-bold">
                    {stats?.totalFocusMinutes ? Math.round(stats.totalFocusMinutes / 60 * 10) / 10 : 0}h
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Cognitive Load</p>
                  <p className="text-xl font-bold">{stats?.cognitiveLoadScore || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <Dialog open={showMissedModal} onOpenChange={setShowMissedModal}>
        <DialogContent className="glass-card sm:max-w-md border-0 ring-1 ring-white/10">
          <DialogHeader>
            <DialogTitle>Analyze Exception</DialogTitle>
            <DialogDescription>
              Identifying the friction point helps the AI refine your protocol. Why was this habit missed?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {["Meeting Overrun", "Low Energy Level", "Environmental Friction", "Higher Priority Emerged"].map(
              (reason, index) => (
                <Button
                  key={`missed-reason-${index}`}
                  variant="outline"
                  className="justify-start h-12 rounded-xl border-border/50 hover:bg-primary/5 hover:border-primary/50 text-left px-4 bg-transparent"
                  onClick={() => confirmMissed(reason)}
                >
                  {reason}
                </Button>
              ),
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" className="rounded-xl" onClick={() => setShowMissedModal(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}