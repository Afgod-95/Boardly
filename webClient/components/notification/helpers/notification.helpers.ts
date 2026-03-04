
import { Notification } from "../types/notification.types"




export function groupByDate(notifications: Notification[]): Record<string, Notification[]> {
    const groups: Record<string, Notification[]> = {}
    for (const n of notifications) {
        const diff = (Date.now() - new Date(n.time).getTime()) / 86400000
        const label = diff < 1 ? "Today" : diff < 2 ? "Yesterday" : diff < 7 ? "This week" : "Earlier"
        if (!groups[label]) groups[label] = []
        groups[label].push(n)
    }
    return groups
}



