"use client"

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
import { Brain, Bell, User, Shield } from "lucide-react"

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

export function AIConfigForm() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/5">
        <div className="space-y-0.5">
          <Label className="text-base">Coaching Intensity</Label>
          <p className="text-xs text-muted-foreground">How aggressively should the AI follow up on missed habits?</p>
        </div>
        <div className="w-[140px] pt-4">
             {/* Note: Slider component usually requires an array value */}
             <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
             <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
                <span>Gentle</span>
                <span>Ruthless</span>
             </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/5">
        <div className="space-y-0.5">
          <Label className="text-base">Weekend Monitoring</Label>
          <p className="text-xs text-muted-foreground">Allow AI to schedule protocols on Saturdays/Sundays.</p>
        </div>
        <Switch />
      </div>

      <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/5">
        <div className="space-y-0.5">
          <Label className="text-base">Smart Rescheduling</Label>
          <p className="text-xs text-muted-foreground">Automatically move missed morning habits to evening slots.</p>
        </div>
        <Switch defaultChecked />
      </div>
    </div>
  )
}

export function NotificationsForm() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="briefing">Morning Briefing Time</Label>
          <Input id="briefing" type="time" defaultValue="08:00" className="w-[120px] bg-white/5 border-white/10" />
        </div>
        <Separator className="bg-white/10" />
        <div className="flex items-center justify-between">
            <div className="space-y-0.5">
                <Label>Deep Work Protection</Label>
                <p className="text-xs text-muted-foreground">Silence all pings during scheduled "Deep Work" blocks.</p>
            </div>
            <Switch defaultChecked />
        </div>
      </div>
    </div>
  )
}