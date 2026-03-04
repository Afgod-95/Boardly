import {
    RiHome5Fill, RiDashboardFill, RiSettings3Fill,
    RiNotification3Fill, RiSearch2Fill, RiUser2Fill,
} from "react-icons/ri"

import {
    Home, LayoutPanelLeft, SquarePlus,
    Settings, LucideIcon, Pin, Layers,
    Bell, UserCircle, Search, Plus,
} from "lucide-react"

import { DashboardLink } from "./dashboard_link_types"

// ─── Shared constants ─────────────────────────────────────────────────────────

/**
 * Single source of truth for all nav links.
 * Desktop and mobile each pick the IDs they need via DESKTOP_TOP_IDS etc.
 *
 * IDs:
 *  0 – Home
 *  1 – Boards       (desktop top)
 *  2 – Search       (mobile only)
 *  3 – Profile      (mobile only)
 *  4 – Bell         (shared)
 *  5 – Create/Plus  (desktop top, mobile FAB)
 *  6 – Settings     (desktop bottom)
 */
export const NAV_LINKS: DashboardLink[] = [
    { id: 0, icon: Home, activeIcon: RiHome5Fill, tooltip: "Home", href: "/dashboard" },
    { id: 1, icon: LayoutPanelLeft, activeIcon: RiDashboardFill, tooltip: "Your Boards", href: "/dashboard/boards" },
    { id: 2, icon: Search, activeIcon: RiSearch2Fill, tooltip: "Search", href: "/dashboard/search" },
    { id: 3, icon: LayoutPanelLeft, activeIcon: RiDashboardFill, tooltip: "Board", href: "/dashboard/boards" },
    { id: 4, icon: Bell, activeIcon: RiNotification3Fill, tooltip: "Notifications", href: "/dashboard/notifications" },
    { id: 5, icon: SquarePlus, tooltip: "Create" },
    { id: 6, icon: Settings, activeIcon: RiSettings3Fill, tooltip: "Settings", href: "/dashboard/settings" },
]

export const DESKTOP_TOP_IDS = [0, 1, 5, 4]
export const DESKTOP_BOTTOM_IDS = [6]
export const MOBILE_IDS = [0, 2, 3, 4]

export const CREATE_ITEMS = [
    { id: 1, icon: Pin, title: "Pin", description: "Upload photos or videos", href: "/dashboard/create/pin" },
    { id: 2, icon: LayoutPanelLeft, title: "Board", description: "Organize your ideas", href: null },
    { id: 3, icon: Layers, title: "Collage", description: "Create a visual mix", href: "/dashboard/create/collage" },
]