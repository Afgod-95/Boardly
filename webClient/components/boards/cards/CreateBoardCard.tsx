"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus } from "lucide-react"
import { PinItem } from "@/types/pin"
import { motion } from "framer-motion"
import { itemVariants } from '@/utils/animations'
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { DialogScrollableContent } from "@/components/shared/dialogs/DialogsScrollableContent"
import CreateBoardModal from "../popovers/CreateBoardModal"

interface CreateBoardCardProps {
  pin?: PinItem[]
  variant: "create" | "suggestion"

  children?: React.ReactNode
}

const CreateBoardCard = ({
  pin = [],
  variant,
  children
}: CreateBoardCardProps) => {

  const displayPins = pin.slice(0, 3)


  return (
    <>
      <Dialog>
        <DialogTrigger className="group cursor-pointer w-full">
          <div className="relative rounded-3xl overflow-hidden bg-gray-200 aspect-[4/3] shadow-sm group-hover:shadow-md transition-shadow duration-300">
            <div className="relative w-full h-full flex gap-0.5">

              {/* LEFT BIG */}
              <div className="relative flex-2 overflow-hidden bg-gray-300">
                {variant === "suggestion" && displayPins[0] && (
                  <Image
                    src={displayPins[0].img}
                    alt={displayPins[0].title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
              </div>

              {/* RIGHT STACK */}
              <div className="flex-1 flex flex-col gap-0.5">
                {[1, 2].map((index) => (
                  <div
                    key={index}
                    className="relative flex-1 overflow-hidden bg-gray-300"
                  >
                    {variant === "suggestion" && displayPins[index] && (
                      <Image
                        src={displayPins[index].img}
                        alt={displayPins[index].title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/20 transition-colors duration-300">
                <motion.div
                  initial={{ scale: 1, opacity: 0.8 }}
                  whileHover={{ scale: 1.1, opacity: 1 }}
                  className="
                    bg-white flex items-center gap-2
                    rounded-full px-6 py-3 shadow-xl
                    transition-all duration-200
                    hover:bg-gray-50
                  "
                >
                  <Plus size={20} strokeWidth={3} className="text-black" />
                  <span className="font-bold text-black text-sm">
                    {variant === "create" ? "Create" : "Save to Board"}
                  </span>
                </motion.div>
              </div>

            </div>
          </div>
        </DialogTrigger>
        {children}
      </Dialog>
    </>

  )
}

export default CreateBoardCard