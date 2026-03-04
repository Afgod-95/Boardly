"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Trash2, CheckCheck, X, AtSign, UserPlus, AlertCircle, Clock, ChevronLeft } from "lucide-react"
import clsx from "clsx"
import { INITIAL_NOTIFICATIONS } from "@/components/notification/notifications.data"
import type { Notification, NotificationType } from "../types/notification.types"
import CustomButton from "@/components/shared/buttons/CustomButton"
import { Avatar } from "@/components/ui/avatar"
import { TYPE_META } from "../icons/notification.item.icons"
import { NotificationUserAvatar } from "./NotificationUserAvatar"
import layout from "@/app/dashboard/boards/layout"
import { timeAgoShort } from "@/helpers/timeAgo"
import { formatTime } from "@/helpers/formatTime"

interface RowProps {
    notification: Notification
    selected: boolean
    selecting: boolean
    onSelect: (id: string) => void
    onRead: (id: string) => void
    onDismiss: (id: string) => void
}

export const NotifRow = ({ notification: n, selected, selecting, onSelect, onRead, onDismiss }: RowProps) => {
    const meta = TYPE_META[n.type]
    const BadgeIcon = meta.icon

    // Alert with no actor — just a standalone icon tile
    if (n.type === "alert" &&
        !n.avatarUrl &&
        !n.avatarInitials
    ) {
        return (
            <motion.div
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.18 } }}
                onClick={() => selecting ? onSelect(n.id) : onRead(n.id)}
                className={clsx(
                    "group relative flex items-start gap-3.5 rounded-2xl px-4 py-3.5 cursor-pointer transition-colors select-none",
                    !n.read
                        ? "bg-violet-50/70 dark:bg-violet-950/20 hover:bg-violet-50 dark:hover:bg-violet-950/30"
                        : "hover:bg-muted/60",
                    selected && "ring-0.5 ring-violet-500 bg-violet-50 dark:bg-violet-950/30"
                )}
            >
                <NotificationUserAvatar n={n} />

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p className={clsx(
                        "text-sm leading-snug",
                        !n.read ? "font-semibold text-foreground" : "font-medium text-foreground/80"
                    )}>
                        {n.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                        {n.description}
                    </p>
                    <p className="text-[11px] text-muted-foreground/60 mt-1.5 tabular-nums font-medium">
                        {formatTime(n.time)}
                    </p>
                </div>

                {/* Dismiss */}
                <button
                    onClick={e => { e.stopPropagation(); onDismiss(n.id) }}
                    className="shrink-0 self-start mt-0.5 p-1 rounded-lg opacity-0 group-hover:opacity-100 text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                >
                    <X size={13} />
                </button>
            </motion.div>

        )
    }
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20, transition: { duration: 0.18 } }}
            onClick={() => selecting ? onSelect(n.id) : onRead(n.id)}
            className={clsx(
                "group relative flex items-start gap-3.5 rounded-2xl px-4 py-3.5 cursor-pointer transition-colors select-none",
                !n.read
                    ? "bg-violet-50/70 dark:bg-violet-950/20 hover:bg-violet-50 dark:hover:bg-violet-950/30"
                    : "hover:bg-muted/60",
                selected && "ring-2 ring-violet-500 bg-violet-50 dark:bg-violet-950/30"
            )}
        >
            {/* Unread dot */}
            {!n.read && (
                <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-violet-600 shrink-0" />
            )}

            {/* Checkbox */}
            <AnimatePresence>
                {selecting && (
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 20 }}
                        exit={{ opacity: 0, width: 0 }}
                        className="shrink-0 self-center overflow-hidden"
                    >
                        <div
                            onClick={e => { e.stopPropagation(); onSelect(n.id) }}
                            className={clsx(
                                "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors",
                                selected ? "bg-violet-600 border-violet-600" : "border-muted-foreground/40"
                            )}
                        >
                            {selected && <X size={11} className="text-white stroke-[3]" />}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <NotificationUserAvatar n={n} />

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className={clsx(
                    "text-sm leading-snug",
                    !n.read ? "font-semibold text-foreground" : "font-medium text-foreground/80"
                )}>
                    {n.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                    {n.description}
                </p>
                <p className="text-[11px] text-muted-foreground/60 mt-1.5 tabular-nums font-medium">
                    {formatTime(n.time)}
                </p>
            </div>

            {/* Dismiss */}
            <button
                onClick={e => { e.stopPropagation(); onDismiss(n.id) }}
                className="shrink-0 self-start mt-0.5 p-1 rounded-lg opacity-0 group-hover:opacity-100 text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
            >
                <X size={13} />
            </button>
        </motion.div>
    )

}