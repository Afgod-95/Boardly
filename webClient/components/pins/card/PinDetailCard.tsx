import React, { useEffect, useState } from "react"
import { ChevronDown, MoreHorizontal, Upload } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { motion, AnimatePresence } from "framer-motion"
import clsx from "clsx"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PinItem } from "@/types/pin"
import Image from "next/image"




const PinDetailCard = ({ pin }: { pin: PinItem }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const MAX_TEXT = 120


  // Sample data - replace with your actual content
  const mediaType = "image" // or "video"
  const mediaSrc = "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80"
  return (
    <div className="relative border rounded-2xl w-full max-w-2xl mx-auto space-y-5">
      <div className="sticky top-20 bg-background rounded-t-2xl p-5 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Share */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="bg-accent hover:bg-muted p-3 rounded-xl">
                <Upload size={20} />
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="start"
              className="w-40 p-3 rounded-2xl shadow-lg"
              sideOffset={8}
              forceMount
            >
              <p className="text-sm text-foreground">Share options here</p>
            </PopoverContent>
          </Popover>

          {/* More */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="bg-accent hover:bg-muted p-3 rounded-xl">
                <MoreHorizontal size={20} />
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="start"
              className="w-40 p-3 rounded-2xl shadow-lg"
              sideOffset={8}
              forceMount
            >
              <p className="text-sm text-foreground">More options here</p>
            </PopoverContent>
          </Popover>
        </div>

        {/* right actions: create buttons */}
        <div className="flex items-center gap-3">
          <button
            className={clsx(
              "flex items-center gap-2 py-2 px-4 hover:bg-accent rounded-full cursor-pointer text-foreground"
            )}
          >
            <span className="text-lg">Profile</span>
            <ChevronDown size={16} />
          </button>

          <button className="bg-violet-700 hover:bg-violet-800 py-2 px-6 rounded-full cursor-pointer text-white">
            <span className="text-lg">Save</span>
          </button>
        </div>
      </div>

      {/** image or video and text contents*/}
      <div className="flex flex-col justify-center gap-4 px-5">
        {mediaType === "image" ? (
          <div className="relative w-full max-h-150 overflow-hidden rounded-xl">
            <Image
              src={pin.img}
              alt="Detail image"
              width={800}
              height={1000}
              className="w-full h-full object-contain"
            />
          </div>


        ) : (
          <div className="w-full max-h-[600px] overflow-hidden rounded-xl">
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

      {/** user name and image*/}
      <div className="items-center flex gap-2 px-5 pb-5">
        <Avatar className="w-10 h-10">
          <AvatarFallback>CN</AvatarFallback>
          <AvatarImage src={pin.author?.profileUrl} />
        </Avatar>
        <span className="font-bold">{pin.author?.name}</span>
      </div>
    </div>
  )
}

export default PinDetailCard