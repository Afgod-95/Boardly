'use client'

import React from 'react'
import {
    Type, Bold, Italic, Underline,
    AlignLeft, AlignCenter, AlignRight,
} from 'lucide-react'
import {
    Tooltip, TooltipContent, TooltipTrigger,
} from '@/components/ui/tooltip'
import {
    Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover'
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import clsx from 'clsx'
import {
    ToolMode, ShapeType, TextControls,
    FONT_FAMILIES, FONT_SIZES, SWATCHES,
} from '../../../types/centerPanel.types'
import { Divider, ToolBtn } from './index'

// ── Text toolbar ──────────────────────────────────────────────────────────────
interface TextToolbarProps {
    controls: TextControls
    onChange: (patch: Partial<TextControls>) => void
}

const TextToolbar: React.FC<TextToolbarProps> = ({ controls, onChange }) => (
    <div className="flex items-center gap-1 px-3 py-1.5 bg-violet-50 border-b border-violet-100 flex-wrap">
        <span className="text-xs font-semibold text-violet-500 mr-1 shrink-0">Text</span>

        <Select value={controls.fontFamily} onValueChange={(v) => onChange({ fontFamily: v })}>
            <SelectTrigger className="h-7 w-36 text-xs border-violet-200 rounded-lg">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {FONT_FAMILIES.map((f) => (
                    <SelectItem key={f} value={f} style={{ fontFamily: f }} className="text-xs">{f}</SelectItem>
                ))}
            </SelectContent>
        </Select>

        <Select value={String(controls.fontSize)} onValueChange={(v) => onChange({ fontSize: Number(v) })}>
            <SelectTrigger className="h-7 w-16 text-xs border-violet-200 rounded-lg">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {FONT_SIZES.map((s) => (
                    <SelectItem key={s} value={String(s)} className="text-xs">{s}</SelectItem>
                ))}
            </SelectContent>
        </Select>

        <Divider />

        {([
            { key: 'bold' as const, icon: <Bold size={14} />, label: 'Bold (⌘B)' },
            { key: 'italic' as const, icon: <Italic size={14} />, label: 'Italic (⌘I)' },
            { key: 'underline' as const, icon: <Underline size={14} />, label: 'Underline (⌘U)' },
        ]).map(({ key, icon, label }) => (
            <Tooltip key={key}>
                <TooltipTrigger asChild>
                    <button
                        onClick={() => onChange({ [key]: !controls[key] })}
                        className={clsx(
                            'p-1.5 rounded-md transition-colors',
                            controls[key] ? 'bg-violet-200 text-violet-800' : 'hover:bg-violet-100'
                        )}
                    >
                        {icon}
                    </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">{label}</TooltipContent>
            </Tooltip>
        ))}

        <Divider />

        {(['left', 'center', 'right'] as const).map((align) => {
            const Icon = align === 'left' ? AlignLeft : align === 'center' ? AlignCenter : AlignRight
            return (
                <Tooltip key={align}>
                    <TooltipTrigger asChild>
                        <button
                            onClick={() => onChange({ textAlign: align })}
                            className={clsx(
                                'p-1.5 rounded-md transition-colors',
                                controls.textAlign === align ? 'bg-violet-200 text-violet-800' : 'hover:bg-violet-100'
                            )}
                        >
                            <Icon size={14} />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">Align {align}</TooltipContent>
                </Tooltip>
            )
        })}

        <Divider />

        <Tooltip>
            <Popover>
                <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                        <button className="flex flex-col items-center justify-center w-7 h-7 rounded-md hover:bg-violet-100" aria-label="Text colour">
                            <Type size={13} />
                            <span className="w-4 h-1 rounded-full mt-0.5" style={{ backgroundColor: controls.fill }} />
                        </button>
                    </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">Text colour</TooltipContent>
                <PopoverContent side="bottom" className="w-52 p-3 rounded-2xl shadow-xl border-0">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Text colour</p>
                    <div className="grid grid-cols-6 gap-1.5 mb-3">
                        {SWATCHES.map((s) => (
                            <button
                                key={s}
                                onClick={() => onChange({ fill: s })}
                                className={clsx(
                                    'w-6 h-6 rounded-md border-2 transition-transform hover:scale-110',
                                    controls.fill === s ? 'border-violet-500 scale-110' : 'border-transparent'
                                )}
                                style={{ backgroundColor: s }}
                            />
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={controls.fill}
                            onChange={(e) => onChange({ fill: e.target.value })}
                            className="w-8 h-8 rounded cursor-pointer border border-gray-200"
                        />
                        <span className="text-xs text-gray-400 font-mono">{controls.fill}</span>
                    </div>
                </PopoverContent>
            </Popover>
        </Tooltip>
    </div>
)

export default TextToolbar