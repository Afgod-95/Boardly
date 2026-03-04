
import type { Notification } from "./types/notification.types"

const now = new Date()
const minsAgo = (m: number) => new Date(now.getTime() - m * 60 * 1000).toISOString()
const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000).toISOString()
const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000).toISOString()

export const INITIAL_NOTIFICATIONS: Notification[] = [
    // ── mentions ──────────────────────────────────────────────────────────────
    {
        id: "1",
        type: "mention",
        title: "Zoe Nakamura mentioned you",
        description: "Hey @you — saved your collage to my Autumn board, hope that's ok!",
        time: minsAgo(4),
        read: false,
        avatarInitials: "ZN",
        avatarColor: "bg-pink-500",
        avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=Zoe",
    },
    {
        id: "2",
        type: "mention",
        title: "Marco Ricci mentioned you",
        description: "Check out @you's pins if you love minimalist interiors — seriously inspiring.",
        time: daysAgo(1),
        read: true,
        avatarInitials: "MR",
        avatarColor: "bg-orange-500",
        avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=Marco",
    },

    // ── invites ───────────────────────────────────────────────────────────────
    {
        id: "3",
        type: "invite",
        title: "Felix Wagner invited you to a board",
        description: "You've been invited to collaborate on \"Architecture Moodboard\".",
        time: minsAgo(18),
        read: false,
        avatarInitials: "FW",
        avatarColor: "bg-violet-500",
        avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=Felix",
    },
    {
        id: "4",
        type: "invite",
        title: "Aneka Osei invited you to a collage",
        description: "Aneka wants you to contribute to \"Summer 2025 Vibes\".",
        time: hoursAgo(3),
        read: false,
        avatarInitials: "AO",
        avatarColor: "bg-emerald-500",
        avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=Aneka",
    },
    {
        id: "5",
        type: "invite",
        title: "Liam Torres invited you to a board",
        description: "You've been added as a collaborator on \"Travel Bucket List\".",
        time: daysAgo(2),
        read: true,
        avatarInitials: "LT",
        avatarColor: "bg-blue-500",
        avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=Liam",
    },

    // ── alerts ────────────────────────────────────────────────────────────────
    {
        id: "6",
        type: "alert",
        title: "Your board is trending 🔥",
        description: "\"Minimal Living\" entered the top 100 boards this week. Keep pinning!",
        time: hoursAgo(5),
        read: false,
    },
    {
        id: "7",
        type: "alert",
        title: "New feature: Collage remix",
        description: "You can now remix any public collage directly from the Explore feed.",
        time: daysAgo(3),
        read: true,
    },
    {
        id: "8",
        type: "alert",
        title: "Weekly digest ready",
        description: "Your 7-day summary: 42 saves, 18 new followers, 3 trending pins.",
        time: daysAgo(6),
        read: true,
    },

    // ── due ───────────────────────────────────────────────────────────────────
    {
        id: "9",
        type: "due",
        title: "Pin deadline approaching",
        description: "\"Brand Refresh Moodboard\" is due in 2 days. Review your draft.",
        time: hoursAgo(1),
        read: false,
    },
    {
        id: "10",
        type: "due",
        title: "Shared board deadline",
        description: "The \"Q3 Campaign\" board Felix shared with you is due tomorrow.",
        time: hoursAgo(6),
        read: false,
        avatarInitials: "FW",
        avatarColor: "bg-violet-500",
        avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=Felix",
    },
    {
        id: "11",
        type: "due",
        title: "Collage review overdue",
        description: "\"Spring Lookbook\" was due yesterday. Tap to open and submit.",
        time: daysAgo(1),
        read: true,
    },
]