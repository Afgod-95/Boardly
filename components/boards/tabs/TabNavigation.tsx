"use client"

import { motion } from "framer-motion"
import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface TabItem {
  id: number | string
  name: string
  href: string
}

interface TabNavigationProps {
  tabs: TabItem[]
  className?: string
}

const TabNavigation = ({ tabs, className = "" }: TabNavigationProps) => {
  const pathname = usePathname()

  return (
    <div
      className={clsx(
        "relative flex items-center gap-2 p-1 rounded-full w-fit",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive =
          pathname === tab.href

        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={clsx(
              "relative z-10 px-5 py-2 text-sm md:text-lg font-medium rounded-full transition-colors cursor-pointer",
              isActive
                ? "text-background"
                : "text-foreground hover:bg-accent"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="active-pill"
                className="absolute inset-0 bg-foreground rounded-full z-[-1]"
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}

            {tab.name}
          </Link>
        )
      })}
    </div>
  )
}

export default TabNavigation
