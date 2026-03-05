"use client"

import { Plus } from "lucide-react"
import { motion, LayoutGroup } from "framer-motion"
import { Dialog } from "@/components/ui/dialog"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import clsx from "clsx"
import CreateBoardModal from "@/components/boards/popovers/CreateBoardModal"
import BottomSheet from "@/components/ui/BottomSheet"
import CreateItemMobile from "@/components/shared/buttons/create_item/CreateItemMobile"
import { NotificationPanel } from "@/components/notification/panel/NotificationPanel"
import { DashboardLink } from "./dashboard_link_types"
import { MOBILE_IDS, NAV_LINKS } from "./shared_constants"

interface MobileBottomNavProps {
    isNotifOpen: boolean
    onToggleNotif: () => void
    NOTIF_UNREAD_COUNT: number
}

export const MobileBottomNav = ({ isNotifOpen, onToggleNotif, NOTIF_UNREAD_COUNT }: MobileBottomNavProps) => {
    const pathname = usePathname()
    const [openSheet, setOpenSheet] = useState(false)
    const [openBoardDialog, setOpenBoardDialog] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const lastScrollY = useRef(0)

    const mobileLinks = MOBILE_IDS.map(id => NAV_LINKS.find(l => l.id === id)!)

    const showBottomBar = [
        "/dashboard",
        "/dashboard/search",
        "/dashboard/boards",
        "/dashboard/collages",
        "/dashboard/profile",   // ← profile pages show the bottom nav
    ].some(route => {
        if (route === "/dashboard") return pathname === "/dashboard"
        return pathname.startsWith(route)
    })

    useEffect(() => {
        if (!showBottomBar) return
        const container = document.getElementById("dashboard-scroll")
        if (!container) return
        const onScroll = () => {
            const currentY = container.scrollTop
            const delta = currentY - lastScrollY.current
            if (Math.abs(delta) < 5) return
            if (currentY <= 10) setIsVisible(true)
            else if (delta > 0) setIsVisible(false)
            else setIsVisible(true)
            lastScrollY.current = currentY
        }
        container.addEventListener("scroll", onScroll, { passive: true })
        return () => container.removeEventListener("scroll", onScroll)
    }, [showBottomBar])

    const renderLink = (link: DashboardLink) => {
        const isActive = link.href
            ? link.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(link.href)
            : link.id === 4 && isNotifOpen

        const Icon = isActive && link.activeIcon ? link.activeIcon : link.icon

        const pill = (
            <motion.span
                layoutId="pill"
                className="absolute inset-0 bg-violet-600 rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
        )

        const iconEl = (
            <span className={clsx("relative z-10 transition-colors duration-300", isActive ? "text-white" : "text-slate-500")}>
                <Icon size={24} />
            </span>
        )

        // Notifications
        if (link.id === 4) {
            return (
                <button key={link.id} onClick={onToggleNotif} className="relative flex items-center justify-center h-12 w-12">
                    {isActive && pill}
                    {iconEl}
                    {NOTIF_UNREAD_COUNT > 0 && !isActive && (
                        <span className="absolute top-1.5 right-1.5 z-20 min-w-[15px] h-[15px] px-1 rounded-full bg-violet-600 text-white text-[8px] font-bold flex items-center justify-center leading-none">
                            {NOTIF_UNREAD_COUNT > 9 ? "9+" : NOTIF_UNREAD_COUNT}
                        </span>
                    )}
                </button>
            )
        }

        return (
            <Link key={link.id} href={link.href!} className="relative flex items-center justify-center h-12 w-12">
                {isActive && pill}
                {iconEl}
            </Link>
        )
    }

    if (!showBottomBar) return null

    return (
        <>
            <motion.div
                className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm"
                animate={{ y: isVisible ? 0 : 120, opacity: isVisible ? 1 : 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
            >
                <div className="flex items-center justify-between relative">
                    <div className="bg-background/90 backdrop-blur-2xl border shadow-xl rounded-[2.5rem] p-2">
                        <LayoutGroup>
                            <div className="flex items-center gap-6">
                                {mobileLinks.map(renderLink)}
                            </div>
                        </LayoutGroup>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setOpenSheet(true)}
                        className="absolute -right-8 -translate-x-1/2 h-16 w-16 bg-black text-white rounded-full flex items-center justify-center shadow-lg"
                    >
                        <Plus size={28} strokeWidth={3} />
                    </motion.button>
                </div>
            </motion.div>

            <BottomSheet isOpen={openSheet} onClose={() => setOpenSheet(false)} maxHeight="45vh">
                <CreateItemMobile
                    openSheet={openSheet}
                    setOpenSheet={setOpenSheet}
                    openBoardDialog={openBoardDialog}
                    setOpenBoardDialog={setOpenBoardDialog}
                />
            </BottomSheet>

            <BottomSheet isOpen={isNotifOpen} onClose={onToggleNotif} maxHeight="80vh">
                <NotificationPanel variant="sheet" onClose={onToggleNotif} />
            </BottomSheet>

            <Dialog open={openBoardDialog} onOpenChange={setOpenBoardDialog}>
                <CreateBoardModal />
            </Dialog>
        </>
    )
}