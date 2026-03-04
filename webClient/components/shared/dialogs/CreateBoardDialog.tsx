"use client"
import { useState } from "react"
import { DialogContent, Dialog, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"


interface CreateBoardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateBoard: (title: string) => void
}

export const CreateBoardDialog = ({ open, onOpenChange, onCreateBoard }: CreateBoardDialogProps) => {
  const [title, setTitle] = useState("")

  const handleSubmit = () => {
    if (!title.trim()) return
    onCreateBoard(title.trim())
    setTitle("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Create new board</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Board Name</label>
            <input
              autoFocus
              placeholder='e.g., "Architecture" or "Summer Vibes"'
              className="flex h-12 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit() }}
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="rounded-full py-6 bg-violet-700 hover:bg-violet-800 font-semibold"
          >
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}