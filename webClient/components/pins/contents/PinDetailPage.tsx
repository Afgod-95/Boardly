"use client"

import { PinItem } from "@/types/pin"
import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { PinCard, PinDetailCard } from "../card"
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

interface Props {
  initialPin: PinItem
}

export default function PinDetailClient({ initialPin }: Props) {
  const { pins } = useSelector((state: RootState) => state.pins)
  const router = useRouter()
  const dispatch = useDispatch()
  const { hoveredItem, hoveredIndex } = usePinsHook()

  const [showDesktopBack, setShowDesktopBack] = useState(false)

  const leftColumnPins = useMemo(() => pins.filter((_, i) => i % 3 === 0), [pins]);
  const rightColumnPins = useMemo(() => pins.filter((_, i) => i % 3 !== 0), [pins]);

  // Track scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowDesktopBack(window.scrollY > 5)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    dispatch(setSelectedPin(initialPin))
  }, [initialPin, dispatch])

  const renderPin = (pin: PinItem, index: number) => (
    <motion.div
      variants={itemVariants}
      className="mb-4 break-inside-avoid"
      key={pin.id}
    >
      <PinCard
        item={pin}
        isHovered={hoveredIndex === index}
        onMouseEnter={() => hoveredItem(index)}
        onMouseLeave={() => hoveredItem(null)}
        showProfileButton={true}
        layout="standard"
        showSaveButton={true}
        showMetadata={true}
        onClick={() => {
          dispatch(setSelectedPin(pin))
          router.replace(`/dashboard/pins/${pin.id}`)
        }}
      />
    </motion.div>
  )

  return (
    <PageWrapper>
      <Header />

      {/* Mobile Back Button */}
      <div className="sm:flex md:hidden">
        <MobileHeaderStyle title="Pin Details" />
      </div>



      <motion.div
        className="py-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Desktop Back Button with bounce */}
        <AnimatePresence>
          {showDesktopBack && (
            <motion.div
              className="hidden md:flex fixed top-6/12 left-8 -z-50" 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: [0, -10, 0], opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              <BackButton />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1">
          <div className="grid md:grid-cols-2 gap-6">

            {/* --- LEFT COLUMN --- */}
            <div className="flex flex-col gap-4">
              <motion.div variants={itemVariants}>
                <PinDetailCard pin={initialPin} />
              </motion.div>

              <div className="columns-2 2xl:columns-3 gap-4">
                {leftColumnPins.map((pin) => renderPin(pin, pins.indexOf(pin)))}
              </div>
            </div>

            {/* --- RIGHT COLUMN --- */}
            <div className="flex flex-col gap-4">
              <div className="columns-2 2xl:columns-3 gap-4">
                {rightColumnPins.map((pin) => renderPin(pin, pins.indexOf(pin)))}
              </div>

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
