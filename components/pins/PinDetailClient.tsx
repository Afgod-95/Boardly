"use client"

import { PinItem } from "@/types/pin"
import { useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import PinCard from "./card/PinCard"
import PinDetailCard from "./card/PinDetailCard"
import { ArrowLeft, Sparkles, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { setSelectedPin } from "@/redux/pinSlice"
import usePinsHook from "@/hooks/usePinsHook"
import SuggestionIdeasCard from "./card/SuggestedIdeasCard"
import PageWrapper from "../wrapper/PageWrapper"
import Header from "../headers/Header"

interface Props {
  initialPin: PinItem
}

export default function PinDetailClient({ initialPin }: Props) {
  const { pins } = useSelector((state: RootState) => state.pins)
  const router = useRouter()
  const dispatch = useDispatch()
  const { hoveredItem, hoveredIndex } = usePinsHook()

  // We send only 1 out of 3 pins to the Left (index 0, 3, 6...)
  // We send 2 out of 3 pins to the Right (index 1, 2, 4, 5...)
  // This keeps the Left column "small" (sparse) because it already has the big Detail Card.
  const leftColumnPins = useMemo(() => pins.filter((_, i) => i % 3 === 0), [pins]);
  const rightColumnPins = useMemo(() => pins.filter((_, i) => i % 3 !== 0), [pins]);

  // 3. Reusable render function
  const renderPin = (pin: PinItem, index: number) => (
    <div className="mb-4 break-inside-avoid" key={pin.id}>
      <PinCard
        item={pin}
        isHovered={hoveredIndex === index}
        onMouseEnter={() => hoveredItem(index)}
        onMouseLeave={() => hoveredItem(null)}
        showProfileButton={true}
        showSaveButton={true}
        showMetadata={true}
        onClick={() => {
          dispatch(setSelectedPin(pin))
          router.push(`/dashboard/pins/${pin.id}`)
        }}
      />
    </div>
  )

  return (
    <PageWrapper>
      <Header />
      {/* Mobile Back Button */}
      <button className="bg-accent sm:flex md:hidden hover:bg-muted p-3 rounded-xl sticky z-10 top-4 mb-4"
        onClick={() => router.back()}
      >
        <ArrowLeft size={24} />
      </button>

      <div className="flex items-start gap-5">
        {/* Desktop Back Button */}
        <button className="bg-accent md:block hidden hover:bg-muted p-3 rounded-xl sticky z-10 top-24"
          onClick={() => router.back()}
        >
          <ArrowLeft size={24} />
        </button>

        <div className="flex-1">
          <div className="grid md:grid-cols-2 gap-6">

            {/* --- LEFT COLUMN  --- */}
            <div className="flex flex-col gap-4">
              <PinDetailCard pin={initialPin} />

              {/* This column receives fewer pins (1/3rd of total) */}
              <div className="columns-2 2xl:columns-3 gap-4">
                {leftColumnPins.map((pin) => renderPin(pin, pins.indexOf(pin)))}
              </div>
            </div>

            {/* --- RIGHT COLUMN  --- */}
            <div className="flex flex-col gap-4">
              {/* Bigger Suggestion Card */}
              <SuggestionIdeasCard />
              {/* This column receives majority of pins (2/3rds of total) */}
              <div className="columns-2 2xl:columns-3 gap-4">
                {rightColumnPins.map((pin) => renderPin(pin, pins.indexOf(pin)))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageWrapper>
  )
}