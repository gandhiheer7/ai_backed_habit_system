"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { SiteHeader } from "@/components/site-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { User, Brain, Bell, Loader2, Lock } from "lucide-react"

export default function SettingsPage() {
  const { user, userProfile, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // AI state
  const [intensity, setIntensity] = useState([50])
  const [weekendMonitoring, setWeekendMonitoring] = useState(false)
  const [smartRescheduling, setSmartRescheduling] = useState(true)

  // Notifications state
  const [briefingTime, setBriefingTime] = useState("08:00")
  const [deepWorkProtection, setDeepWorkProtection] = useState(true)

  // Loading state
  const [isSaving, setIsSaving] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Fetch user data on mount
  useEffect(() => {
    if (userProfile) {
      setIntensity([userProfile.ai_intensity || 50])
      setWeekendMonitoring(userProfile.weekend_monitoring || false)
      setSmartRescheduling(userProfile.smart_rescheduling ?? true)
      setBriefingTime(userProfile.briefing_time || "08:00")
      setDeepWorkProtection(userProfile.deep_work_protection ?? true)
    }
  }, [userProfile])

  const handleSaveAI = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ai_intensity: intensity[0],
          weekend_monitoring: weekendMonitoring,
          smart_rescheduling: smartRescheduling,
        }),
      })

      if (res.ok) {
        toast({ title: "AI Settings Updated", description: "Preferences synced." })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      toast({ title: "Save Failed", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveNotifications = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          briefing_time: briefingTime,
          deep_work_protection: deepWorkProtection,
        }),
      })

      if (res.ok) {
        toast({ title: "Notifications Updated", description: "Preferences synced." })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      toast({ title: "Save Failed", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading settings...</div>
  }

  // Fallback values to prevent "Loading..." flash if profile is missing
  const displayName = userProfile?.display_name || user?.user_metadata?.display_name || user?.email?.split('@')[0] || "User"
  const displayRole = userProfile?.role || "Executive"
  const displayEmail = user?.email || "No Email Linked"

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto space-y-8">
      <SiteHeader />

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">System Configuration</h1>
        <p className="text-muted-foreground">Manage your identity and calibrate the AI neuro-link.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
          <TabsTrigger value="profile" className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <User className="w-4 h-4" /> Identity
          </TabsTrigger>
          <TabsTrigger value="ai" className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Brain className="w-4 h-4" /> AI Coach
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Bell className="w-4 h-4" /> Notifications
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="glass-card p-6 rounded-2xl bg-primary/5 border-primary/20">
              <h3 className="font-semibold text-primary mb-2">Calibration Tips</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your User Identity is the foundation of the protocol. It is immutable to ensure consistent tracking data.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* --- PROFILE TAB (READ ONLY) --- */}
            <TabsContent value="profile" className="glass-card p-8 rounded-2xl mt-0 space-y-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">User Identity</h2>
                </div>
                <div className="p-2 bg-muted/20 rounded-full" title="Locked by System">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Name</Label>
                  <div className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground">
                    {displayName}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Email</Label>
                   <div className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground">
                    {displayEmail}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* --- AI COACH TAB --- */}
            <TabsContent value="ai" className="glass-card p-8 rounded-2xl mt-0 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Neural Calibration</h2>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/5">
                  <div>
                    <Label className="text-base">Coaching Intensity</Label>
                    <p className="text-xs text-muted-foreground">How direct should the AI be?</p>
                  </div>
                  <div className="w-[140px]">
                    <Slider value={intensity} onValueChange={setIntensity} max={100} step={1} />
                    <div className="text-center text-xs text-muted-foreground mt-2 font-mono">
                      {intensity[0]}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/5">
                  <div>
                    <Label className="text-base">Weekend Monitoring</Label>
                    <p className="text-xs text-muted-foreground">Track on weekends?</p>
                  </div>
                  <Switch checked={weekendMonitoring} onCheckedChange={setWeekendMonitoring} />
                </div>

                <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/5">
                  <div>
                    <Label className="text-base">Smart Rescheduling</Label>
                    <p className="text-xs text-muted-foreground">Auto-reschedule missed habits?</p>
                  </div>
                  <Switch checked={smartRescheduling} onCheckedChange={setSmartRescheduling} />
                </div>
              </div>

              <Button onClick={handleSaveAI} disabled={isSaving} className="w-full rounded-xl gap-2">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                Calibrate AI Assistant
              </Button>
            </TabsContent>

            {/* --- NOTIFICATIONS TAB --- */}
            <TabsContent value="notifications" className="glass-card p-8 rounded-2xl mt-0 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Alerts & Breaches</h2>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="briefing">Morning Briefing Time</Label>
                  <Input
                    id="briefing"
                    type="time"
                    value={briefingTime}
                    onChange={(e) => setBriefingTime(e.target.value)}
                    className="bg-white/5 border-white/10"
                  />
                  <p className="text-xs text-muted-foreground">When should we send your daily briefing?</p>
                </div>
                <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/5">
                  <div>
                    <Label className="text-base">Deep Work Protection</Label>
                    <p className="text-xs text-muted-foreground">No notifications during deep work?</p>
                  </div>
                  <Switch checked={deepWorkProtection} onCheckedChange={setDeepWorkProtection} />
                </div>
              </div>
              <Button onClick={handleSaveNotifications} disabled={isSaving} className="w-full rounded-xl gap-2">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
                Save Notification Settings
              </Button>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </main>
  )
}