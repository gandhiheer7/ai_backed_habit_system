"use client"

import { useState, useEffect } from "react"
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

export default function Dashboard() {
  // 1. Change static data to empty array & add loading state
  const [habits, setHabits] = useState<any[]>([]) 
  const [loading, setLoading] = useState(true)
  
  const [showMissedModal, setShowMissedModal] = useState(false)
  const [activeHabitId, setActiveHabitId] = useState<string | null>(null)

  // 2. Fetch Habits from Backend on Load
  useEffect(() => {
    fetch('/api/habits')
      .then(res => res.json())
      .then(data => {
        setHabits(data)
        setLoading(false)
      })
      .catch(err => console.error("Failed to load habits:", err))
  }, [])

  // 3. Handle Status (Complete/Missed)
  const handleStatusChange = async (id: string, status: "completed" | "missed") => {
    // Optimistic Update (Update UI instantly before server responds)
    setHabits(habits.map((h) => (h.id === id ? { ...h, status } : h)))

    if (status === "missed") {
      setActiveHabitId(id)
      setShowMissedModal(true)
    } else {
      // Send "Completed" to Backend
      try {
        await fetch('/api/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ habitId: id, status })
        })
      } catch (error) {
        console.error("Sync failed:", error)
      }
    }
  }

  // 4. Handle Adding New Habit
  const handleAddHabit = async (newHabit: any) => {
    try {
      // Send to Backend
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHabit)
      })
      const savedHabit = await res.json()
      
      // Update UI with the real saved habit (which has an ID from the DB)
      setHabits([...habits, savedHabit])
    } catch (error) {
      console.error("Failed to create habit:", error)
    }
  }

  // 5. Confirm "Missed" with Reason
  const confirmMissed = async (reason: string) => {
    // Optimistic Update
    setHabits(habits.map((h) => (h.id === activeHabitId ? { ...h, status: "missed" } : h)))
    setShowMissedModal(false)

    // Send "Missed" + Reason to Backend
    if (activeHabitId) {
      try {
        await fetch('/api/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ habitId: activeHabitId, status: "missed", reason })
        })
      } catch (error) {
        console.error("Sync failed:", error)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Loading Protocol...
      </div>
    )
  }

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto space-y-12">
      <SiteHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex justify-between items-end mb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1">Today's Protocol</h1>
                <p className="text-muted-foreground">Daily Executive Stack</p>
              </div>
              <AddHabitDialog onAdd={handleAddHabit} />
            </div>

            {/* Progress Bar */}
            <div className="mb-6 flex items-center justify-between bg-muted/20 p-4 rounded-xl">
               <span className="text-xs font-semibold text-primary uppercase tracking-widest">Session Progress</span>
               <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-1000"
                    style={{
                      width: `${habits.length > 0 ? (habits.filter((h) => h.status === "completed").length / habits.length) * 100 : 0}%`,
                    }}
                  />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {habits.map((habit) => (
                <HabitCard key={habit.id} {...habit} onStatusChange={handleStatusChange} />
              ))}
            </div>
          </section>

          <AICoach />
        </div>

        {/* Sidebar / Summary */}
        <aside className="space-y-6">
          <div className="glass-card p-8 rounded-2xl">
            <h3 className="text-lg font-semibold mb-6">Performance Summary</h3>

            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm text-muted-foreground">Consistency Score</span>
                  <span className="text-2xl font-bold">92%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full">
                  <div className="h-full bg-primary w-[92%] rounded-full" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Completed</p>
                  <p className="text-xl font-bold">142</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Peak Hours</p>
                  <p className="text-xl font-bold">6-9 AM</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Missed Habit Dialog */}
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
              (reason) => (
                <Button
                  key={reason}
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