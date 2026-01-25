"use client"

import { PinItem } from "@/types/pin"
import { useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import PinCard from "./card/PinCard"
import PinDetailCard from "./card/PinDetailCard"
import { motion } from "framer-motion" 
import { useRouter } from "next/navigation"
import { setSelectedPin } from "@/redux/pinSlice"
import usePinsHook from "@/hooks/usePinsHook"
import SuggestionIdeasCard from "./card/SuggestedIdeasCard"
import PageWrapper from "../wrapper/PageWrapper"
import Header from "../headers/Header"
import BackButton from "../buttons/BackButton"
import { containerVariants, itemVariants } from '@/utils/animations';

interface Props {
  initialPin: PinItem
}

export default function PinDetailClient({ initialPin }: Props) {
  const { pins } = useSelector((state: RootState) => state.pins)
  const router = useRouter()
  const dispatch = useDispatch()
  const { hoveredItem, hoveredIndex } = usePinsHook()

  const leftColumnPins = useMemo(() => pins.filter((_, i) => i % 3 === 0), [pins]);
  const rightColumnPins = useMemo(() => pins.filter((_, i) => i % 3 !== 0), [pins]);

  // Updated render function to include motion.div
  const renderPin = (pin: PinItem, index: number) => (
    <motion.div 
      variants={itemVariants} // Inherits visibility from parent
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
      <div className="sm:flex md:hidden sticky z-10 top-4 mb-4">
        <BackButton />
      </div>

      <motion.div 
        className="flex items-start flex-wrap gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Desktop Back Button */}
        <motion.div 
          variants={itemVariants}
          className="md:block hidden p-3 rounded-xl sticky z-10 top-24"
        >
          <BackButton />
        </motion.div>

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

              {/* Suggestions Card animated too */}
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