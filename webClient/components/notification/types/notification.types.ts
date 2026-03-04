// ─── Notification domain types ────────────────────────────────────────────────

export type NotificationType = "mention" | "invite" | "alert" | "due"

export interface Notification {
    id: string
    type: NotificationType
    title: string
    description: string
    time: string           // ISO string — format at render time
    read: boolean
    avatarInitials?: string
    avatarColor?: string   // tailwind bg class e.g. "bg-violet-500"
    avatarUrl?: string     // optional photo — takes precedence over initials
}

// ─── NotificationPanel render props ──────────────────────────────────────────

export interface BaseProps {
    onClose: () => void
    isClicked?: boolean
}

export interface DesktopProps extends BaseProps {
    variant: "panel"
    open: boolean
}

export interface MobileProps extends BaseProps {
    variant: "sheet"
}

export type NotificationPanelProps = DesktopProps | MobileProps