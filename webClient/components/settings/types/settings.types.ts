// ─── Types ─────────────────────────────────────────────────────────────────

export type TabId = "profile" | "account" | "notifications" | "appearance" | "billing" | "security"
export type Theme = "light" | "dark"
export type Density = "compact" | "comfortable" | "spacious"
export type AccentColor = string

export interface TabConfig {
    id: TabId
    label: string
    icon: React.FC<{ size?: number; className?: string }>
    description: string
}

export interface ProfileData {
    firstName: string
    lastName: string
    displayName: string
    jobTitle: string
    bio: string
    email: string
    phone: string
    timezone: string
}

export interface WorkspaceData {
    name: string
    slug: string
    region: string
}

export interface NotificationSettings {
    taskAssignments: boolean
    projectUpdates: boolean
    weeklyDigest: boolean
    pushNotifications: boolean
    dueDateReminders: boolean
}

export interface AppearanceSettings {
    theme: Theme
    accent: AccentColor
    density: Density
}

export interface SecurityData {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

export interface Session {
    device: string
    location: string
    current: boolean
    id: string
}

export interface Invoice {
    date: string
    amount: string
    status: "Paid" | "Pending" | "Failed"
    invoiceNumber: string
}