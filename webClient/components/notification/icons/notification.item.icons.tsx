import { UserPlus, AlertCircle, Calendar, MessageSquare, Clock, AtSign } from "lucide-react"
import { NotificationType } from "../types/notification.types";


export const NOTIFICATION_ICONS: Record<NotificationType, { icon: React.ElementType; bg: string; color: string }> = {
  mention: { icon: MessageSquare, bg: "bg-indigo-100", color: "text-indigo-600" },
  invite: { icon: UserPlus, bg: "bg-emerald-100", color: "text-emerald-600" },
  alert: { icon: AlertCircle, bg: "bg-amber-100", color: "text-amber-600" },
  due: { icon: Calendar, bg: "bg-rose-100", color: "text-rose-600" },
}


// ─── Type meta ────────────────────────────────────────────────────────────────

export const TYPE_META: Record<NotificationType, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  mention: { icon: AtSign, color: "text-violet-500", bg: "bg-violet-100 dark:bg-violet-900/40", label: "Mentions" },
  invite: { icon: UserPlus, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/40", label: "Invites" },
  alert: { icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/40", label: "Alerts" },
  due: { icon: Clock, color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-900/40", label: "Due" },
}