"use client"

import { useParams } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import PinCard from "@/components/pins/card/PinCard"
import usePinsHook from "@/hooks/usePinsHook"
import { Upload, MoreHorizontal, Link as LinkIcon, Mail, Share, Share2 } from "lucide-react"
import { FaWhatsapp, FaFacebook, } from "react-icons/fa"
import { BsTwitterX } from "react-icons/bs";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { Popover } from "@/components/ui/popover"
import { toast } from "sonner"
import Link from "next/link"
import { InviteCollaborators } from "@/components/boards/InviteCollaborators"
import MoreActions, { PinsLayout } from "@/components/boards/MoreActions"
import BackButton from "@/components/buttons/BackButton"
import PinsGrid from "@/components/pins/grid/PinsGrid"
import { useState } from "react"
import MobileHeaderStyle from "@/components/headers/MobileHeaderStyle"
import BoardActions from "../boardDetail/BoardActions"
import ShareOptions from "@/components/share/ShareOptions"

export default function BoardDetailPage() {
  const params = useParams()
  const { id } = params

  //layout value 
  const [layoutValue, setLayoutValue] = useState<PinsLayout>('standard')

  const { boards } = useSelector((state: RootState) => state.boards)
  const pins = useSelector((state: RootState) => state.pins.pins)

  const board = boards.find((b) => b.id === id)

  if (!board) return <p className="text-center mt-20 text-gray-500">Board not found</p>

  const boardPins = board.pinIds
    .map((pinId) => pins.find((p) => p.id === pinId))
    .filter((p): p is typeof pins[number] => !!p)

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""
  const shareTitle = `Check out my board: ${board.title}`

  const copyToClipboard = (text: string = shareUrl) => {
    navigator.clipboard.writeText(text)
    toast.success("Link copied to clipboard!")
  }

  const socialLinks = [
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      color: "bg-[#25D366]",
      href: `https://wa.me/?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`,
    },
    {
      name: "Facebook",
      icon: FaFacebook,
      color: "bg-[#1877F2]",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "X",
      icon: BsTwitterX,
      color: "bg-[#1DA1F2]",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareTitle
      )}&url=${encodeURIComponent(shareUrl)}`,
    },
    { name: "Email", icon: Mail, color: "bg-gray-500", href: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}` },
  ]

  return (
    <>
    {/** MOBILE SCREEN */}
      <div className="block md:hidden">
        <MobileHeaderStyle 
          headerRight = {
            <div className="flex items-center justify-center gap-4">
                <ShareOptions />
                <BoardActions />
            </div>
          }
        />
      </div>
      {/** desktop */}
      <div className=" hidden md:block">
         <BackButton />
      </div>
     
      <div className="flex flex-row items-center justify-between py-8 gap-6">
        <div className=" flex items-start gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold md:text-3xl tracking-tight max-w-2xl wrap-break-words">
              {board.title}
            </h1>
            <p className="font-medium text-lg text-gray-600">
              {boardPins.length} {boardPins.length === 1 ? "pin" : "pins"}
            </p>
          </div>

        </div>

        {/* ACTION BUTTONS */}
        <div className="hidden md:flex items-center gap-3">
          {/* ---------------- SHARE BUTTON ---------------- */}
          <ShareOptions />
          {/* ---------------- MORE BUTTON ---------------- */}
          <BoardActions />
        </div>
      </div>

      {/** more actions like organize etc */}
      <div className="space-y-4 mb-10">
        <InviteCollaborators />
        <MoreActions 
          layoutValue= { layoutValue }
          setLayoutValue={() => setLayoutValue(layoutValue === 'standard' ? 'compact' : 'standard')}
        />
      </div>

      {/* PIN GRID */}
      <PinsGrid
        items={boardPins}
        variant = 'pin'
        layout= {layoutValue}
        showMetadata = {true}
        showStarIcon = {true}
        profileValue={board.title.length > 10 ? board.title.slice(0, 8) + '...' : board.title}
        actions={{
          
        }}
      />
      
    </>
  )
}
