"use client"

import React, { useEffect, useState } from "react"
import { ChevronDown, MoreHorizontal, Upload } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { motion, AnimatePresence } from "framer-motion"
import clsx from "clsx"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PinItem } from "@/types/pin"
import Image from "next/image"
import Link from "next/link"
import { MoreOptionsContent, SaveToBoard, SharePin } from "../popovers"
import { BoardItem } from "@/types/board"
import SaveButton from "../button/SaveButton"
import { toast } from 'sonner'

interface PinDetailCardProps {
  pin: PinItem,
  boards: BoardItem[],
  onSave?: () => void,
}



const PinDetailCard = ({ pin, boards, onSave }: PinDetailCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const MAX_TEXT = 120



  // Sample data - replace with your actual content
  const mediaType = "image" // or "video"
  const mediaSrc = "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80"
  return (
    <div className="relative border rounded-2xl w-full mx-auto space-y-5">
      <div className="sticky top-20 bg-background rounded-t-2xl p-5 z-10 flex items-center md:gap-4 justify-between">
        <div className="flex items-center gap-3">
          {/* Share */}
          <Popover>
            <PopoverTrigger asChild>
              <motion.div
                whileTap={{ scale: 0.92 }}
                className="bg-accent hover:bg-muted p-3 rounded-xl">
                <Upload size={20} />
              </motion.div>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="start"
              className="w-sm rounded-2xl shadow-lg"
              sideOffset={8}
              forceMount
            >
              <SharePin pin = {pin} onShare={() => toast.success(`Pin clicked ${pin?.id}, ${pin?.title}`)}  />
            </PopoverContent>
          </Popover>

          {/* More */}
          <Popover>
            <PopoverTrigger asChild>
              <motion.button
                whileTap={{ scale: 0.92 }}
                className="bg-accent hover:bg-muted p-3 rounded-xl">
                <MoreHorizontal size={20} />
              </motion.button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="start"
              className="p-8 max-w-2xl rounded-2xl shadow-lg"
              sideOffset={8}
              forceMount
            >
             <MoreOptionsContent  pin = {pin} />
            </PopoverContent>
          </Popover>
        </div>

        {/* right actions: create buttons */}
        <div className="flex items-center gap-3">
          {pin?.isSaved !== true  && pin?.boardId !== 'profile' ? (
            <Link
              href={`/dashboard/boards/${pin?.boardId}`}
              className={clsx(
                "flex items-center gap-2 py-2 px-4 hover:bg-accent rounded-full cursor-pointer text-foreground"
              )}
            >
              <span className="text-lg">{boards.find((b) => b.id === pin?.boardId)?.title}</span>
              <ChevronDown size={16} />
            </Link>
          ) : (
            <Popover>
              <PopoverTrigger>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  className={clsx(
                    "flex items-center gap-2 py-2 px-4 hover:bg-accent rounded-full cursor-pointer text-foreground"
                  )}
                >
                    <span className="text-lg">{boards.find((b) => b.id === pin?.boardId)?.title}</span>
                  <ChevronDown size={16} />
                </motion.button>
              </PopoverTrigger>
              <PopoverContent>
                <SaveToBoard pin={pin} onSave={() => onSave?.()} boards={boards} />
              </PopoverContent>
            </Popover>

          )}


          <SaveButton pinId={pin?.id as string | number} isSaved={pin?.isSaved as boolean} />
        </div>
      </div>

      {/** image or video and text contents*/}
      <div className="flex flex-col justify-center gap-4 px-5">
        {mediaType === "image" ? (
          <div className="relative max-w-xl mx-auto max-h-150 overflow-hidden rounded-xl">
            <Image
              src={pin.img}
              alt="Detail image"
              width={800}
              height={1000}
              className="w-full h-full object-contain"
            />
          </div>


        ) : (
          <div className="relative max-w-xl mx-auto max-h-150 overflow-hidden rounded-xl">
            <video
              src={pin.video}
              controls
              className="w-full h-full object-contain"
            />
          </div>

        )}

        {/** contents */}
        <div>
          {/** title */}
          <h2 className="text-2xl font-bold mb-2">{pin.title}</h2>

          {/** description */}
          <div className="relative">
            <motion.div
              initial={false}
              animate={{ height: isExpanded ? "auto" : "1.5rem" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden relative"
            >
              <p className="text-base text-pretty leading-relaxed inline">
                {pin.description}{" "}
                {pin.description && pin.description.length > MAX_TEXT && isExpanded && (
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="font-semibold hover:underline inline text-muted-foreground"
                  >
                    less
                  </button>
                )}
              </p>

              {pin.description && pin.description.length > MAX_TEXT && !isExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-r from-transparent to-background flex items-end justify-end pointer-events-none">
                  <button
                    onClick={() => setIsExpanded(true)}
                    className=" px-4 bg-background/95 text-muted-foreground font-semibold hover:underline pointer-events-auto"
                  >
                    ...more
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/** user name and image - clickable profile */}
      {pin.author?.profileUrl ? (
        <Link
          href={pin.author.profileUrl}
          className="items-center flex gap-2 px-5 pb-5 hover:opacity-80 transition-opacity cursor-pointer group"
        >
          <Avatar className="w-10 h-10 ring-2 ring-transparent group-hover:ring-violet-500 transition-all">
            <AvatarFallback>{pin.author?.name?.slice(0, 2).toUpperCase() || "CN"}</AvatarFallback>
            <AvatarImage src={pin.author?.avatar} />
          </Avatar>
          <span className="font-bold group-hover:underline">{pin.author?.name}</span>
        </Link>
      ) : (
        <div className="items-center flex gap-2 px-5 pb-5">
          <Avatar className="w-10 h-10">
            <AvatarFallback>{pin.author?.name?.slice(0, 2).toUpperCase() || "CN"}</AvatarFallback>
            <AvatarImage src={pin.author?.avatar} />
          </Avatar>
          <span className="font-bold">{pin.author?.name}</span>
        </div>
      )}
    </div>
  )
}

export default PinDetailCard