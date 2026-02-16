"use client"

import { PinItem } from "@/types/pin"
import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { PinDetailCard } from "../card"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { setSelectedPin } from "@/redux/pinSlice"
import usePinsHook from "@/hooks/usePinsHook"
import SuggestionIdeasCard from "../card/SuggestedIdeasCard"
import PageWrapper from "@/components/wrapper/PageWrapper"
import Header from "@/components/headers/Header"
import BackButton from "@/components/buttons/BackButton"
import { containerVariants, itemVariants } from '@/utils/animations';
import MobileHeaderStyle from "@/components/headers/MobileHeaderStyle"
// Import the SmartPinsGrid we built
import SmartPinsGrid from "../grid/SmartPinsGrid"

interface Props {
  initialPin: PinItem
}

export default function PinDetailClient({ initialPin }: Props) {
  const { pins } = useSelector((state: RootState) => state?.pins)
  const { boards } = useSelector((state: RootState) => state?.boards)
  const router = useRouter()
  const dispatch = useDispatch()

  const [showDesktopBack, setShowDesktopBack] = useState(false)

  // Split pins for the masonry-like columns
  const leftColumnPins = useMemo(() => pins.filter((_, i) => i % 3 === 0), [pins]);
  const rightColumnPins = useMemo(() => pins.filter((_, i) => i % 3 !== 0), [pins]);

  useEffect(() => {
    const handleScroll = () => setShowDesktopBack(window.scrollY > 5)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    dispatch(setSelectedPin(initialPin))
  }, [initialPin, dispatch])

  return (
    <PageWrapper>
      <Header />

      <div className="sm:flex md:hidden">
        <MobileHeaderStyle title="Pin Details" />
      </div>

      <motion.div
        className="py-5 px-4 md:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {showDesktopBack && (
            <motion.div
              className="hidden md:flex fixed top-[15%] left-8 z-50"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
            >
              <BackButton />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-350 mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">

            {/* --- LEFT COLUMN: Detail + Masonry Subset --- */}
            <div className="flex flex-col gap-8">
              <motion.div variants={itemVariants}>
                {/* I'll want to ensure PinDetailCard 
                   also uses the same popover logic internally 
                */}
                <PinDetailCard pin={initialPin} boards={boards} />
              </motion.div>

              <div className="space-y-4">
                <h2 className="font-bold text-xl px-2">More like this</h2>
                <SmartPinsGrid
                  variant = 'detail'
                  items={leftColumnPins}
                  showMetadata={true}
                />
              </div>
            </div>

            {/* --- RIGHT COLUMN: Masonry Subset + Suggestions --- */}
            <div className="flex flex-col gap-8">
              <SmartPinsGrid
                items={rightColumnPins}
                variant="detail"
                showMetadata={true}
              />

              <motion.div variants={itemVariants}>
                <SuggestionIdeasCard />
              </motion.div>
            </div>

          </div>
        </div>
      </motion.div>
    </PageWrapper>
  )
}