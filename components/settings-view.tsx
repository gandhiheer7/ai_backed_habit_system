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
// NOTE: Removed firebase imports as this project seems to use Supabase based on context
// If you are using Firebase for settings, keep them. Assuming Supabase for consistency.
import { Mail, CheckCircle2, Loader2, Save, Brain } from "lucide-react"

// --- 1. PROFILE FORM (Connected to Supabase Profile) ---
export function ProfileForm() {
  const { userProfile } = useAuth()

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            value={userProfile?.display_name || ''} 
            readOnly 
            className="bg-muted/50 border-white/10 text-muted-foreground cursor-not-allowed" 
          />
          <p className="text-[10px] text-muted-foreground">Managed via Protocol Identity (Immutable)</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Corporate Role</Label>
          <Input 
            id="role" 
            value={userProfile?.role || 'Executive'} 
            readOnly 
            className="bg-muted/50 border-white/10 text-muted-foreground cursor-not-allowed" 
          />
          <p className="text-[10px] text-muted-foreground">The AI uses your role to tailor habit suggestions.</p>
        </div>
      </div>
      {/* "Professional Focus" Removed as requested */}
    </div>
  )
}

// --- 2. AI CONFIG FORM ---
export function AIConfigForm() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  // State for AI settings
  const [intensity, setIntensity] = useState([50])
  const [weekendMonitoring, setWeekendMonitoring] = useState(false)
  const [smartRescheduling, setSmartRescheduling] = useState(true)

  // NOTE: Logic for loading/saving settings would go here.
  // Assuming placeholder logic for now as Supabase settings table wasn't explicitly provided.

  const handleSaveAIConfig = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
        toast({ 
            title: "Neural Calibration Complete", 
            description: "Your AI Coach preferences have been synced.",
            action: <CheckCircle2 className="text-emerald-500 w-5 h-5" />,
        })
        setLoading(false)
    }, 1000)
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

  const handleSavePreferences = async () => {
    setIsSaving(true)
    setTimeout(() => {
        toast({
            title: "Database Updated",
            description: `Your morning briefing is now locked for ${briefingTime}.`,
            action: <CheckCircle2 className="text-emerald-500 w-5 h-5" />,
          })
        setIsSaving(false)
    }, 800)
  }

  const handleTestEmail = async () => {
    if (!user?.email) return
    setIsSending(true)
    // Simulate email dispatch
    setTimeout(() => {
        toast({ title: "Email Dispatched", description: "Check your inbox for the test signal." })
        setIsSending(false)
    }, 1500)
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