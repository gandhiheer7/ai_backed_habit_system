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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { User, Brain, Bell, Activity, Zap, Coffee, CheckCircle2, Loader2 } from "lucide-react"

export default function SettingsPage() {
  const { user, userProfile, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Profile state
  const [displayName, setDisplayName] = useState("")
  const [role, setRole] = useState("")
  const [focus, setFocus] = useState("")

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
      setDisplayName(userProfile.display_name || "")
      setRole(userProfile.role || "")
      setFocus(userProfile.professional_focus || "")
      setIntensity([userProfile.ai_intensity || 50])
      setWeekendMonitoring(userProfile.weekend_monitoring || false)
      setSmartRescheduling(userProfile.smart_rescheduling ?? true)
      setBriefingTime(userProfile.briefing_time || "08:00")
      setDeepWorkProtection(userProfile.deep_work_protection ?? true)
    }
  }, [userProfile])

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: displayName,
          role,
          professional_focus: focus,
        }),
      })

      if (res.ok) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been saved.",
          action: <CheckCircle2 className="text-emerald-500" />,
        })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Could not save your profile.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

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
        toast({
          title: "AI Settings Updated",
          description: "Your coaching preferences have been saved.",
          action: <CheckCircle2 className="text-emerald-500" />,
        })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Could not save your AI settings.",
        variant: "destructive",
      })
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
        toast({
          title: "Notifications Updated",
          description: "Your notification preferences have been saved.",
          action: <CheckCircle2 className="text-emerald-500" />,
        })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Could not save your notification settings.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const initials = displayName
    ? displayName.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : user?.email?.substring(0, 1).toUpperCase() || "U"

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Loading settings...
      </div>
    )
  }

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
            <User className="w-4 h-4" /> Profile
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
                The AI works best when it knows your role and focus areas.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                Cognitive Load Model
              </h3>
              <div className="space-y-4">
                <div className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Definition:</strong> A real-time metric tracking mental energy depletion based on task complexity and switching costs.
                </div>

                <div className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">The Formula</p>
                  <p className="text-xs font-mono text-primary">
                    Load = Σ(Time × Weight) + (Switching × 5)
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Task Weights</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3 h-3 text-amber-500" />
                      <span>Deep Work</span>
                    </div>
                    <span className="text-right font-mono opacity-50">10 pts</span>

                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3 text-blue-500" />
                      <span>Meetings</span>
                    </div>
                    <span className="text-right font-mono opacity-50">5 pts</span>

                    <div className="flex items-center gap-2">
                      <Coffee className="w-3 h-3 text-emerald-500" />
                      <span>Recovery</span>
                    </div>
                    <span className="text-right font-mono opacity-50">-5 pts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <TabsContent value="profile" className="glass-card p-8 rounded-2xl mt-0 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">User Identity</h2>
              </div>

              <div className="flex items-center gap-6 mb-6">
                <Avatar className="h-20 w-20 border-2 border-primary/20">
                  <AvatarImage src={user?.photoURL || ""} />
                  <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-lg">{user?.displayName || "User"}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name (From Signup)</Label>
                  <Input
                    id="name"
                    value={displayName}
                    readOnly
                    disabled
                    className="bg-muted/50 opacity-100 text-foreground cursor-default"
                    placeholder="Your signup name"
                  />
                  <p className="text-xs text-muted-foreground">This is your name from signup and cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Professional Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="director">Managing Director</SelectItem>
                      <SelectItem value="pm">Product Manager</SelectItem>
                      <SelectItem value="eng">Senior Engineer</SelectItem>
                      <SelectItem value="designer">Product Designer</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="focus">Professional Focus</Label>
                  <Input
                    id="focus"
                    value={focus}
                    onChange={(e) => setFocus(e.target.value)}
                    className="bg-white/5 border-white/10"
                    placeholder="e.g., Team leadership, Product strategy"
                  />
                </div>
              </div>

              <Button onClick={handleSaveProfile} disabled={isSaving} className="w-full rounded-xl gap-2">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Save Profile
              </Button>
            </TabsContent>

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