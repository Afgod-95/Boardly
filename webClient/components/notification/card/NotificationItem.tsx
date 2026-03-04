
import { NOTIFICATION_ICONS } from "../icons/notification.item.icons"
import { Notification } from "../types/notification.types"
import { X } from "lucide-react"
import { motion } from "framer-motion"
import clsx from "clsx"
import { formatTime } from "@/helpers/formatTime"

interface NotificationItemProps {
  notification: Notification
  onDismiss: (id: string) => void
  onRead: (id: string) => void
}



export const NotificationItem: React.FC<NotificationItemProps> = ({ notification: n, onDismiss, onRead }) => {
  const { icon: TypeIcon, bg, color } = NOTIFICATION_ICONS[n.type]

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: 0.18 }}
      onClick={() => !n.read && onRead(n.id)}
      className={clsx(
        "group relative flex gap-3 px-5 py-3.5 rounded-2xl cursor-pointer transition-colors",
        !n.read ? "bg-violet-50/60 hover:bg-violet-50" : "hover:bg-accent/50"
      )}
    >
      {/* Unread dot */}
      {!n.read && (
        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-violet-600" />
      )}

      {/* Avatar or icon */}
      <div className="shrink-0 mt-0.5">
        {n.avatarInitials ? (
          <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold", n.avatarColor)}>
            {n.avatarInitials}
          </div>
        ) : (
          <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center", bg)}>
            <TypeIcon size={14} className={color} />
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 pr-6">
        <p className={clsx("text-xs leading-snug truncate", !n.read ? "font-semibold text-foreground" : "font-medium text-foreground/80")}>
          {n.title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">{n.description}</p>
        <p className="text-[10px] text-muted-foreground/70 mt-1.5">{formatTime(n.time)}</p>
      </div>

      {/* Dismiss */}
      <button
        onClick={e => { e.stopPropagation(); onDismiss(n.id) }}
        className="absolute right-3 top-3 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-accent transition-all text-muted-foreground hover:text-foreground"
      >
        <X size={12} />
      </button>
    </motion.div>
  )
}