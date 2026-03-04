"use client"

import { useParams, useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { ChevronLeft, Mail } from "lucide-react"
import { FaWhatsapp, FaFacebook } from "react-icons/fa"
import { BsTwitterX } from "react-icons/bs"
import { toast } from "sonner"
import { InviteCollaborators } from "@/components/boards/InviteCollaborators"
import MoreActions, { PinsLayout } from "@/components/boards/MoreActions"
import { useEffect, useState } from "react"
import MobileHeaderStyle from "@/components/shared/headers/MobileHeaderStyle"
import BoardActions from "../popovers/boardDetailAction/DeleteAndEditBoard"
import ShareOptions from "@/components/boards/share/ShareOptions"
import SmartPinsGrid from "@/components/shared/grid/SmartPinsGrid"
import CustomButton from "@/components/shared/buttons/CustomButton"
import { AnimatePresence, motion } from "framer-motion"

export default function BoardDetailPage() {
  const params = useParams()
  const { id } = params
  const router = useRouter()

  const [layoutValue, setLayoutValue] = useState<PinsLayout>("standard")
  const [showBoardTitle, setShowBoardTitle] = useState(false)

  const { boards } = useSelector((state: RootState) => state.boards)
  const pins = useSelector((state: RootState) => state.pins.pins)

  const board = boards.find((b) => b.id === id)

  // ── Scroll listener ───────────────────────────────────────────────────────
  // Empty dep array: register once on mount, clean up on unmount.
  // Never put state values in the dep array of a scroll handler —
  // it re-registers the listener on every state change and leaks listeners.
  useEffect(() => {
    const handleScroll = () => setShowBoardTitle(window.scrollY > 0)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Email",
      icon: Mail,
      color: "bg-gray-500",
      href: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}`,
    },
  ]

  const animatedTitle = (
    <AnimatePresence initial={false}>
      {showBoardTitle && (
        <motion.span
          className="text-sm font-bold text-black"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {board.title}
        </motion.span>
      )}
    </AnimatePresence>
  )

  return (
    <>
      {/* Mobile header */}
      <MobileHeaderStyle
        animatedTitle={animatedTitle}
        headerRight={
          <div className="flex items-center justify-center gap-4">
            <ShareOptions />
            <BoardActions />
          </div>
        }
      />

      {/* Desktop */}
      <div className="px-3 md:px-5">
        <div className="flex flex-row items-center justify-between py-8 gap-6">
          <div className="flex items-start gap-4">
            <div className="hidden md:block">
              <CustomButton icon={<ChevronLeft />} onClick={() => router.back()} />
            </div>
            <div>
              <h1 className="text-2xl font-bold md:text-3xl tracking-tight max-w-2xl wrap-break-words">
                {board.title}
              </h1>
              <p className="font-medium text-xs md:text-md text-gray-600">
                {boardPins.length} {boardPins.length === 1 ? "pin" : "pins"}
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ShareOptions />
            <BoardActions />
          </div>
        </div>

        <div className="space-y-4 mb-10">
          <InviteCollaborators />
          <MoreActions
            layoutValue={layoutValue}
            setLayoutValue={() =>
              setLayoutValue(layoutValue === "standard" ? "compact" : "standard")
            }
          />
        </div>

        <SmartPinsGrid
          items={boardPins}
          variant="pin"
          layout={layoutValue}
          showMetadata={true}
          showStarIcon={true}
          profileValue={
            board.title.length > 10 ? board.title.slice(0, 8) + "..." : board.title
          }
        />
      </div>
    </>
  )
}