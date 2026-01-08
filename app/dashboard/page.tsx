"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { HabitCard } from "@/components/habit-card"
import { AICoach } from "@/components/ai-coach"
import { SiteHeader } from "@/components/site-header"
import { AddHabitDialog } from "@/components/add-habit-dialog"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { DailyQuote } from "@/components/daily-quote"
import { FocusTimer } from "@/components/FocusTimer"
import { QuickProtocols } from "@/components/QuickProtocols"
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
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(0)
  
  const [dataLoading, setDataLoading] = useState(true)
  const [showMissedModal, setShowMissedModal] = useState(false)
  const [activeHabitId, setActiveHabitId] = useState<string | null>(null)

  // ✅ FIXED: Separate effect for checking auth
  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push("/login")
      return
    }
  }, [user, authLoading, router])

  // ✅ FIXED: Separate effect for fetching data (only runs when user is verified)
  useEffect(() => {
    if (authLoading || !user) return

    setDataLoading(true)

    const fetchHabits = fetch(`/api/habits`)
      .then(res => res.ok ? res.json() : [])
      .then(data => Array.isArray(data) ? data : [])
      .catch(() => [])

    const fetchStats = fetch(`/api/analytics`)
      .then(res => res.ok ? res.json() : null)
      .catch(() => null)

    Promise.all([fetchHabits, fetchStats])
      .then(([habitsData, statsData]) => {
        setHabits(habitsData || [])
        setStats(statsData || null)
      })
      .finally(() => {
        setDataLoading(false)
      })

  }, [user, authLoading])

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
        setHabits(previousHabits)
        toast({ variant: "destructive", title: "Sync Failed" })
      }
    }
  }

  const handleDeleteHabit = (id: string) => setHabits(habits.filter((h) => h.id !== id))
  
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
      if (!res.ok) throw new Error('Failed to create')
      const savedHabit = await res.json()
      setHabits([savedHabit, ...habits])
      toast({ title: "Success", description: "Habit initialized." })
    } catch (error) {
      toast({ variant: "destructive", title: "Error" })
    }
  }

  const handleProtocolInstalled = (habitCount: number) => {
    // Refetch habits to reflect protocol installation
    fetch(`/api/habits`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setHabits(Array.isArray(data) ? data : []))
      .catch(() => console.error("Failed to refresh habits"))
  }

  const handleSessionComplete = (minutes: number) => {
    setTotalFocusMinutes(prev => prev + minutes)
    toast({
      title: "Session Complete",
      description: `${minutes} minutes of deep work logged.`,
    })
  }

  const confirmMissed = async (reason: string) => {
    const previousHabits = [...habits]
    setShowMissedModal(false)
    if (activeHabitId) {
      try {
        await fetch('/api/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ habitId: activeHabitId, status: "missed", reason })
        })
      } catch (error) {
        setHabits(previousHabits.map(h => h.id === activeHabitId ? { ...h, status: 'pending' } : h))
      }
    }
  }

  if (authLoading || dataLoading) {
    return (
      <main className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto space-y-12">
        <SiteHeader />
        <DashboardSkeleton />
      </main>
    )
  }

  const completedCount = habits.filter((h) => h.status === "completed").length
  const progressPercentage = habits.length > 0 ? (completedCount / habits.length) * 100 : 0
  const displayName = userProfile?.display_name || user?.user_metadata?.display_name || "Executive"

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto space-y-12 relative">
      <SiteHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="mb-8">
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                Hi {displayName}! 👋
              </h1>
              <DailyQuote />
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
                <p className="text-muted-foreground">No habits initialized.</p>
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
          {/* Focus Timer Widget */}
          <FocusTimer onSessionComplete={handleSessionComplete} />

          {/* Performance Summary */}
          <div className="glass-card p-8 rounded-2xl space-y-6">
            <h3 className="text-lg font-semibold">Performance Summary</h3>
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

          {/* Protocol Library */}
          <QuickProtocols onProtocolInstalled={handleProtocolInstalled} />
        </aside>
      </div>

      <Dialog open={showMissedModal} onOpenChange={setShowMissedModal}>
        <DialogContent className="glass-card sm:max-w-md border-0 ring-1 ring-white/10">
          <DialogHeader>
            <DialogTitle>Analyze Exception</DialogTitle>
            <DialogDescription>Why was this habit missed?</DialogDescription>
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
            <Button variant="ghost" className="rounded-xl" onClick={() => setShowMissedModal(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}