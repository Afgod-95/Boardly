"use client"

import React, { useState } from "react"
import { INITIAL_NOTIFICATIONS } from "../notifications.data"
import { AnimatePresence, motion } from "framer-motion"
import { Bell, CheckCheck, X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip"
import { NotificationItem } from "../card/NotificationItem"
import { Notification } from "../types/notification.types"
import Link from "next/link"
import { NotificationList } from "../renderer/NotificationList"
import { NotificationPanelProps } from "../types/notification.types"

export const NotificationPanel: React.FC<NotificationPanelProps> = (props) => {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS)

  const unreadCount = notifications.filter(n => !n.read).length
  const markAllRead = () => setNotifications(p => p.map(n => ({ ...n, read: true })))
  const dismiss = (id: string) => setNotifications(p => p.filter(n => n.id !== id))
  const markRead = (id: string) => setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n))

  const listProps = {
    notifications,
    unreadCount,
    onMarkAllRead: markAllRead,
    onDismiss: dismiss,
    onMarkRead: markRead,
    onClose: props.onClose,
    isClicked: props.isClicked ?? false,
  }

  if (props.variant === "sheet") {
    return (
      <div className="flex flex-col h-full">
        <NotificationList variant="sheet" {...listProps} />
      </div>
    )
  }

  return (
    <AnimatePresence>
      {props.open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-70"
            onClick={props.onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="fixed left-24 top-0 h-screen w-80 bg-background border-r shadow-xl z-80 flex flex-col"
          >
            <NotificationList variant="panel" {...listProps} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
