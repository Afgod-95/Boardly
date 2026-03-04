"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Trash2, CheckCheck, X, AtSign, UserPlus, AlertCircle, Clock, ChevronLeft } from "lucide-react"
import clsx from "clsx"
import { INITIAL_NOTIFICATIONS } from "@/components/notification/notifications.data"
import type { Notification, NotificationType } from "../types/notification.types"
import CustomButton from "@/components/shared/buttons/CustomButton"
import { groupByDate } from "../helpers/notification.helpers"
import { NotifRow } from "../card/NotifRow"
import { useRouter } from "next/navigation"


type Tab = "all" | "unread" | NotificationType

export const TABS: { id: Tab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "mention", label: "Mentions" },
    { id: "invite", label: "Invites" },
    { id: "alert", label: "Alerts" },
    { id: "due", label: "Due" },
]
function tabCount(notifications: Notification[], tab: Tab): number {
    if (tab === "all") return notifications.length
    if (tab === "unread") return notifications.filter(n => !n.read).length
    return notifications.filter(n => n.type === tab).length
}

const DATE_ORDER = ["Today", "Yesterday", "This week", "Earlier"]



// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS)
    const [activeTab, setActiveTab] = useState<Tab>("all")
    const [selected, setSelected] = useState<Set<string>>(new Set())
    const [selecting, setSelecting] = useState(false)

    const router = useRouter()

    const tabsScrollRef = useRef<HTMLDivElement>(null)
    const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

    // Scroll active tab into center on change
    useEffect(() => {
        const el = tabRefs.current[activeTab]
        const container = tabsScrollRef.current
        if (!el || !container) return
        const target = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2
        container.scrollTo({ left: target, behavior: "smooth" })
    }, [activeTab])

    const markRead = (id: string) => setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n))
    const dismiss = (id: string) => setNotifications(p => p.filter(n => n.id !== id))
    const markAllRead = () => setNotifications(p => p.map(n => ({ ...n, read: true })))
    const deleteRead = () => setNotifications(p => p.filter(n => !n.read))
    const deleteSelected = () => {
        setNotifications(p => p.filter(n => !selected.has(n.id)))
        setSelected(new Set())
        setSelecting(false)
    }
    const toggleSelect = (id: string) => setSelected(prev => {
        const next = new Set(prev)
        next.has(id) ? next.delete(id) : next.add(id)
        return next
    })

    const filtered = useMemo(() => {
        if (activeTab === "all") return notifications
        if (activeTab === "unread") return notifications.filter(n => !n.read)
        return notifications.filter(n => n.type === activeTab)
    }, [notifications, activeTab])

    const grouped = useMemo(() => groupByDate(filtered), [filtered])
    const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications])
    const hasRead = notifications.some(n => n.read)

    return (
        <div className="min-h-screen bg-background">

            {/* ── Sticky header ── */}
            <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b">
                <div className="max-w-2xl mx-auto px-4 sm:px-6">

                    {/* Title + bulk actions */}
                    <div className="flex items-center justify-between py-5">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <CustomButton className="p-3 border" icon = {<ChevronLeft/>} 
                                    onClick={() => router.back()}
                                />
                                <div>
                                    <h1 className="text-xl font-bold tracking-tight">Notifications</h1>
                                    <AnimatePresence mode="wait">
                                        {unreadCount > 0 ? (
                                            <motion.p key="count"
                                                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                                                className="text-xs text-muted-foreground mt-0.5">
                                                {unreadCount} unread
                                            </motion.p>
                                        ) : (
                                            <motion.p key="clear"
                                                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                                                className="text-xs text-muted-foreground mt-0.5">
                                                All caught up ✓
                                            </motion.p>
                                        )}
                                    </AnimatePresence>

                                </div>
                              
                            </div>
                            
                        </div>

                        <div className="flex items-center gap-1">
                            <AnimatePresence mode="wait">
                                {selecting ? (
                                    <motion.div key="select-mode"
                                        initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                                        className="flex items-center gap-1">
                                        <span className="text-xs text-muted-foreground mr-1.5 tabular-nums">
                                            {selected.size} selected
                                        </span>
                                        <button onClick={deleteSelected} disabled={selected.size === 0}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-40 transition-colors">
                                            <Trash2 size={12} /> Delete
                                        </button>
                                        <button onClick={() => { setSelecting(false); setSelected(new Set()) }}
                                            className="px-3 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:bg-accent transition-colors">
                                            Cancel
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div key="default-mode"
                                        initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                                        className="flex items-center gap-1">
                                        {unreadCount > 0 && (
                                            <button onClick={markAllRead}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                                                <CheckCheck size={13} />
                                                <span className="hidden sm:inline">Mark all read</span>
                                            </button>
                                        )}
                                        {hasRead && (
                                            <button onClick={deleteRead}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                                                <Trash2 size={13} />
                                                <span className="hidden sm:inline">Delete read</span>
                                            </button>
                                        )}
                                        <button onClick={() => setSelecting(true)}
                                            className="px-3 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                                            Select
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* ── Tabs ── */}
                    <div ref={tabsScrollRef}
                        className="flex gap-0.5 overflow-x-auto pb-px scrollbar-none -mx-1 px-1">
                        {TABS.map(tab => {
                            const count = tabCount(notifications, tab.id)
                            const isActive = activeTab === tab.id

                            return (
                                <button
                                    key={tab.id}
                                    ref={el => { tabRefs.current[tab.id] = el }}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={clsx(
                                        "relative shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium transition-colors rounded-t-lg",
                                        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="tab-indicator"
                                            className="absolute bottom-0 inset-x-2 h-0.5 bg-violet-600 rounded-full"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                    {tab.label}
                                    {count > 0 && (
                                        <span className={clsx(
                                            "text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none transition-colors",
                                            isActive
                                                ? "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300"
                                                : "bg-muted text-muted-foreground"
                                        )}>
                                            {count > 99 ? "99+" : count}
                                        </span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* ── List ── */}
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
                <AnimatePresence mode="wait">
                    {filtered.length === 0 ? (
                        <motion.div key="empty"
                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
                            <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center">
                                <Bell size={24} />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-semibold text-foreground">Nothing here</p>
                                <p className="text-xs mt-1">
                                    {activeTab === "unread" ? "You're all caught up!" : "No notifications in this category yet."}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key={activeTab}
                            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="space-y-6">
                            {DATE_ORDER.filter(label => grouped[label]).map(label => (
                                <section key={label}>
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-2 px-1">
                                        {label}
                                    </p>
                                    <div className="space-y-2.5">
                                        <AnimatePresence initial={false}>
                                            {grouped[label].map(n => (
                                                <NotifRow
                                                    key={n.id}
                                                    notification={n}
                                                    selected={selected.has(n.id)}
                                                    selecting={selecting}
                                                    onSelect={toggleSelect}
                                                    onRead={markRead}
                                                    onDismiss={dismiss}
                                                />
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </section>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}