import { Notification } from "../types/notification.types"
import clsx from "clsx"
import { Avatar, AvatarBadge, AvatarImage } from "@/components/ui/avatar"
import { TYPE_META } from "../icons/notification.item.icons"

export const NotificationUserAvatar = ({ n }: { n: Notification }) => {
    const meta = TYPE_META[n.type]
    const BadgeIcon = meta.icon

    // Alert with no actor — just a standalone icon tile
    if (n.type === "alert" && !n.avatarUrl && !n.avatarInitials) {
        return (
            <div className={clsx("shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center", meta.bg)}>
                <BadgeIcon size={18} className={meta.color} />
            </div>
        )
    }

    return (
        <div className="relative shrink-0">
            {n.avatarUrl ? (
                <Avatar>
                    <AvatarImage src={n.avatarUrl} alt={n.avatarInitials ?? ""}
                        className="w-10 h-10 rounded-full object-cover bg-muted" />
                </Avatar>
            ) : (
                <div className={clsx(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white",
                    n.avatarColor ?? "bg-slate-400"
                )}>
                    {n.avatarInitials}
                </div>
            )}
            <span className={clsx(
                "absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-background",
                meta.bg
            )}>
                <BadgeIcon size={10} className={meta.color} />
            </span>
        </div>
    )
}