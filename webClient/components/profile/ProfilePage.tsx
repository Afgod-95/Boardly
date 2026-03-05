"use client"

import { useState } from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Grid3X3, Bookmark, Share2, Pencil, MapPin, Briefcase, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { INITIAL_PROFILE } from "@/components/settings/constants/setting.constants"
import CustomButton from "../shared/buttons/CustomButton"
import SmartPinsGrid from "../shared/grid/SmartPinsGrid"
import usePinHook from "../pins/hooks/usePinHook"

// ── Animations ────────────────────────────────────────────────────────────────
const stagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
}

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

const tabContent: Variants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

// ── Types ────────────────────────────────────────────────────────────────────
type TabId = "pins" | "boards"

const TABS: { id: TabId; label: string; icon: typeof Grid3X3 }[] = [
    { id: "pins", label: "Pins", icon: Grid3X3 },
    { id: "boards", label: "Boards", icon: Bookmark },
]

// ── Mock profile — replace with real fetch ───────────────────────────────────
function useProfile(username: string) {
    return {
        ...INITIAL_PROFILE,
        username,
        avatar: "https://github.com/shadcn.png",
        coverPhoto: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
        stats: { pins: 348, boards: 24, followers: 1200, following: 89 },
        isOwner: true,
    }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ProfilePage({ username }: { username: string }) {
    const router = useRouter()
    const profile = useProfile(username)
    const { pins } = usePinHook()
    const [activeTab, setActiveTab] = useState<TabId>("pins")

    const {
        firstName, lastName, displayName, bio,
        jobTitle, timezone, avatar, coverPhoto, stats, isOwner,
    } = profile

    const fullName = `${firstName} ${lastName}`
    const initials = `${firstName[0]}${lastName[0]}`

    return (
        <div className="min-h-screen bg-background">

            {/* ── Fixed back button — stays visible while scrolling ─────── */}
            <CustomButton
                className="fixed top-5 left-4 md:left-30 z-50 bg-accent shadow-sm"
                onClick={() => router.back()}
                icon={<ChevronLeft size={20} className="text-neutral-600" />}
            />

            {/* ── Cover ─────────────────────────────────────────────────── */}
            <div className="relative h-40 sm:h-56 lg:h-64 w-full overflow-hidden bg-neutral-100">
                {coverPhoto
                    ? <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200" />
                }
            </div>

            {/* ── Profile identity block ────────────────────────────────── */}
            <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
            >
                {/* Avatar — overlaps cover */}
                <motion.div variants={fadeUp} className="-mt-12 sm:-mt-14 lg:-mt-16 flex justify-center">
                    <Avatar className="h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32 border-4 border-white shadow-lg ring-1 ring-neutral-100">
                        <AvatarImage src={avatar} />
                        <AvatarFallback className="text-xl sm:text-2xl font-bold bg-neutral-100 text-neutral-600">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </motion.div>

                {/* Name + handle */}
                <motion.div variants={fadeUp} className="mt-3 sm:mt-4 text-center">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-neutral-900">
                        {fullName}
                    </h1>
                    <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">@{displayName}</p>
                </motion.div>

                {/* Job title + timezone */}
                <motion.div variants={fadeUp} className="mt-2.5 flex items-center justify-center flex-wrap gap-x-4 gap-y-1">
                    {jobTitle && (
                        <span className="flex items-center gap-1.5 text-xs text-neutral-500">
                            <Briefcase size={11} className="text-neutral-400" /> {jobTitle}
                        </span>
                    )}
                    {timezone && (
                        <span className="flex items-center gap-1.5 text-xs text-neutral-500">
                            <MapPin size={11} className="text-neutral-400" /> {timezone}
                        </span>
                    )}
                </motion.div>

                {/* Bio */}
                {bio && (
                    <motion.p
                        variants={fadeUp}
                        className="mt-3 text-xs sm:text-sm text-neutral-500 text-center leading-relaxed max-w-xs sm:max-w-sm mx-auto"
                    >
                        {bio}
                    </motion.p>
                )}

                {/* Stats */}
                <motion.div
                    variants={fadeUp}
                    className="mt-5 sm:mt-7 grid grid-cols-4 divide-x divide-neutral-100 py-4 border-y border-neutral-100"
                >
                    {[
                        { label: "Pins", value: stats.pins },
                        { label: "Boards", value: stats.boards },
                        { label: "Followers", value: formatCount(stats.followers) },
                        { label: "Following", value: formatCount(stats.following) },
                    ].map(({ label, value }) => (
                        <div key={label} className="text-center px-2">
                            <p className="text-base sm:text-lg font-bold text-neutral-900 leading-none">{value}</p>
                            <p className="text-[10px] sm:text-xs text-neutral-400 mt-1">{label}</p>
                        </div>
                    ))}
                </motion.div>

                {/* CTA buttons */}
                <motion.div variants={fadeUp} className="mt-4 sm:mt-6 flex items-center justify-center gap-2">
                    {isOwner ? (
                        <>
                            <Button
                                variant="outline" size="sm"
                                className="rounded-full border-neutral-200 text-neutral-700 font-semibold px-4 sm:px-5 text-xs sm:text-sm hover:bg-neutral-50"
                                onClick={() => router.push("/dashboard/settings?tab=profile")}
                            >
                                <Pencil size={12} className="mr-1.5" /> Edit profile
                            </Button>
                            <Button
                                variant="outline" size="sm"
                                className="rounded-full border-neutral-200 text-neutral-700 font-semibold px-4 sm:px-5 text-xs sm:text-sm hover:bg-neutral-50"
                                onClick={() => {
                                    const url = window.location.href
                                    navigator.share?.({ title: `${fullName}'s profile`, url })
                                        ?? navigator.clipboard.writeText(url)
                                }}
                            >
                                <Share2 size={12} className="mr-1.5" /> Share
                            </Button>
                        </>
                    ) : (
                        <Button
                            size="sm"
                            className="rounded-full bg-neutral-900 text-white font-semibold px-6 hover:bg-neutral-700"
                        >
                            Follow
                        </Button>
                    )}
                </motion.div>

                {/* ── Tabs ──────────────────────────────────────────────── */}
                <motion.div
                    variants={fadeUp}
                    className="flex items-center justify-center mt-6 sm:mt-8 border-b border-neutral-100"
                >
                    {TABS.map(({ id, label, icon: Icon }) => {
                        const active = activeTab === id
                        return (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`relative flex items-center gap-1.5 px-6 py-3 text-sm font-semibold transition-colors ${active
                                        ? "text-neutral-900"
                                        : "text-neutral-400 hover:text-neutral-600"
                                    }`}
                            >
                                <Icon size={14} /> {label}
                                {active && (
                                    <motion.div
                                        layoutId="tab-indicator"
                                        className="absolute bottom-0 inset-x-0 h-0.5 bg-neutral-900 rounded-full"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                            </button>
                        )
                    })}
                </motion.div>

                {/* ── Tab content ───────────────────────────────────────── */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        variants={tabContent}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        className="mt-6 pb-24"
                    >
                        {activeTab === "pins" && (
                            <SmartPinsGrid items={pins} variant="detail" />
                        )}
                        {activeTab === "boards" && (
                            // TODO: swap pins for boards data when useBoardHook is ready
                            <SmartPinsGrid items={pins} variant="detail" />
                        )}
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </div>
    )
}

function formatCount(n: number): string {
    return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}