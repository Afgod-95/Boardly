import { LucideIcon } from "lucide-react"

export interface DashboardLink {
    id: number
    icon: LucideIcon
    activeIcon?: React.ElementType
    tooltip: string
    href?: string
}