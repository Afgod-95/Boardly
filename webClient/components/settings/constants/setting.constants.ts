import { 
    TabConfig, AccentColor, Density, WorkspaceData,
    NotificationSettings, AppearanceSettings, Invoice,
    Session,  ProfileData
 } from "../types/settings.types"
 import { User, ShieldCheck, Palette, CreditCard, Bell, Lock } from "lucide-react"

// ─── Constants ─────────────────────────────────────────────────────────────

export const TABS: TabConfig[] = [
    { id: "profile", label: "Profile", icon: User, description: "Manage how you appear to your team." },
    { id: "account", label: "Account", icon: ShieldCheck, description: "Workspace settings and data management." },
    { id: "notifications", label: "Notifications", icon: Bell, description: "Control when and how you're notified." },
    { id: "appearance", label: "Appearance", icon: Palette, description: "Customize your Boardly experience." },
    { id: "billing", label: "Billing", icon: CreditCard, description: "Manage your plan and payment details." },
    { id: "security", label: "Security", icon: Lock, description: "Keep your account secure." },
]

export const ACCENT_COLORS: AccentColor[] = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"]
export const DENSITIES: Density[] = ["compact", "comfortable", "spacious"]
export const TIMEZONES = ["UTC-8 (Pacific)", "UTC-7 (Mountain)", "UTC-6 (Central)", "UTC-5 (Eastern)", "UTC+0 (London)", "UTC+1 (Paris)", "UTC+5:30 (India)", "UTC+8 (Beijing)", "UTC+9 (Tokyo)"]

export const INITIAL_PROFILE: ProfileData = {
    firstName: "John", lastName: "Doe", displayName: "johndoe",
    jobTitle: "Product Manager", bio: "Building better products, one sprint at a time.",
    email: "john.doe@company.com", phone: "", timezone: "UTC-5 (Eastern)"
}

//mock data for initial workspace
export const INITIAL_WORKSPACE: WorkspaceData = { name: "Boardly HQ", slug: "boardly-hq", region: "US East" }

export const INITIAL_NOTIFICATIONS: NotificationSettings = {
    taskAssignments: true, projectUpdates: true, weeklyDigest: false,
    pushNotifications: true, dueDateReminders: true
}

export const INITIAL_APPEARANCE: AppearanceSettings = { theme: "light", accent: "#6366f1", density: "comfortable" }

export const INITIAL_SESSIONS: Session[] = [
    { id: "s1", device: "MacBook Pro", location: "San Francisco, US", current: true },
    { id: "s2", device: "iPhone 15", location: "San Francisco, US", current: false },
    { id: "s3", device: "Chrome on Windows", location: "New York, US", current: false },
]

export const INVOICES: Invoice[] = [
    { date: "Mar 2, 2026", amount: "$29.00", status: "Paid", invoiceNumber: "INV-1042" },
    { date: "Feb 2, 2026", amount: "$29.00", status: "Paid", invoiceNumber: "INV-1041" },
    { date: "Jan 2, 2026", amount: "$29.00", status: "Paid", invoiceNumber: "INV-1040" },
]