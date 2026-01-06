"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { db } from "@/lib/firebase"
import { doc, updateDoc, getDoc } from "firebase/firestore"
import { Mail, CheckCircle2, Loader2, Save, Brain } from "lucide-react"

// --- 1. PROFILE FORM ---
export function ProfileForm() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="Marcus Chen" className="bg-white/5 border-white/10" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Corporate Role</Label>
          <Select defaultValue="director">
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="director">Managing Director</SelectItem>
              <SelectItem value="pm">Product Manager</SelectItem>
              <SelectItem value="eng">Senior Engineer</SelectItem>
              <SelectItem value="designer">Product Designer</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[10px] text-muted-foreground">The AI uses your role to tailor habit suggestions.</p>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Professional Focus</Label>
        <Input id="bio" placeholder="e.g. Scaling operations and team alignment" className="bg-white/5 border-white/10" />
      </div>
      <Button className="rounded-xl">Save Profile</Button>
    </div>
  )
}

// --- 2. AI CONFIG FORM (NOW CONNECTED TO CLOUD) ---
export function AIConfigForm() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  // State for AI settings
  const [intensity, setIntensity] = useState([50])
  const [weekendMonitoring, setWeekendMonitoring] = useState(false)
  const [smartRescheduling, setSmartRescheduling] = useState(true)

  // Load existing AI settings from Firestore
  useEffect(() => {
    async function loadAISettings() {
      if (user?.uid) {
        const userRef = doc(db, "users", user.uid)
        const userSnap = await getDoc(userRef)
        if (userSnap.exists()) {
          const data = userSnap.data()
          if (data.aiIntensity) setIntensity([data.aiIntensity])
          if (data.weekendMonitoring !== undefined) setWeekendMonitoring(data.weekendMonitoring)
          if (data.smartRescheduling !== undefined) setSmartRescheduling(data.smartRescheduling)
        }
      }
    }
    loadAISettings()
  }, [user])

  const handleSaveAIConfig = async () => {
    if (!user?.uid) return
    setLoading(true)
    try {
      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, {
        aiIntensity: intensity[0],
        weekendMonitoring,
        smartRescheduling,
        aiUpdated: new Date().toISOString()
      })
      toast({ 
        title: "Neural Calibration Complete", 
        description: "Your AI Coach preferences have been synced to the cloud.",
        action: <CheckCircle2 className="text-emerald-500" />,
      })
    } catch (error) {
      toast({ title: "Calibration Failed", description: "Could not sync AI settings.", variant: "destructive" })
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/5">
        <div className="space-y-0.5">
          <Label className="text-base">Coaching Intensity</Label>
          <p className="text-xs text-muted-foreground">Adjust how direct and firm the AI should be with your protocols.</p>
        </div>
        <div className="w-[140px] pt-4">
             <Slider 
                value={intensity} 
                onValueChange={setIntensity} 
                max={100} 
                step={1} 
                className="w-full" 
             />
             <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
                <span>Gentle</span>
                <span className="text-primary font-mono">{intensity[0]}%</span>
                <span>Ruthless</span>
             </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/5">
        <div className="space-y-0.5">
          <Label className="text-base">Weekend Monitoring</Label>
          <p className="text-xs text-muted-foreground">Allow AI to schedule and track protocols on Saturdays/Sundays.</p>
        </div>
        <Switch checked={weekendMonitoring} onCheckedChange={setWeekendMonitoring} />
      </div>

      <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/5">
        <div className="space-y-0.5">
          <Label className="text-base">Smart Rescheduling</Label>
          <p className="text-xs text-muted-foreground">Automatically move missed morning habits to optimized evening slots.</p>
        </div>
        <Switch checked={smartRescheduling} onCheckedChange={setSmartRescheduling} />
      </div>

      <Button onClick={handleSaveAIConfig} disabled={loading} className="w-full rounded-xl gap-2">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
        Calibrate AI Assistant
      </Button>
    </div>
  )
}

// --- 3. NOTIFICATIONS FORM ---
export function NotificationsForm() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isSending, setIsSending] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const [briefingTime, setBriefingTime] = useState("08:00")
  const [deepWorkProtection, setDeepWorkProtection] = useState(true)

  useEffect(() => {
    async function loadPrefs() {
      if (user?.uid) {
        const userRef = doc(db, "users", user.uid)
        const userSnap = await getDoc(userRef)
        if (userSnap.exists()) {
          const data = userSnap.data()
          if (data.briefingTime) setBriefingTime(data.briefingTime)
          if (data.deepWorkProtection !== undefined) setDeepWorkProtection(data.deepWorkProtection)
        }
      }
    }
    loadPrefs()
  }, [user])

  const handleSavePreferences = async () => {
    if (!user?.uid) return
    setIsSaving(true)
    try {
      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, {
        briefingTime: briefingTime,
        deepWorkProtection: deepWorkProtection,
        updatedAt: new Date().toISOString()
      })
      toast({
        title: "Database Updated",
        description: `Your morning briefing is now locked for ${briefingTime}.`,
        action: <CheckCircle2 className="text-emerald-500" />,
      })
    } catch (error) {
      toast({ title: "Save Failed", variant: "destructive" })
    } finally { setIsSaving(false) }
  }

  const handleTestEmail = async () => {
    if (!user?.email) return
    setIsSending(true)
    try {
      const response = await fetch("/api/notifications/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: user.email,
          subject: "AXON Protocol: Neural Link Verified",
          text: `Hello ${user.displayName || 'Executive'}, your email system is active.`,
          html: `<div style="font-family: sans-serif; padding: 20px;">
                  <h2 style="color: #0070f3;">AXON System Alert</h2>
                  <p>Neural link established at <strong>${briefingTime}</strong>.</p>
                 </div>`
        }),
      })
      if (response.ok) toast({ title: "Email Dispatched" })
    } catch (error) {
      toast({ title: "Dispatch Failed", variant: "destructive" })
    } finally { setIsSending(false) }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="p-4 border border-white/10 rounded-xl bg-white/5 space-y-4">
          <Label className="text-base">Email Delivery</Label>
          <Button onClick={handleTestEmail} disabled={isSending} variant="outline" className="w-full gap-2 rounded-xl">
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            Test Connection
          </Button>
        </div>
        <Separator className="bg-white/10" />
        <div className="flex items-center justify-between">
          <Label htmlFor="briefing">Briefing Time</Label>
          <Input id="briefing" type="time" value={briefingTime} onChange={(e) => setBriefingTime(e.target.value)} className="w-[120px] bg-white/5 border-white/10" />
        </div>
        <div className="flex items-center justify-between">
            <Label>Deep Work Protection</Label>
            <Switch checked={deepWorkProtection} onCheckedChange={setDeepWorkProtection} />
        </div>
      </div>
      <Button onClick={handleSavePreferences} disabled={isSaving} className="w-full rounded-xl gap-2">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save to Cloud Protocol
      </Button>
    </div>
  )
}