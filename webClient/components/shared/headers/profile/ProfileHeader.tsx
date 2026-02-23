"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Search, ChevronDown, Settings, LogOut, User, Repeat } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Searchbar from '@/components/shared/searchbar/Searchbar'

const ProfileHeader = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="max-w-screen-6xl mx-auto py-5">
      <div className="flex items-center justify-between w-full gap-4">

        {/* 1. SEARCH BAR - Motion enabled */}
        <Searchbar />

        {/* 2. PROFILE POPOVER */}
        <Popover onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Card className="flex flex-row items-center gap-2 h-12 bg-muted/45 rounded-full border-none pl-1 pr-4 shadow-none cursor-pointer hover:bg-muted/70 transition-colors">
                <Avatar className="h-10 w-10 border-2 border-background">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>GD</AvatarFallback>
                </Avatar>

                <span className="text-sm font-bold hidden sm:inline-block">Godwin</span>

                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="text-muted-foreground"
                >
                  <ChevronDown size={18} strokeWidth={3} />
                </motion.div>
              </Card>
            </motion.div>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            className="w-72 p-2 rounded-3xl shadow-2xl border-gray-100 mt-2"
          >
            <div className="p-4">
              <p className="text-xs font-semibold text-gray-500 mb-3">Currently in</p>
              <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer">
                <Avatar className="h-14 w-14">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>GD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-sm">Godwin</p>
                  <p className="text-xs text-gray-500">Personal</p>
                  <p className="text-xs text-gray-500">godwin@example.com</p>
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-gray-100 my-2 mx-2" />

            <div className="flex flex-col gap-1 p-1">
              <ProfileMenuItem icon={<Settings size={18} />} label="Settings" />
              <ProfileMenuItem icon={<Repeat size={18} />} label="Switch account" />
              <ProfileMenuItem icon={<LogOut size={18} className="text-red-500" />} label="Log out" isRed />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

// Sub-component for Menu Items to keep things clean
const ProfileMenuItem = ({ icon, label, isRed = false }: { icon: React.ReactNode, label: string, isRed?: boolean }) => (
  <button className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-xl transition-colors text-left group">
    <div className="text-gray-500 group-hover:text-gray-900 transition-colors">
      {icon}
    </div>
    <span className={`text-sm font-bold ${isRed ? 'text-red-600' : 'text-gray-800'}`}>
      {label}
    </span>
  </button>
)

export default ProfileHeader