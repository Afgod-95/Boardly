"use client"

import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import clsx from "clsx"
import CreateBoardModal from "@/components/boards/popovers/CreateBoardModal"
import { NotificationPanel } from "@/components/notification/panel/NotificationPanel"
import { DESKTOP_TOP_IDS, DESKTOP_BOTTOM_IDS, NAV_LINKS, CREATE_ITEMS } from "./shared_constants"
import { DashboardLink } from "./dashboard_link_types"

interface DesktopSidebarProps {
    isNotifOpen: boolean
    onToggleNotif: () => void
    NOTIF_UNREAD_COUNT: number
}

export const DesktopSidebar = ({ isNotifOpen, onToggleNotif, NOTIF_UNREAD_COUNT }: DesktopSidebarProps) => {
    const pathname = usePathname()
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    const isOnNotifPage = pathname === "/dashboard/notifications"

    const routeActiveId = (() => {
        if (pathname === "/dashboard") return 0
        if (pathname.startsWith("/dashboard/boards")) return 1
        if (pathname.startsWith("/dashboard/create")) return 4
        if (pathname.startsWith("/dashboard/settings")) return 5
        return null
    })()

    // Bell is active when:
    //   - the panel is open (toggled via click), OR
    //   - the user is on the notifications page
    const notifIsActive = isNotifOpen || isOnNotifPage

    const activeId = isCreateOpen ? 4 : notifIsActive ? 3 : routeActiveId

    const topLinks = DESKTOP_TOP_IDS.map(id => NAV_LINKS.find(l => l.id === id)!)
    const bottomLinks = DESKTOP_BOTTOM_IDS.map(id => NAV_LINKS.find(l => l.id === id)!)

    const ActiveBackground = () => (
        <motion.div
            layoutId="active-sidebar-item"
            className="absolute inset-0 rounded-xl bg-violet-700 shadow-md"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
    )

    const renderLink = ({ id, icon: Icon, activeIcon: ActiveIcon, tooltip, href }: DashboardLink) => {
        const isActive = activeId === id

        const IconContent = (
            <div className={clsx(
                "relative z-10 transition-colors duration-200",
                isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"
            )}>
                {isActive && ActiveIcon ? <ActiveIcon size={26} /> : <Icon size={26} />}
            </div>
        )

        const HoverBg = !isActive && (
            <div className="absolute inset-0 rounded-xl bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        )

        // ── Notifications ──
        if (id === 3) {
            return (
                <Tooltip key={id}>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            onClick={() => {
                                // On the notifications page the bell just toggles the panel
                                // as a quick-peek; navigating away is via the sidebar link itself.
                                onToggleNotif()
                                if (isCreateOpen) setIsCreateOpen(false)
                            }}
                            className="relative h-12 w-12 flex items-center justify-center rounded-xl group"
                        >
                            {isActive && <ActiveBackground />}
                            {HoverBg}
                            {IconContent}
                            {NOTIF_UNREAD_COUNT > 0 && !isActive && (
                                <span className="absolute top-1.5 right-1.5 z-20 min-w-4 h-4 px-1 rounded-full bg-violet-600 text-white text-[9px] font-bold flex items-center justify-center leading-none">
                                    {NOTIF_UNREAD_COUNT > 9 ? "9+" : NOTIF_UNREAD_COUNT}
                                </span>
                            )}
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">{tooltip}</TooltipContent>
                </Tooltip>
            )
        }

        // ── Create popover ──
        if (id === 4) {
            return (
                <Popover
                    key={id}
                    open={isCreateOpen}
                    onOpenChange={v => { setIsCreateOpen(v); if (v && isNotifOpen) onToggleNotif() }}
                >
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <PopoverTrigger asChild>
                                <button type="button" className="relative h-12 w-12 flex items-center justify-center rounded-xl group">
                                    {isActive && <ActiveBackground />}
                                    {HoverBg}
                                    {IconContent}
                                </button>
                            </PopoverTrigger>
                        </TooltipTrigger>
                        <PopoverContent side="right" align="center" className="w-72 p-4 rounded-2xl border-0 shadow-xl ml-2">
                            <h2 className="text-xl font-semibold pb-4">Create</h2>
                            <div className="flex flex-col gap-1">
                                {CREATE_ITEMS.map((item) => (
                                    <div key={item.id}>
                                        {item.id === 2 ? (
                                            <Dialog>
                                                <DialogTrigger
                                                    className={clsx(
                                                        "flex gap-4 items-center justify-start text-start",
                                                        "rounded-xl w-full p-3 hover:bg-muted transition-colors"
                                                    )}
                                                >
                                                    <div className="p-4 rounded-xl bg-accent"><item.icon size={22} /></div>
                                                    <div>
                                                        <p className="font-medium">{item.title}</p>
                                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                                    </div>
                                                </DialogTrigger>
                                                <CreateBoardModal onClose={() => setIsCreateOpen(false)} />
                                            </Dialog>
                                        ) : (
                                            <Link href={item.href as string} onClick={() => setIsCreateOpen(false)}
                                                className="flex gap-4 items-center rounded-xl p-3 hover:bg-muted transition-colors">
                                                <div className="p-4 rounded-xl bg-accent"><item.icon size={22} /></div>
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

        // ── Standard nav link ──
        return (
            <Tooltip key={id}>
                <TooltipTrigger asChild>
                    <Link href={href!} className="relative h-12 w-12 flex items-center justify-center group">
                        {isActive && <ActiveBackground />}
                        {HoverBg}
                        {IconContent}
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{tooltip}</TooltipContent>
            </Tooltip>
        )
    }

    return (
        <>
            <aside className="flex h-screen w-24 flex-col items-center justify-between border-r bg-background z-40 relative">
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

            <NotificationPanel variant="panel" open={isNotifOpen} onClose={onToggleNotif} />
        </>
    )
}