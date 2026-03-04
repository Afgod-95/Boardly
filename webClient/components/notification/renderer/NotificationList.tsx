import React from 'react'
import { Bell, CheckCheck, X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { NotificationItem } from "../card/NotificationItem"
import { Notification } from "../types/notification.types"
import Link from "next/link"
import { AnimatePresence } from "framer-motion"




// ─── Shared notification list content ────────────────────────────────────────

interface NotificationListProps {
    variant: "panel" | "sheet"
    notifications: Notification[]
    unreadCount: number
    onMarkAllRead: () => void
    onDismiss: (id: string) => void
    onMarkRead: (id: string) => void
    onClose: () => void
    isClicked?: boolean
}

export const NotificationList: React.FC<NotificationListProps> = ({
    variant,
    notifications,
    unreadCount,
    onMarkAllRead,
    onDismiss,
    onMarkRead,
    onClose,
    isClicked
}) => {
    const unread = notifications.filter(n => !n.read)
    const read = notifications.filter(n => n.read)

    const header = (
        <div className={`flex items-center justify-between px-5 border-b shrink-0 ${variant === "panel" ? "pt-6 pb-4" : "pt-2 pb-4"}`}>
            <div className="flex items-center gap-2.5">
                <h2 className="text-base font-semibold">Notifications</h2>
                {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-violet-700 text-white">
                        {unreadCount}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                    variant === "panel" ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={onMarkAllRead}
                                    className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                                >
                                    <CheckCheck size={15} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">Mark all as read</TooltipContent>
                        </Tooltip>
                    ) : (
                        <button
                            onClick={onMarkAllRead}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-accent transition-colors"
                        >
                            <CheckCheck size={13} />
                            Mark all read
                        </button>
                    )
                )}

                {variant === "panel" && (
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <X size={15} />
                    </button>
                )}
            </div>
        </div>
    )

    const list = (
        <div className={`flex-1 overflow-y-auto pb-12 ${variant === "panel" ? "p-2" : "p-3"}`}>
            {notifications.length === 0 ? (
                <div className={`flex flex-col items-center justify-center h-full gap-3 text-muted-foreground px-6 text-center ${variant === "sheet" ? "py-12" : ""}`}>
                    <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center">
                        <Bell size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-foreground">You're all caught up</p>
                        <p className="text-xs mt-1">No new notifications</p>
                    </div>
                </div>
            ) : (
                <>
                    {unread.length > 0 && (
                        <div className={variant === "panel" ? "mt-2 space-y-2.5" : "space-y-2"}>
                            <p className="px-5 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">New</p>
                            <AnimatePresence initial={false}>
                                {unread.map(n => (
                                    <NotificationItem key={n.id} notification={n} onDismiss={onDismiss} onRead={onMarkRead} />
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                    {read.length > 0 && (
                        <div className={unread.length > 0 ? "mt-2" : ""}>
                            <p className="px-5 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Earlier</p>
                            <AnimatePresence initial={false}>
                                {read.map(n => (
                                    <NotificationItem key={n.id} notification={n} onDismiss={onDismiss} onRead={onMarkRead} />
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </>
            )}
        </div>
    )

    const footer = (
        <div className="px-5 py-4 border-t shrink-0 absolute bottom-0 left-0 w-full bg-background">
            {isClicked && (
                <div className="flex justify-center items-center gap-1.5">
                    <CheckCheck size={13} />
                    <span className="text-xs font-medium text-foreground">All marked read</span>
                </div>
            )}
            <Link
                href="/dashboard/notifications"
                onClick={onClose}
                className="text-xs font-medium text-violet-700 hover:text-violet-800 transition-colors"
            >
                View all notifications →
            </Link>
        </div>
    )

    return <>{header}{list}{footer}</>
}