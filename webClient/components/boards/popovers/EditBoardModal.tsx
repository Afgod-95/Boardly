"use client"

import React, { useState } from "react"
import ModalRoot from "./ModalRoot"
import { DialogScrollableContent } from "../../shared/dialogs/DialogsScrollableContent"
import { Input } from "../../ui/input"
import { Textarea } from "../../ui/textarea"
import { Label } from "../../ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { Button } from "../../ui/button"
import {
  Pencil,
  AlignLeft,
  Users,
  ImagePlus,
  Plus,
  Check,
} from "lucide-react"
import { BoardItem } from "@/types/board"
import Image from "next/image"

interface EditBoardModalProps {
  isOpen: boolean
  onClose: () => void
  board: BoardItem
}

const SUGGESTIONS = [
  { id: 1, name: "Alex Rivera", email: "alex@example.com", initials: "AR" },
  { id: 2, name: "Sarah Chen", email: "sarah.c@design.com", initials: "SC" },
]

const EditBoardModal = ({
  isOpen,
  onClose,
  board,
}: EditBoardModalProps) => {
  const [formData, setFormData] = useState({
    title: board.title,
    description: board.description || "",
  })

  const [selectedIds, setSelectedIds] = useState<number[]>(
    (board.collaboratorId as number[]) || []
  )

  const toggleCollaborator = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleSave = () => {
    console.log("Updated board:", {
      ...formData,
      collaborators: selectedIds,
    })
    onClose()
  }

  return (
    <ModalRoot isOpen={isOpen} onClose={onClose}
      className="p-0"
      dialogTitle="Edit board"
      isActionButton
      buttonTitle="Save changes"
      onSubmit={handleSave}
    >
      <div className="space-y-6 py-4">

        {/* Cover Image */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <ImagePlus size={16} />
            Cover
          </Label>

          <button className="relative w-full h-35 rounded-2xl border bg-muted/30 overflow-hidden group">
            {board.coverPinId ? (
              <Image
                src={board.coverPinId}
                alt="Board cover"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
                No cover selected
              </div>
            )}

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                Change cover
              </span>
            </div>
          </button>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Pencil size={16} />
            Name
          </Label>
          <Input
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="rounded-xl"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <AlignLeft size={16} />
            Description
          </Label>
          <Textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="rounded-xl resize-none min-h-20]"
          />
        </div>

        {/* Collaborators */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Users size={16} />
            Collaborators
          </Label>

          <div className="grid gap-2">
            {SUGGESTIONS.map((user) => {
              const isSelected = selectedIds.includes(user.id)
              return (
                <button
                  key={user.id}
                  onClick={() => toggleCollaborator(user.id)}
                  className={`flex items-center justify-between p-2 rounded-xl border transition ${isSelected
                    ? "bg-accent/10 border-accent"
                    : "hover:bg-muted/50"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`p-1 rounded-full ${isSelected
                      ? "bg-violet-600 text-white"
                      : "bg-muted"
                      }`}
                  >
                    {isSelected ? <Check size={14} /> : <Plus size={14} />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </ModalRoot>
  )
}

export default EditBoardModal
