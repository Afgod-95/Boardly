"use client"

import { motion } from "framer-motion"
import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface TabItem {
  id: number | string
  name: string
  href?: string
  onClick?: () => void
  active?: boolean
}

interface TabNavigationProps {
  tabs: TabItem[]
  className?: string
  layoutid?: string
}

const TabNavigation = ({ tabs, className = "" , layoutid }: TabNavigationProps) => {
  const pathname = usePathname()

  return (
    <div
      className={clsx(
        "relative flex items-center gap-2 p-1 rounded-full w-fit",
        className
      )}
    >
      {tabs.map((tab) => {
        // Use explicit active state if provided, otherwise check pathname
        const isActive = tab.active !== undefined 
          ? tab.active 
          : pathname === tab.href

        // Render button if onClick is provided, otherwise render Link
        const Component: any = tab.onClick ? 'button' : Link
        const componentProps = tab.onClick
          ? { onClick: tab.onClick, type: 'button' as const }
          : { href: tab.href || '#' }

        return (
          <Component
            key={tab.id}
            {...componentProps}
            className={clsx(
              "relative z-10 px-5 py-2 text-sm md:text-lg font-medium rounded-full transition-colors cursor-pointer",
              isActive
                ? "text-background"
                : "text-foreground hover:bg-accent"
            )}
          >
            {isActive && (
              <motion.span
               layoutId={layoutid || 'active-pill'}
                className="absolute inset-0 bg-foreground rounded-full z-[-1]"
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}

            {tab.name}
          </Component>
        )
      })}
    </div>
  )
}

export default TabNavigation