"use client"

import {
  Home,
  LayoutPanelLeft,
  SquarePlus,
  Settings,
  UserCircle,
  LucideIcon,
  Pin,
  Layers,
} from 'lucide-react'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import clsx from 'clsx'
import { PopoverTrigger, PopoverContent, Popover } from '../ui/popover'

interface DashboardLink {
  id: number
  icon: LucideIcon
  tooltip: string
  href?: string
  onClick?: () => void
}

interface CreateButtonLink {
  id: number,
  title: string,
  description: string,
  icon: LucideIcon,
  href: string
}

const topLinks: DashboardLink[] = [
  { id: 0, 
    icon: Home, 
    tooltip: 'Home',
    href: '/dashboard' 
  },
  { id: 1, icon: 
    LayoutPanelLeft, 
    tooltip: 'My Boards', 
    href: '/dashboard/boards' },
  {
    id: 2,
    icon: SquarePlus,
    tooltip: 'Create'
  }
]

const bottomLinks: DashboardLink[] = [
  { id: 3, icon: Settings, tooltip: 'Settings', href: '/dashboard/settings' },
  { id: 4, icon: UserCircle, tooltip: 'Profile', href: '/dashboard/profile' }
]

//create popOver items 
const createItems: CreateButtonLink[] = [
  {
    id: 1, icon: Pin, title: 'Pin',
    description: 'Upload photos or videos and attach links',
    href: '/dashboard/create/pin'
  },

  {
    id: 2, icon: LayoutPanelLeft, title: 'Board',
    description: 'Upload photos or videos and attach links',
    href: '/dashboard/create/board'
  },

  {
    id: 3, icon: Layers, title: 'Collage',
    description: 'Upload photos or videos and attach links',
    href: '/dashboard/create/collage'
  }
]


// Sidebar
const Sidebar = () => {
  const pathname = usePathname()
  const [activeAction, setActiveAction] = useState<number | null>(null)

  const renderLink = ({ id, icon: Icon, tooltip, href }: DashboardLink) => {
    // Check if the route matches or is nested
    const isRouteActive = href ? pathname.startsWith(href) : false
    const isActionActive = activeAction === id
    const isActive = isRouteActive || isActionActive

    const buttonClasses = clsx(
      "h-12 w-12 rounded-xl transition-colors flex items-center justify-center",
      isActive
        ? "bg-violet-700 text-white hover:bg-violet-800 hover:text-white"
        : "bg-muted text-black hover:bg-accent"
    )

    const button = (
      <button
        className={buttonClasses}
        onClick={() => {
          // Toggle popover for create button
          if (!href) {
            setActiveAction(activeAction === id ? null : id)
          } else {
            setActiveAction(null) // reset when clicking normal links
          }
        }}
      >
        <Icon size={28} />
      </button>
    )

    // Special case for Create (+) button
    if (!href && id === 2) {
      return (
        <Tooltip key={id}>
          <TooltipTrigger asChild>
            <Popover open={activeAction === id} onOpenChange={(open) => setActiveAction(open ? id : null)}>
              <PopoverTrigger asChild>
                {button}
              </PopoverTrigger>

              <PopoverContent
                side="right"
                align="center"
                className="w-72 p-4 rounded-2xl shadow-xl border-0"
              >
                <h2 className="text-2xl font-foreground pb-4">Create</h2>
                <div className="flex flex-col gap-1">
                  {createItems.map(({ id, title, href, description, icon: Icon }) => (
                    <Link
                      key={id}
                      href={href}
                      className="w-full flex items-center gap-4 rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                      onClick={() => setActiveAction(null)} // close popover on navigation
                    >
                      <div className="flex flex-1 rounded-xl items-center justify-center p-5 bg-accent">
                        <Icon size={24} />
                      </div>
                      <div>
                        <span className="text-xl font-medium">{title}</span>
                        <p>{description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </TooltipTrigger>
          <TooltipContent side="right">{tooltip}</TooltipContent>
        </Tooltip>
      )
    }

    // Normal links
    return (
      <Tooltip key={id}>
        <TooltipTrigger asChild>
          {href ? <Link href={href}>{button}</Link> : button}
        </TooltipTrigger>
        <TooltipContent side="right">{tooltip}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <aside className="flex h-screen w-26 flex-col items-center justify-between border-r bg-background">
      {/* Top Section */}
      <div className="flex flex-col items-center gap-6 pt-8">
        {/* Logo */}
        <div className="mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white font-bold">
            P
          </div>
        </div>

        {topLinks.map(renderLink)}
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center gap-4 pb-6">
        {bottomLinks.map(renderLink)}
      </div>
    </aside>
  )
}



export default Sidebar
