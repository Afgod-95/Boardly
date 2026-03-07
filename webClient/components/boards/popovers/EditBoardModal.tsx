"use client"

import React, { useRef, useState, useMemo } from "react"
import ModalRoot from "./ModalRoot"
import { Input } from "../../ui/input"
import { Textarea } from "../../ui/textarea"
import { Label } from "../../ui/label"
import { Avatar, AvatarFallback } from "../../ui/avatar"
import {
  Pencil, AlignLeft, Users, ImagePlus,
  Plus, Check, Upload, X, Search, UserMinus,
} from "lucide-react"
import { BoardItem } from "@/types/board"
import { PinItem } from "@/types/pin"
import Image from "next/image"
import { useDispatch, useSelector } from "react-redux"
import { RootState, AppDispatch } from "@/redux/store"
import { updateBoard } from "@/redux/boardSlice"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface EditBoardModalProps {
  isOpen: boolean
  onClose: () => void
  board: BoardItem
}

// Replace with your real users API when backend is ready
const ALL_USERS = [
  { id: 1, name: "Alex Rivera",  email: "alex@example.com",     initials: "AR" },
  { id: 2, name: "Sarah Chen",   email: "sarah.c@design.com",   initials: "SC" },
  { id: 3, name: "James Okafor", email: "james.o@studio.io",    initials: "JO" },
  { id: 4, name: "Mia Tanaka",   email: "mia.t@creative.co",    initials: "MT" },
  { id: 5, name: "Luca Moretti", email: "luca@designhub.com",   initials: "LM" },
  { id: 6, name: "Priya Sharma", email: "priya.s@pixels.dev",   initials: "PS" },
]

type CoverTab = "pins" | "upload"

