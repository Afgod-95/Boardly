"use client"

import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import React from "react"
import CustomButton from "../buttons/CustomButton"

interface HeaderStyleProps {
  headerRight?: React.ReactNode
  title?: string
  headerLeft?: React.ReactNode
  animatedTitle?: React.ReactNode
}

const MobileHeaderStyle = ({ headerRight, title, headerLeft, animatedTitle }: HeaderStyleProps) => {
  const router = useRouter()

  return (
    // flex on mobile (default), hidden from md upward
    <div className="flex md:hidden sticky top-0 z-20 bg-background p-2 items-center justify-between">
      {/* Left — custom node or back button */}
      {headerLeft ?? (
        <CustomButton
          icon={<ChevronLeft />}
          className="p-0"
          onClick={() => router.back()}
        />
      )}

      {/* Centre — animated title sits on top of the static title.
          Both are always rendered so AnimatePresence can manage entry/exit.
          The static title is invisible when animatedTitle is provided so
          there's no layout shift when the animated one fades in. */}
      <div className="relative flex items-center justify-center">
        {animatedTitle}
        {!animatedTitle && title && (
          <span className="text-sm font-bold">{title}</span>
        )}
      </div>

      {/* Right — custom node or empty spacer to keep centre centred */}
      {headerRight ?? <div />}
    </div>
  )
}

export default MobileHeaderStyle