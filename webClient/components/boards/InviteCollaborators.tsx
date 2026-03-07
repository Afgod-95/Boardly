"use client"

import React, { useState, useMemo } from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import { PlusIcon, Search, Link as LinkIcon, Info, Check, Plus, UserMinus } from "lucide-react"
import { Dialog, DialogTrigger } from "../ui/dialog"
import { DialogScrollableContent } from "../shared/dialogs/DialogsScrollableContent"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { BoardItem } from "@/types/board"
import { motion, AnimatePresence } from "framer-motion"

// Keep in sync with EditBoardModal's ALL_USERS
const ALL_USERS = [
  { id: 1, name: "Alex Rivera", username: "alexr", image: "https://i.pravatar.cc/150?u=10" },
  { id: 2, name: "Sarah Chen", username: "sarahc", image: "https://i.pravatar.cc/150?u=11" },
  { id: 3, name: "James Okafor", username: "jameso", image: "https://i.pravatar.cc/150?u=12" },
  { id: 4, name: "Mia Tanaka", username: "miat", image: "https://i.pravatar.cc/150?u=13" },
  { id: 5, name: "Luca Moretti", username: "lucam", image: "https://i.pravatar.cc/150?u=14" },
  { id: 6, name: "Priya Sharma", username: "priyas", image: "https://i.pravatar.cc/150?u=15" },
]

export function InviteCollaborators({ board }: { board: BoardItem }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [copied, setCopied] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>(
    (board.collaboratorId as number[]) || []
  )

  const [showDialog, setShowDialog] = useState(false)
  const onClose = () => {
    setShowDialog(false)
  }

  const addedCollaborators = ALL_USERS.filter((u) => selectedIds.includes(u.id))

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return []
    return ALL_USERS.filter(
      (u) =>
        !selectedIds.includes(u.id) &&
        (u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q))
    )
  }, [searchQuery, selectedIds])

  // Suggested = not already added, show when not searching
  const suggested = ALL_USERS.filter((u) => !selectedIds.includes(u.id)).slice(0, 3)

  const addCollaborator = (id: number) => {
    setSelectedIds((prev) => [...prev, id])
    setSearchQuery("")
  }

  const removeCollaborator = (id: number) => {
    setSelectedIds((prev) => prev.filter((i) => i !== id))
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/invite/board-${board.id}`)
    setCopied(true)
    toast.success("Invite link copied!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    console.log("Updated collaborators:", selectedIds)
    onClose()
  }

  return (
    <>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
              <button className="flex items-center gap-2 cursor-pointer group outline-none"
                onClick={() => setShowDialog(true)}
              >
                <AvatarGroup className="grayscale group-hover:grayscale-0 transition-all">
                  {/* Show first added collaborator avatar, or fallback placeholder */}
                  {addedCollaborators.slice(0, 3).map((collaborator) => (
                    <>
                      <Avatar key={collaborator.name}
                        className="border-2 border-background rounded-full w-10 h-10 md:w-12 md:h-12">
                        <AvatarImage src={collaborator?.image} alt={collaborator.name} />
                        <AvatarFallback>{collaborator.name}</AvatarFallback>
                      </Avatar>
                    </>
                  ))}

                  <AvatarGroupCount className="bg-gray-100 text-gray-600 border-2 border-background rounded-full w-10 h-10 md:w-12 md:h-12">
                    <PlusIcon size={16} />
                  </AvatarGroupCount>
                </AvatarGroup>
              </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="font-medium">
            Invite collaborators
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={showDialog} onOpenChange={onClose}>
        <DialogScrollableContent
          dialogTitle="Invite collaborators"
          isActionButton
          buttonTitle="Save"
          onSubmit={handleSave}
        >
          <div className="flex flex-col gap-6 py-2 w-full">

            {/* 1. SEARCH */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <Input
                placeholder="Search by name or username"
                className="pl-10 h-12 rounded-full bg-gray-50 border-gray-200 focus-visible:ring-violet-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* 2. SEARCH RESULTS */}
            <AnimatePresence>
              {searchQuery.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="rounded-2xl border bg-background shadow-sm overflow-hidden -mt-2"
                >
                  {searchResults.length > 0 ? searchResults.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => addCollaborator(user.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 transition-colors text-left"
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback className="text-xs">{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground">@{user.username}</p>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center">
                        <Plus size={13} className="text-violet-600" />
                      </div>
                    </button>
                  )) : (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      No users found for "{searchQuery}"
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 3. CURRENT COLLABORATORS */}
            {addedCollaborators.length > 0 && (
              <div>
                <h4 className="text-sm font-bold mb-3 px-1 flex items-center gap-2">
                  Collaborators
                  <span className="text-xs font-normal text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                    {addedCollaborators.length}
                  </span>
                </h4>
                <div className="flex flex-col gap-1">
                  <AnimatePresence initial={false}>
                    {addedCollaborators.map((user) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center justify-between p-2 rounded-xl bg-violet-50/60 border border-violet-100">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.image} alt={user.name} />
                              <AvatarFallback className="text-xs bg-violet-100 text-violet-700">
                                {user.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-left">
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">@{user.username}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeCollaborator(user.id)}
                            className="w-7 h-7 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors group"
                            title="Remove collaborator"
                          >
                            <UserMinus size={14} className="text-muted-foreground group-hover:text-red-500 transition-colors" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* 4. COPY LINK */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <LinkIcon size={18} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Invite with a link</p>
                  <p className="text-xs text-gray-500">Anyone with the link can join</p>
                </div>
              </div>
              <button
                onClick={handleCopyLink}
                className="bg-gray-200 hover:bg-gray-300 text-xs font-bold py-2 px-4 rounded-full transition-colors active:scale-95"
              >
                {copied ? <Check size={18} className="text-green-600" /> : "Copy link"}
              </button>
            </div>

            {/* 5. PERMISSIONS INFO */}
            <div className="flex gap-3 p-4 rounded-2xl bg-violet-50 text-violet-900">
              <Info size={20} className="shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold">What collaborators can do</p>
                <p className="text-xs opacity-80 leading-relaxed">
                  Collaborators can add, move or delete Pins, and message the group. They cannot delete the board or change its settings.
                </p>
              </div>
            </div>

            {/* 6. SUGGESTED (only when not searching) */}
            {!searchQuery && suggested.length > 0 && (
              <div>
                <h4 className="text-sm font-bold mb-3 px-1">Suggested</h4>
                <div className="flex flex-col gap-1">
                  {suggested.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => addCollaborator(user.id)}
                      className="flex items-center justify-between p-2 rounded-xl border hover:bg-muted/50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.image} alt={user.name} />
                          <AvatarFallback className="text-xs">{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">@{user.username}</p>
                        </div>
                      </div>
                      <div className="p-1 rounded-full bg-muted">
                        <Plus size={14} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </DialogScrollableContent>
      </Dialog>
    </>

  )
}