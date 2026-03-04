"use client"

import { motion } from "framer-motion"
import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRef, useEffect } from "react"

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

const TabNavigation = ({ tabs, className = "", layoutid }: TabNavigationProps) => {
  const pathname = usePathname()
  const scrollRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Record<string | number, HTMLElement | null>>({})

  // Scroll the active tab into centre whenever it changes
  useEffect(() => {
    const activeTab = tabs.find(tab =>
      tab.active !== undefined ? tab.active : pathname === tab.href
    )
    if (!activeTab) return

    const el = tabRefs.current[activeTab.id]
    const container = scrollRef.current
    if (!el || !container) return

    const target = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2
    container.scrollTo({ left: target, behavior: "smooth" })
  }, [tabs, pathname])

  return (
    <div
      ref={scrollRef}
      className={clsx(
        "relative overflow-x-auto scrollbar-hide flex items-center gap-2 p-1 w-full",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.active !== undefined
          ? tab.active
          : pathname === tab.href

        const Component: any = tab.onClick ? "button" : Link
        const componentProps = tab.onClick
          ? { onClick: tab.onClick, type: "button" as const }
          : { href: tab.href || "#" }

        return (
          <Component
            key={tab.id}
            ref={(el: HTMLElement | null) => { tabRefs.current[tab.id] = el }}
            {...componentProps}
            className={clsx(
              "relative z-10 px-5 py-2 text-sm sm:text-sm rounded-full transition-colors cursor-pointer whitespace-nowrap",
              isActive
                ? "text-indigo-700"
                : "text-slate-500 hover:text-slate-700 hover:bg-muted"
            )}
          >
            {isActive && (
              <motion.span
                layoutId={layoutid || "active-pill"}
                className="absolute inset-0 bg-indigo-100 rounded-full z-[-1]"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
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