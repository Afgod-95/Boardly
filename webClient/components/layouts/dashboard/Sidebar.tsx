"use client"

import {
  Home,
  LayoutPanelLeft,
  SquarePlus,
  Settings,
  LucideIcon,
  Pin,
  Layers,
} from "lucide-react"

import {
  RiHome5Fill,
  RiDashboardFill,
  RiSettings3Fill,
} from "react-icons/ri"

import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import clsx from "clsx"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import CreateBoardModal from "@/components/boards/popovers/CreateBoardModal"

/* ---------------------------------- TYPES --------------------------------- */

interface DashboardLink {
  id: number
  icon: LucideIcon
  activeIcon?: React.ElementType
  tooltip: string
  href?: string
}

/* ---------------------------------- LINKS --------------------------------- */

const topLinks: DashboardLink[] = [
  { id: 0, icon: Home, activeIcon: RiHome5Fill, tooltip: "Home", href: "/dashboard" },
  {
    id: 1, icon: LayoutPanelLeft, activeIcon: RiDashboardFill,
    tooltip: "Your Boards", href: "/dashboard/boards"
  },
  { id: 2, icon: SquarePlus, tooltip: "Create" }, // ID 2 = Create
]

const bottomLinks: DashboardLink[] = [
  {
    id: 3, icon: Settings, activeIcon: RiSettings3Fill,
    tooltip: "Settings", href: "/dashboard/settings"
  },
]

/* ----------------------------- CREATE POPOVER ------------------------------ */

const createItems = [
  {
    id: 1, icon: Pin, title: "Pin", description: "Upload photos or videos",
    href: "/dashboard/create/pin"
  },
  { id: 2, icon: LayoutPanelLeft, title: "Board", description: "Organize your ideas", href: null }, // create board modal
  { id: 3, icon: Layers, title: "Collage", description: "Create a visual mix", href: "/dashboard/create/collage" },
]

/* -------------------------------- SIDEBAR --------------------------------- */

const Sidebar = () => {
  const pathname = usePathname()
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  /* ---------------------- CALCULATE ACTIVE STATE ---------------------- */

  // 1. Determine which page we are on based on URL
  const routeActiveId = (() => {
    if (pathname === "/dashboard") return 0
    if (pathname.startsWith("/dashboard/boards")) return 1
    if (pathname.startsWith("/dashboard/create")) return 2
    if (pathname.startsWith("/dashboard/settings")) return 3
    return null
  })()


  // If Create is open, IT gets the background. Otherwise, the current route gets it.
  const activeId = isCreateOpen ? 2 : routeActiveId

  /* ---------------------- SHARED MOTION COMPONENT ---------------------- */
  // This is the purple box that will slide around
  const ActiveBackground = () => (
    <motion.div
      layoutId="active-sidebar-item"
      className="absolute inset-0 rounded-xl bg-violet-700 shadow-md"
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
    />
  )

  /* ----------------------------- RENDER LINK ----------------------------- */

  const renderLink = ({ id, icon: Icon, activeIcon: ActiveIcon, tooltip, href }: DashboardLink) => {
    const isActive = activeId === id

    // Common Icon Wrapper to ensure consistent sizing/positioning
    const IconContent = (
      <div
        className={clsx(
          "relative z-10 transition-colors duration-200",
          isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"
        )}
      >
        {isActive && ActiveIcon ? <ActiveIcon size={26} /> : <Icon size={26} />}
      </div>
    )

    /* --------------------------- CREATE BUTTON (ID: 2) --------------------------- */
    if (id === 2) {
      return (
        <Popover open={isCreateOpen} onOpenChange={setIsCreateOpen} key={id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="relative h-12 w-12 flex items-center justify-center rounded-xl group"
                >
                  {/* If Create is active, show the purple background here */}
                  {isActive && <ActiveBackground />}

                  {/* If NOT active, show hover effect */}
                  {!isActive && (
                    <div className="absolute inset-0 rounded-xl bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  )}
                  {IconContent}
                </button>
              </PopoverTrigger>
            </TooltipTrigger>
            <PopoverContent side="right" align="center" className="w-72 p-4 rounded-2xl border-0 shadow-xl ml-2">
              <h2 className="text-xl font-semibold pb-4">Create</h2>
              <div className="flex flex-col gap-1">
                {createItems.map((item) => (
                  <div key={item.id}>
                    {item.id === 2 ? (
                      <Dialog>
                        <DialogTrigger
                          className={clsx(
                            "flex gap-4 items-center justify-start text-start rounded-xl w-full",
                            "p-3 hover:bg-muted transition-colors")}
                        >

                          <div className="p-4 rounded-xl bg-accent">
                            <item.icon size={22} />
                          </div>
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>

                        </DialogTrigger>
                        <CreateBoardModal />
                      </Dialog>
                    ) : (

                      <Link
                        href={item.href as string}
                        // When a sub-item is clicked, we close the popover.
                        // The activeId will automatically revert to the new route ID, 
                        // causing the purple box to slide to the correct page icon.
                        onClick={() => setIsCreateOpen(false)}
                        className="flex gap-4 items-center rounded-xl p-3 hover:bg-muted transition-colors"
                      >
                        <div className="p-4 rounded-xl bg-accent">
                          <item.icon size={22} />
                        </div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </Link>
                    )}
                  </div>

                ))}
              </div>
            </PopoverContent>
            <TooltipContent side="right">{tooltip}</TooltipContent>
          </Tooltip>
        </Popover>
      )
    }

    /* ----------------------------- STANDARD LINKS ---------------------------- */
    return (
      <Tooltip key={id}>
        <TooltipTrigger asChild>
          <Link
            href={href!}
            className="relative h-12 w-12 flex items-center justify-center group"
          >
            {isActive && <ActiveBackground />}

            {!isActive && (
              <div className="absolute inset-0 rounded-xl bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            )}

            {IconContent}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{tooltip}</TooltipContent>
      </Tooltip>
    )
  }

  /* ---------------------------------- UI ---------------------------------- */
  return (
    <aside className="flex h-screen w-24 flex-col items-center justify-between border-r bg-background z-20">
      <div className="flex flex-col items-center gap-6 pt-8">
        <div className="mb-4 flex h-10 w-10 p-3 items-center justify-center rounded-xl bg-black text-white font-bold text-lg">
          B
        </div>
        {topLinks.map(renderLink)}
      </div>

      <div className="flex flex-col items-center gap-4 pb-6">
        {bottomLinks.map(renderLink)}
      </div>
    </aside>
  )
}

export default Sidebar