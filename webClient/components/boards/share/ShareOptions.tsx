"use client"

import { useParams } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import {  Link as LinkIcon, Mail, Share, Share2 } from "lucide-react"
import { FaWhatsapp, FaFacebook, } from "react-icons/fa"
import { BsTwitterX } from "react-icons/bs";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { Popover } from "@/components/ui/popover"
import { toast } from "sonner"
import Link from "next/link"
import { InviteCollaborators } from "@/components/boards/InviteCollaborators"
import MoreActions, { PinsLayout } from "@/components/boards/MoreActions"
import PinsGrid from "@/components/pins/grid/PinsGrid"
import { useState } from "react"
import MobileHeaderStyle from "@/components/shared/headers/MobileHeaderStyle"

export default function ShareOptions() {
  const params = useParams()
  const { id } = params

  const { boards } = useSelector((state: RootState) => state.boards)
  const pins = useSelector((state: RootState) => state.pins.pins)

  const board = boards.find((b) => b.id === id)

  if (!board) return <p className="text-center mt-20 text-gray-500">Board not found</p>

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


      {/* ACTION BUTTONS */}
      <div className="flex items-center gap-3">
        {/* ---------------- SHARE BUTTON ---------------- */}
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center justify-center gap-2 md:bg-gray-100 md:hover:bg-gray-200 md:p-4 nd:px-8 rounded-full transition-all active:scale-95 font-semibold">
              <Share2 size={22} strokeWidth={2.5} />
              <div className="hidden md:block">Share</div>
            </div>
          </PopoverTrigger>

          <PopoverContent
            side="bottom"
            align="center"
            className="z-50 w-96 p-0 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mt-2"
          >
            <div className="p-6 space-y-6">
              <h3 className="text-2xl text-center text-muted-foreground">Share Board</h3>

              {/* Social Grid */}
              <div className="grid grid-cols-4 gap-6">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div
                      className={`w-14 h-14 ${social.color} text-white rounded-full flex items-center justify-center transition-transform group-hover:scale-110`}
                    >
                      <social.icon size={24} />
                    </div>
                    <span className="text-sm font-medium text-gray-600">{social.name}</span>
                  </Link>
                ))}
              </div>

              {/* Copy Link Button */}
              <button
                onClick={() => copyToClipboard()}
                className="w-full flex items-center border gap-3 p-4 hover:bg-gray-50 rounded-xl transition-colors font-semibold text-gray-800"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <LinkIcon size={22} />
                </div>
                Copy link
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

    </>
  )
}