const EditBoardModal = ({ isOpen, onClose, board }: EditBoardModalProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const allPins = useSelector((state: RootState) => state.pins.pins)

  const boardPins: PinItem[] = board.pinIds
    .map((id) => allPins.find((p) => String(p.id) === String(id)))
    .filter((p): p is PinItem => !!p)

  // ── Form ──────────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    title: board.title,
    description: board.description || "",
  })

  // ── Collaborators ─────────────────────────────────────────────────────────
  const [collaboratorIds, setCollaboratorIds] = useState<number[]>(
    (board.collaboratorId as number[]) || []
  )
  const [collaboratorSearch, setCollaboratorSearch] = useState("")

  const addedCollaborators = ALL_USERS.filter((u) => collaboratorIds.includes(u.id))

  const searchResults = useMemo(() => {
    const q = collaboratorSearch.trim().toLowerCase()
    if (!q) return []
    return ALL_USERS.filter(
      (u) =>
        !collaboratorIds.includes(u.id) &&
        (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
    )
  }, [collaboratorSearch, collaboratorIds])

  const addCollaborator = (id: number) => {
    setCollaboratorIds((prev) => [...prev, id])
    setCollaboratorSearch("")
  }

  const removeCollaborator = (id: number) => {
    setCollaboratorIds((prev) => prev.filter((i) => i !== id))
  }

  // ── Cover ─────────────────────────────────────────────────────────────────
  const [coverPinId, setCoverPinId] = useState<string | undefined>(board.coverPinId)
  const [uploadedCoverUrl, setUploadedCoverUrl] = useState<string | undefined>()
  const [coverTab, setCoverTab] = useState<CoverTab>("pins")
  const [showCoverPicker, setShowCoverPicker] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const displayCoverUrl =
    uploadedCoverUrl ?? boardPins.find((p) => String(p.id) === String(coverPinId))?.img

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadedCoverUrl(URL.createObjectURL(file))
    setCoverPinId(undefined)
    setShowCoverPicker(false)
  }

  const handleSelectPin = (pin: PinItem) => {
    setCoverPinId(String(pin.id))
    setUploadedCoverUrl(undefined)
    setShowCoverPicker(false)
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Board title is required")
      return
    }
    setIsLoading(true)
    try {
      await new Promise((res) => setTimeout(res, 600))
      dispatch(updateBoard({
        ...board,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        coverPinId,
        collaboratorId: collaboratorIds,
        updatedAt: new Date().toISOString(),
      }))
      toast.success("Board updated!")
      onClose()
    } catch {
      toast.error("Failed to update board")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ModalRoot
      isOpen={isOpen}
      onClose={onClose}
      className="p-0"
      dialogTitle="Edit board"
      isActionButton
      buttonTitle="Save changes"
      onSubmit={handleSave}
      isLoading={isLoading}
    >
      <div className="space-y-6 py-4">

        {/* ── Cover ── */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <ImagePlus size={16} /> Cover
          </Label>

          <div className="relative w-full h-36 rounded-2xl border bg-muted/30 overflow-hidden group">
            {displayCoverUrl ? (
              <>
                <Image src={displayCoverUrl} alt="Board cover" fill className="object-cover" sizes="100%" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button onClick={() => setShowCoverPicker(true)} className="bg-white/90 text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-white transition">Change</button>
                  <button onClick={() => { setCoverPinId(undefined); setUploadedCoverUrl(undefined) }} className="bg-white/90 text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-white transition">Remove</button>
                </div>
              </>
            ) : (
              <button onClick={() => setShowCoverPicker(true)} className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ImagePlus size={24} strokeWidth={1.5} />
                <span className="text-xs font-medium">Add a cover image</span>
              </button>
            )}
          </div>

          <AnimatePresence>
            {showCoverPicker && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden rounded-2xl border bg-muted/20"
              >
                <div className="p-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-1 bg-muted rounded-xl p-1">
                      {(["pins", "upload"] as CoverTab[]).map((tab) => (
                        <button key={tab} onClick={() => setCoverTab(tab)}
                          className={cn("px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors",
                            coverTab === tab ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                          )}>
                          {tab === "pins" ? "Board pins" : "Upload"}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setShowCoverPicker(false)} className="w-6 h-6 rounded-full hover:bg-muted flex items-center justify-center">
                      <X size={13} className="text-muted-foreground" />
                    </button>
                  </div>

                  {coverTab === "pins" && (
                    boardPins.length === 0
                      ? <p className="text-xs text-muted-foreground text-center py-6">No pins in this board yet.</p>
                      : <div className="grid grid-cols-4 gap-1.5">
                          {boardPins.map((pin) => {
                            const isSelected = String(pin.id) === String(coverPinId)
                            return (
                              <button key={pin.id} onClick={() => handleSelectPin(pin)}
                                className={cn("relative aspect-square rounded-xl overflow-hidden border-2 transition-all",
                                  isSelected ? "border-violet-500 scale-95" : "border-transparent hover:border-muted-foreground/40"
                                )}>
                                <Image src={pin.img} alt={pin.title} fill className="object-cover" sizes="80px" />
                                {isSelected && (
                                  <div className="absolute inset-0 bg-violet-500/20 flex items-center justify-center">
                                    <Check size={16} className="text-white drop-shadow" strokeWidth={2.5} />
                                  </div>
                                )}
                              </button>
                            )
                          })}
                        </div>
                  )}

                  {coverTab === "upload" && (
                    <>
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                      <button onClick={() => fileInputRef.current?.click()}
                        className="w-full h-24 rounded-xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 hover:border-violet-400 hover:bg-violet-50/30 transition-colors">
                        <Upload size={20} className="text-muted-foreground" strokeWidth={1.5} />
                        <span className="text-xs text-muted-foreground font-medium">Click to upload an image</span>
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Title ── */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Pencil size={16} /> Name
          </Label>
          <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="rounded-xl" disabled={isLoading} />
        </div>

        {/* ── Description ── */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <AlignLeft size={16} /> Description
          </Label>
          <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="rounded-xl resize-none min-h-20" disabled={isLoading} />
        </div>

        {/* ── Collaborators ── */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Users size={16} /> Collaborators
          </Label>

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by name or email…"
              value={collaboratorSearch}
              onChange={(e) => setCollaboratorSearch(e.target.value)}
              className="rounded-xl pl-9 h-10"
              disabled={isLoading}
            />
            {collaboratorSearch && (
              <button onClick={() => setCollaboratorSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={13} className="text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          {/* Search results */}
          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="rounded-2xl border bg-background shadow-md overflow-hidden"
              >
                {searchResults.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => addCollaborator(user.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 transition-colors text-left"
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="text-xs bg-violet-100 text-violet-700">{user.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                      <Plus size={13} className="text-violet-600" />
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            {collaboratorSearch.trim() && searchResults.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-xs text-muted-foreground px-1"
              >
                No users found for "{collaboratorSearch}"
              </motion.p>
            )}
          </AnimatePresence>

          {/* Added collaborators */}
          {addedCollaborators.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground/60 px-1">
                Added · {addedCollaborators.length}
              </p>
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
                    <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-muted/30 border border-transparent">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="text-xs bg-violet-100 text-violet-700">{user.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => removeCollaborator(user.id)}
                        disabled={isLoading}
                        className="w-7 h-7 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors group flex-shrink-0"
                        title="Remove collaborator"
                      >
                        <UserMinus size={14} className="text-muted-foreground group-hover:text-red-500 transition-colors" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {addedCollaborators.length === 0 && !collaboratorSearch && (
            <p className="text-xs text-muted-foreground px-1">
              Search for people to collaborate on this board.
            </p>
          )}
        </div>

      </div>
    </ModalRoot>
  )
}

export default EditBoardModal