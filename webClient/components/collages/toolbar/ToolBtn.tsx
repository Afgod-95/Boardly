import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import CustomButton from "@/components/shared/buttons/CustomButton"
import { clsx } from "clsx"
// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────
interface ToolBtnProps {
    label: string
    icon: React.ReactNode
    onClick: () => void
    active?: boolean
    className?: string
    disabled?: boolean
}

const ToolBtn: React.FC<ToolBtnProps> = ({ label, icon, onClick, active, className, disabled }) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <div>
                <CustomButton
                    icon={icon}
                    onClick={onClick}
                    disabled={disabled}
                    className={clsx(
                        className,
                        'p-3 hover:bg-accent transition-all animated duration-200',
                        active && 'bg-violet-100 text-violet-700 ring-1 ring-violet-300',
                        disabled && 'opacity-40 cursor-not-allowed'
                    )}
                />
            </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">{label}</TooltipContent>
    </Tooltip>
)

export default ToolBtn