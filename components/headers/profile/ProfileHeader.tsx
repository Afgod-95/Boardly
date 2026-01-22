"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Search, ChevronDown } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { motion } from 'framer-motion'


const ProfileHeader = () => {
    const [isUserOpen, setIsUserOpen] = useState(false)

  return (
    <>
        <div className="max-w-screen-2xl mx-auto md:flex py-5">
          <div className="z-30 flex items-center justify-between w-full gap-4">
            {/* Search bar (clickable, opens search page/modal) */}
            <Card
              className="flex-row items-center gap-2 h-10 bg-muted/45 rounded-xl border-none px-3 shadow-none max-w-3xl flex-1 cursor-text hover:bg-muted/60 transition"
              onClick={() => console.log("Open search page or modal")}
            >
              <Search className="text-muted-foreground" size={20} />
              <span className="text-muted-foreground select-none">Search</span>
            </Card>

            {/* User avatar */}
            <Card
              className="flex-row items-center gap-2 h-10 bg-muted/45 rounded-full border-none pl-1 pr-3 shadow-none cursor-pointer"
              onClick={() => setIsUserOpen(!isUserOpen)}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src="" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium">Godwin</p>

              {/* Animated Chevron */}
              <motion.div
                animate={{ rotate: isUserOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown />
              </motion.div>
            </Card>
          </div>
        </div>
    </>

  )
}

export default ProfileHeader