"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, X, Clock, Trash2, Edit2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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

interface HabitCardProps {
  id: string
  name: string
  description: string
  duration: string
  status: "pending" | "completed" | "missed"
  streak: number
  onStatusChange: (id: string, status: "completed" | "missed") => void
  onDelete: (id: string) => void
  onEdit: (id: string, data: any) => void
}

export function HabitCard({
  id,
  name,
  description,
  duration,
  status,
  streak,
  onStatusChange,
  onDelete,
  onEdit,
}: HabitCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editName, setEditName] = useState(name)
  const [editDescription, setEditDescription] = useState(description)
  const [editDuration, setEditDuration] = useState(duration.replace(' min', ''))

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/habits/${id}`, { method: 'DELETE' })
      if (res.ok) {
        onDelete(id)
      }
    } catch (error) {
      console.error('Delete failed:', error)
    }
    setShowDeleteConfirm(false)
  }

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`/api/habits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          description: editDescription,
          duration: `${editDuration} min`,
        }),
      })
      if (res.ok) {
        const updated = await res.json()
        onEdit(id, updated)
        setShowEditDialog(false)
      }
    } catch (error) {
      console.error('Edit failed:', error)
    }
  }

  return (
    <>
      <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-full transition-all hover:translate-y-[-2px]">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-medium tracking-tight text-foreground/90">{name}</h3>
              {streak > 0 && (
                <p className="text-xs text-emerald-500 font-semibold mt-1">🔥 {streak} day streak</p>
              )}
            </div>
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap ml-2",
                status === "completed" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                status === "missed" && "bg-rose-500/10 text-rose-600 dark:text-rose-400",
                status === "pending" && "bg-blue-500/10 text-blue-600 dark:text-blue-400",
              )}
            >
              {status}
            </span>
          </div>

          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>
          )}

          <div className="flex items-center text-xs text-muted-foreground mb-6">
            <Clock className="w-3 h-3 mr-1.5" />
            {duration}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Button
              variant={status === "completed" ? "default" : "outline"}
              className="flex-1 rounded-xl h-10 text-sm font-medium"
              onClick={() => onStatusChange(id, "completed")}
              disabled={status === "completed"}
            >
              <Check className="w-4 h-4 mr-2" />
              Complete
            </Button>
            <Button
              variant="ghost"
              className="rounded-xl h-10 w-10 p-0 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
              onClick={() => onStatusChange(id, "missed")}
              disabled={status === "missed"}
              title="Mark as missed"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="flex-1 rounded-xl h-9 text-xs gap-1 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10"
              onClick={() => setShowEditDialog(true)}
              title="Edit habit"
            >
              <Edit2 className="w-3 h-3" />
              Edit
            </Button>
            <Button
              variant="ghost"
              className="flex-1 rounded-xl h-9 text-xs gap-1 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
              onClick={() => setShowDeleteConfirm(true)}
              title="Delete habit"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="glass-card sm:max-w-md border-0 ring-1 ring-white/10">
          <DialogHeader>
            <DialogTitle>Delete Habit?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteConfirm(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="rounded-xl"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="glass-card sm:max-w-[425px] border-white/10">
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
            <DialogDescription>Update your habit details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Habit Name</Label>
              <Input
                id="edit-name"
                className="glass-card bg-white/5 border-white/10"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                className="glass-card bg-white/5 border-white/10"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-duration">Duration (Minutes)</Label>
              <Select value={editDuration} onValueChange={setEditDuration}>
                <SelectTrigger className="glass-card bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 min (Micro)</SelectItem>
                  <SelectItem value="15">15 min (Standard)</SelectItem>
                  <SelectItem value="45">45 min (Deep)</SelectItem>
                  <SelectItem value="90">90 min (Flow)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowEditDialog(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="rounded-xl">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}