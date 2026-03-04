"use client"

import { useState } from "react"
import { useMediaQuery } from "react-responsive"
import { INITIAL_NOTIFICATIONS } from "@/components/notification/notifications.data"
import { MobileBottomNav, DesktopSidebar } from "./nav"



const DashboardNav = () => {
    const isMobile = useMediaQuery({ maxWidth: 639 })
    const NOTIF_UNREAD_COUNT = INITIAL_NOTIFICATIONS.filter(n => !n.read).length

    // Lifted here so notification state survives resizing between breakpoints
    const [isNotifOpen, setIsNotifOpen] = useState(false)
    const onToggleNotif = () => setIsNotifOpen(o => !o)

    return isMobile
        ?   <MobileBottomNav 
                isNotifOpen={isNotifOpen} 
                onToggleNotif={onToggleNotif} 
                NOTIF_UNREAD_COUNT={NOTIF_UNREAD_COUNT}
            />
        :   <DesktopSidebar 
                isNotifOpen={isNotifOpen} 
                onToggleNotif={onToggleNotif} 
                NOTIF_UNREAD_COUNT={NOTIF_UNREAD_COUNT}
            />
}

export default DashboardNav