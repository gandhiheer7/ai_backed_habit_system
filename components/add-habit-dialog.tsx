"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function AddHabitDialog({ onAdd }: { onAdd: (habit: any) => void }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [duration, setDuration] = useState("15")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      name,
      duration: `${duration} min`,
      description: "User defined protocol",
      status: "pending"
    })
    setOpen(false)
    setName("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl gap-2 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" />
          Add Protocol
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card sm:max-w-[425px] border-white/10">
        <DialogHeader>
          <DialogTitle>New Protocol</DialogTitle>
          <DialogDescription>
            Define a new habit loop to integrate into your daily executive system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input
              id="name"
              placeholder="e.g. Deep Reading"
              className="glass-card bg-white/5 border-white/10"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="duration">Duration (Minutes)</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="glass-card bg-white/5 border-white/10">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 min (Micro)</SelectItem>
                <SelectItem value="15">15 min (Standard)</SelectItem>
                <SelectItem value="45">45 min (Deep)</SelectItem>
                <SelectItem value="90">90 min (Flow)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit">Initialize Habit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}