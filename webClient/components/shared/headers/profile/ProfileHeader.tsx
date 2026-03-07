"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { ChevronDown, LogOut, User, Repeat, ChevronLeft, Pencil, Share2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { motion } from 'framer-motion'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Searchbar from '@/components/shared/searchbar/Searchbar'
import { usePathname, useRouter } from 'next/navigation'
import { useMediaQuery } from 'react-responsive'

// ── TODO: replace with real auth when ready ───────────────────────────────────
const CURRENT_USER = {
  name: "Godwin",
  username: "godwin",
  email: "godwin@example.com",
  avatar: "https://github.com/shadcn.png",
  plan: "Personal",
  initials: "GD",
}
// ─────────────────────────────────────────────────────────────────────────────

const ProfileHeader = ({ showSearchbar = true } : { showSearchbar?: boolean}) => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useMediaQuery({ maxWidth: 768 })

  const showBackButton = pathname === '/dashboard/settings' && isMobile


  const profileUrl = `/dashboard/profile/${CURRENT_USER.username}`

  const handleShareProfile = () => {
    const fullUrl = `${window.location.origin}${profileUrl}`
    if (navigator.share) {
      navigator.share({ title: `${CURRENT_USER.name}'s profile`, url: fullUrl })
    } else {
      navigator.clipboard.writeText(fullUrl)
      // TODO: trigger a toast — "Link copied!"
    }
  }

  return (
    <div className="max-w-screen-7xl mx-auto pt-5 pb-3 px-4 sm:px-5">
      <div className="flex items-center justify-between w-full gap-4">

        {/* Search bar */}
        {showSearchbar && (
          <div className="flex-1 flex items-center gap-3">
            {showBackButton && (
              <motion.div whileTap={{ scale: 0.9 }} onClick={() => router.back()} className="cursor-pointer">
                <ChevronLeft />
              </motion.div>
            )}
            <Searchbar />
          </div>
        )}

        {/* Profile popover */}
        <Popover onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Card className="flex flex-row items-center gap-2 h-12 bg-muted/45 rounded-full border-none pl-1 pr-4 shadow-none cursor-pointer hover:bg-muted/70 transition-colors">
                <Avatar className="h-10 w-10 border-2 border-background">
                  <AvatarImage src={CURRENT_USER.avatar} />
                  <AvatarFallback>{CURRENT_USER.initials}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-bold hidden sm:inline-block">{CURRENT_USER.name}</span>
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
            className="w-72 p-2 rounded-3xl shadow-2xl border-neutral-100 mt-2"
          >
            {/* Account identity */}
            <div className="p-4">
              <p className="text-xs font-semibold text-neutral-400 mb-3 uppercase tracking-wide">
                Currently in
              </p>
              <div onClick={() => router.push('/dashboard/boards')} 
                className="cursor-pointer flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-2xl transition-colors"
              >
                <Avatar className="h-14 w-14">
                  <AvatarImage src={CURRENT_USER.avatar} />
                  <AvatarFallback>{CURRENT_USER.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-sm">{CURRENT_USER.name}</p>
                  <p className="text-xs text-neutral-500">{CURRENT_USER.plan}</p>
                  <p className="text-xs text-neutral-400">{CURRENT_USER.email}</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-neutral-100 mx-2" />

            {/* Profile actions — View profile moved to mobile bottom nav */}
            <div className="flex flex-col gap-0.5 p-2 pt-3">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide px-2 pb-1">
                Profile
              </p>
              <ProfileMenuItem
                icon={<Pencil size={17} />}
                label="Edit profile"
                onClick={() => router.push('/dashboard/settings?tab=profile')}
              />
              <ProfileMenuItem
                icon={<Share2 size={17} />}
                label="Share profile"
                onClick={handleShareProfile}
              />
            </div>

            <div className="h-px bg-neutral-100 mx-2 mt-1" />

            {/* Account actions */}
            <div className="flex flex-col gap-0.5 p-2 pt-3">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide px-2 pb-1">
                Account
              </p>
              {pathname !== '/dashboard/settings' && (
                <ProfileMenuItem
                  icon={<User size={17} />}
                  label="Settings"
                  onClick={() => router.push('/dashboard/settings')}
                />
              )}
              <ProfileMenuItem
                icon={<Repeat size={17} />}
                label="Switch account"
              />
              <ProfileMenuItem
                icon={<LogOut size={17} className="text-red-500" />}
                label="Log out"
                isRed
                onClick={() => router.push('/auth/login')}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

const ProfileMenuItem = ({
  onClick, icon, label, isRed = false,
}: {
  onClick?: () => void
  icon: React.ReactNode
  label: string
  isRed?: boolean
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-neutral-50 rounded-xl transition-colors cursor-pointer text-left group"
  >
    <div className={`transition-colors ${isRed ? 'text-red-500' : 'text-neutral-400 group-hover:text-neutral-700'}`}>
      {icon}
    </div>
    <span className={`text-sm font-semibold ${isRed ? 'text-red-600' : 'text-neutral-700'}`}>
      {label}
    </span>
  </button>
)

export default ProfileHeader