import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import clsx

from "clsx"
interface ToolBtnProps {
    label: string
    icon: React.ReactNode
    onClick: () => void
    active?: boolean
    danger?: boolean
    className?: string
}

export const SideToolBtn = ({ label, icon, onClick, active, danger, className }: ToolBtnProps) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <button
                type="button"
                onClick={onClick}
                className={clsx(
                    'relative h-9 w-9 flex items-center justify-center rounded-xl transition-colors select-none',
                    active
                        ? 'bg-violet-100 text-violet-700'
                        : danger
                            ? 'bg-red-50 text-red-500 hover:bg-red-100'
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800',
                    className,
                )}
            >
                {icon}
            </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">{label}</TooltipContent>
    </Tooltip>
)