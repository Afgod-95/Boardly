import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { SWATCHES } from "../types/centerPanel.types"
import clsx from "clsx"

// ── Fill colour picker ────────────────────────────────────────────────────────
interface FillPickerProps {
    color: string
    onChange: (c: string) => void
    hasSelection: boolean
}

const FillPicker: React.FC<FillPickerProps> = ({ color, onChange, hasSelection }) => (
    <Tooltip>
        <Popover>
            <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                    <button
                        className="relative w-8 h-8 rounded-lg border-2 border-white shadow ring-1 ring-gray-200 shrink-0 transition-transform hover:scale-110"
                        style={{ backgroundColor: color }}
                        aria-label="Fill colour"
                    >
                        {hasSelection && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-violet-500 border-2 border-white" />
                        )}
                    </button>
                </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
                {hasSelection ? 'Change fill' : 'Default fill'}
            </TooltipContent>
            <PopoverContent side="top" className="w-52 p-3 rounded-2xl shadow-xl border-0">
                <p className="text-xs font-semibold text-gray-500 mb-2">Fill colour</p>
                <div className="grid grid-cols-6 gap-1.5 mb-3">
                    {SWATCHES.map((s) => (
                        <button
                            key={s}
                            onClick={() => onChange(s)}
                            className={clsx(
                                'w-6 h-6 rounded-md border-2 transition-transform hover:scale-110',
                                color === s ? 'border-violet-500 scale-110' : 'border-transparent'
                            )}
                            style={{ backgroundColor: s }}
                        />
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border border-gray-200"
                    />
                    <span className="text-xs text-gray-400 font-mono">{color}</span>
                </div>
            </PopoverContent>
        </Popover>
    </Tooltip>
)


export default FillPicker