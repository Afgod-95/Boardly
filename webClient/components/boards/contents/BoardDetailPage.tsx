"use client"

import { useParams, useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { ChevronLeft, Mail, ImagePlus, Sparkles } from "lucide-react"
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

      <div className="px-3 md:px-5">
        {/* Board header — always visible */}
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
          <InviteCollaborators
            board={board}
          />
          <MoreActions
            layoutValue={layoutValue}
            setLayoutValue={() =>
              setLayoutValue(layoutValue === "standard" ? "compact" : "standard")
            }
          />
        </div>

        {/* ── Empty state: this board has no pins yet ── */}
        {boardPins.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center justify-center text-center px-6 py-20 rounded-3xl bg-gradient-to-b from-muted/40 to-transparent"
          >
            {/* Icon */}
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center shadow-inner">
                <ImagePlus size={30} className="text-muted-foreground/50" strokeWidth={1.5} />
              </div>
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-background shadow-md flex items-center justify-center border border-border"
              >
                <Sparkles size={14} className="text-amber-400" />
              </motion.div>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-2">
              This board is empty
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Save pins to <span className="font-semibold text-foreground">{board.title}</span> and they'll show up here. Start exploring to find ideas worth keeping.
            </p>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/dashboard")}
              className="mt-6 px-6 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-80 transition-opacity"
            >
              Find pins to add
            </motion.button>
          </motion.div>
        ) : (
          <SmartPinsGrid
            items={boardPins}
            variant="pin"
            layout={layoutValue}
            showMetadata={true}
            showStarIcon={true}
          />
        )}
      </div>
    </>
  )
}