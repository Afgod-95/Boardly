"use client"

import React, { useState } from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import { PlusIcon, Search, Link as LinkIcon, Info, Check } from "lucide-react"
import { Dialog, DialogTrigger } from "../ui/dialog"
import { DialogScrollableContent } from "../dialogs/DialogsScrollableContent"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger, 
  TooltipProvider 
} from "@/components/ui/tooltip" // Using shadcn path; adjust if using @radix-ui directly
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

const SUGGESTED_USERS = [
  { id: 1, name: "Sarah Jenkins", username: "sarahj", image: "https://i.pravatar.cc/150?u=1" },
  { id: 2, name: "Marcus Chen", username: "mchen", image: "https://i.pravatar.cc/150?u=2" },
  { id: 3, name: "Elena Rodriguez", username: "elena_r", image: "https://i.pravatar.cc/150?u=3" },
]

export function InviteCollaborators() {
  const [searchQuery, setSearchQuery] = useState("")
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    const inviteLink = `${window.location.origin}/invite/board-xyz`
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    toast.success("Invite link copied!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Dialog>
        <Tooltip>
          {/* Nesting Logic: 
            TooltipTrigger wraps DialogTrigger. 
            Both use 'asChild' to target the same div. 
          */}
          <TooltipTrigger asChild>
            <DialogTrigger>
              <div className="flex items-center gap-2 cursor-pointer group outline-none">
                <AvatarGroup className="grayscale group-hover:grayscale-0 transition-all">
                  <Avatar className="border-2 border-background w-12 h-12">
                    <AvatarImage
                      src="https://github.com/evilrabbit.png"
                      alt="@evilrabbit"
                    />
                    <AvatarFallback>ER</AvatarFallback>
                  </Avatar>
                  <AvatarGroupCount className="bg-gray-100 text-gray-600 border-2 border-background w-12 h-12">
                    <PlusIcon size={16} />
                  </AvatarGroupCount>
                </AvatarGroup>
              </div>
            </DialogTrigger>
          </TooltipTrigger>
          
          <TooltipContent side="bottom" className="font-medium">
            Invite collaborators
          </TooltipContent>
        </Tooltip>

        <DialogScrollableContent dialogTitle="Invite collaborators">
          <div className="flex flex-col gap-6 py-2">
            
            {/* 1. SEARCH SECTION */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </div>
              <Input
                placeholder="Search by name or email"
                className="pl-10 h-12 rounded-full bg-gray-50 border-gray-200 focus-visible:ring-violet-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* 2. COPY LINK SECTION */}
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
                className="bg-gray-200 hover:bg-gray-300 text-sm font-bold py-2 px-4 rounded-full transition-colors active:scale-95"
              >
                {copied ? <Check size={18} className="text-green-600" /> : "Copy link"}
              </button>
            </div>

            {/* 3. PERMISSIONS INFO */}
            <div className="flex gap-3 p-4 rounded-2xl bg-violet-50 text-violet-900">
              <Info size={20} className="shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold">What collaborators can do</p>
                <p className="text-xs opacity-80 leading-relaxed">
                  Collaborators can add, move or delete Pins, and message the group. They cannot delete the board or change its settings.
                </p>
              </div>
            </div>

            {/* 4. SUGGESTED USERS LIST */}
            <div>
              <h4 className="text-sm font-bold mb-3 px-1">Suggested</h4>
              <div className="flex flex-col">
                {SUGGESTED_USERS.map((user) => (
                  <button
                    key={user.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.image} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="text-sm font-bold">{user.name}</p>
                        <p className="text-xs text-gray-500">@{user.username}</p>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 bg-violet-700 text-white text-xs font-bold py-2 px-4 rounded-full transition-all">
                      Invite
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </DialogScrollableContent>
      </Dialog>
    </TooltipProvider>
  )
}