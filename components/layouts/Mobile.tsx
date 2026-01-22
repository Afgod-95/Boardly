"use client"

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  Home,
  LayoutPanelLeft,
  SquarePlus,
  UserCircle,
  Search,
  LucideIcon
} from 'lucide-react'
import Link from 'next/link'
import clsx from 'clsx'

interface DashboardLink {
  id: number
  icon: LucideIcon
  tooltip: string
  href?: string
  onClick?: () => void
}

const BottomNavigator = () => {
  const pathname = usePathname()
  const [activeAction, setActiveAction] = useState<number | null>(null)

  const bottomLinks: DashboardLink[] = [
    { id: 0, icon: Home, tooltip: 'Home', href: '/dashboard' },
    { id: 1, icon: Search, tooltip: 'Search', href: '/dashboard/search' },
    { id: 3, icon: SquarePlus, tooltip: 'Create' },
    { id: 4, icon: UserCircle, tooltip: 'Profile', href: '/dashboard/profile' }
  ]

  const renderLink = ({ id, icon: Icon, href }: DashboardLink) => {
    const isRouteActive = activeAction === null && href && pathname === href
    const isActionActive = activeAction === id
    const isActive = isRouteActive || isActionActive

    const buttonClasses = clsx(
      'flex items-center justify-center h-12 w-12 rounded-full transition-colors',
      isActive
        ? 'bg-[#7C3AED] text-white' // active pill background
        : 'bg-[#F7F7F7] text-black hover:bg-[#EDEDED]' 
    )

    const button = (
      <button
        onClick={() => {
          if (!href) {
            setActiveAction(id)
            console.log('Open create pop up')
          } else {
            setActiveAction(null)
          }
        }}
        className={buttonClasses}
      >
        <Icon size={24} />
      </button>
    )

    return href ? <Link key={id} href={href}>{button}</Link> : <div key={id}>{button}</div>
  }

  return (
    <div className="fixed bottom-0 z-50 left-0 right-0 h-16 bg-white border-t flex justify-around items-center px-6 shadow-md md:hidden">
      {bottomLinks.map(renderLink)}
    </div>
  )
}

export default BottomNavigator
