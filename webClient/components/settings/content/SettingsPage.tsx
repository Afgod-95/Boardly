"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TABS } from "../constants/setting.constants"
import { AppearanceTab, AccountTab, NotificationsTab, BillingTab, SecurityTab, ProfileTab } from "../tabs"
import { TabId } from "../types/settings.types"
import Header from "@/components/shared/headers/Header"
import { useSearchParams } from "next/navigation"

// ─── Tab registry ───────────────────────────────────────────────────────────

const TAB_COMPONENTS: Record<TabId, React.FC> = {
    profile: ProfileTab,
    account: AccountTab,
    notifications: NotificationsTab,
    appearance: AppearanceTab,
    billing: BillingTab,
    security: SecurityTab,
}

const VALID_TABS = Object.keys(TAB_COMPONENTS) as TabId[]

// ─── Page ───────────────────────────────────────────────────────────────────

export default function SettingsPage() {
    const searchParams = useSearchParams()
    const tabParam = searchParams.get("tab") as TabId | null

    // If ?tab=profile (or any valid tab) is in the URL, open that tab directly.
    // Falls back to "profile" if the param is missing or invalid.
    const initialTab: TabId =
        tabParam && VALID_TABS.includes(tabParam) ? tabParam : "profile"

    const [activeTab, setActiveTab] = useState<TabId>(initialTab)
    const ActiveComponent = TAB_COMPONENTS[activeTab]
    const activeTabData = TABS.find(t => t.id === activeTab)!

    // Keep tab in sync if the URL param changes (e.g. browser back/forward)
    useEffect(() => {
        if (tabParam && VALID_TABS.includes(tabParam)) {
            setActiveTab(tabParam)
        }
    }, [tabParam])

    return (
        <div className="min-h-screen bg-background">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
                * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }
                ::-webkit-scrollbar { width: 5px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <Header />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8">

                    {/* ── Sidebar (desktop) ──────────────────────────────── */}
                    <aside className="hidden lg:flex flex-col gap-1 w-52 shrink-0 pt-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">
                            Settings
                        </p>
                        {TABS.map(({ id, label, icon: Icon }) => {
                            const active = activeTab === id
                            return (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-xl text-sm font-medium transition-all w-full text-left group ${active
                                            ? "text-indigo-700 bg-indigo-50"
                                            : "text-slate-500 hover:text-slate-700 hover:bg-muted"
                                        }`}
                                >
                                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 ${active ? "bg-indigo-100" : "bg-transparent group-hover:bg-slate-100"
                                        }`}>
                                        <Icon size={14} className={active ? "text-indigo-600" : "text-slate-400"} />
                                    </span>
                                    {label}
                                    {active && (
                                        <motion.span
                                            layoutId="sidebar-dot"
                                            className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500"
                                        />
                                    )}
                                </button>
                            )
                        })}
                    </aside>

                    {/* ── Content ────────────────────────────────────────── */}
                    <main className="flex-1 min-w-0">

                        {/* Mobile pills */}
                        <div className="flex lg:hidden gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                            {TABS.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${activeTab === id
                                            ? "text-indigo-700 bg-indigo-100"
                                            : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300"
                                        }`}
                                >
                                    <Icon size={12} /> {label}
                                </button>
                            ))}
                        </div>

                        {/* Tab heading */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                                {activeTabData.label}
                            </h1>
                            <p className="text-sm text-slate-400 mt-1">{activeTabData.description}</p>
                        </div>

                        <AnimatePresence mode="wait">
                            <ActiveComponent key={activeTab} />
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    )
}