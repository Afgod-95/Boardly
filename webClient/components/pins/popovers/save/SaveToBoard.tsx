// components/pins/popovers/save/SaveToBoard.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PinItem } from "@/types/pin"
import { BoardItem } from "@/types/board"
import { Plus, FolderPlus } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

interface SaveToBoardProps {
  pin: PinItem
  boards: BoardItem[]
  onSave: (boardId: string) => void
  onCreateBoard?: (title: string) => void
  onClose?: () => void
  // Parent controls dialog open state so it lives outside the Popover DOM tree
  isCreateBoardOpen: boolean
  onCreateBoardOpenChange: (open: boolean) => void
}

const SaveToBoard = ({
  pin, boards, onSave, onCreateBoardOpenChange,
}: SaveToBoardProps) => {

  const boardExists = boards.some((b) => b.id === pin.boardId)
  const selectedBoard = pin.boardId && boardExists ? String(pin.boardId) : "profile"

  const handleSave = () => onSave(selectedBoard)


  return (
    <div className="max-w-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Save to Board</h2>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">Choose a board</label>
          <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <Select defaultValue={selectedBoard}>
              <SelectTrigger className="w-full rounded-xl px-4 py-3 h-auto text-sm sm:text-base">
                <SelectValue placeholder="Select a board" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="profile">Profile</SelectItem>
                {boards.map((board) => (
                  <SelectItem key={board.id} value={board.id}>{board.title}</SelectItem>
                ))}
                <SelectSeparator />
                <div className="p-1">
                  <button
                    onClick={() => onCreateBoardOpenChange(true)}
                    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground font-semibold text-violet-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Board
                  </button>
                </div>
              </SelectContent>
            </Select>
          </div>
        </div>

        {boards.length === 0 && (
          <div className="flex flex-col gap-4 p-4 bg-muted/30 rounded-xl border border-dashed border-muted-foreground/30">
            <div className="flex items-center gap-3">
              <FolderPlus className="text-muted-foreground" size={20} />
              <p className="text-xs text-muted-foreground leading-snug">
                You haven't created any boards yet. Create one to stay organized!
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCreateBoardOpenChange(true)}
              className="w-full rounded-lg border-dashed bg-transparent hover:bg-accent text-xs font-semibold"
            >
              <Plus className="mr-2 h-3 w-3" />
              Create your first board
            </Button>
          </div>
        )}

        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleSave() }}
            className="w-full rounded-full py-6 font-semibold bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-500/20"
          >
            Save Pin
          </Button>
        </motion.div>
      </div>
    </div>
  )
}


export default SaveToBoard