import React from 'react'
import {
    Type, Trash2, ZoomIn, ZoomOut, Minus,
    Pencil, Scissors, Copy, MousePointer2,
    Square, Circle, ImagePlus,
} from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import clsx from 'clsx'
import { ToolMode } from '@/components/collages/types/centerPanel.types'
import { MobileBottomBarProps } from '../types/center.panel.types'
import { FillPicker } from '.'



const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
    toolMode, setToolMode,
    currentFill, isColorable,
    hasSelection, hasMultiSelection,
    onFillChange,
    onAddText, onAddRect, onAddCircle, onAddLine, onUploadClick,
    onZoomIn, onZoomOut,
    onDuplicate, onDelete,
}) => (
    <div className="flex items-center bg-white border-t w-full shrink-0">

        {/* Static left: mode tools */}
        <div className="flex items-center gap-1 px-2 py-2 shrink-0 border-r">
            {([
                { label: 'Select', icon: <MousePointer2 size={17} />, mode: 'select' as ToolMode },
                { label: 'Draw', icon: <Pencil size={17} />, mode: 'draw' as ToolMode },
                { label: 'Cut', icon: <Scissors size={17} />, mode: 'cut' as ToolMode },
            ]).map(({ label, icon, mode }) => (
                <Tooltip key={mode}>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            onClick={() => setToolMode(mode)}
                            className={clsx(
                                'h-9 w-9 flex items-center justify-center rounded-xl transition-colors',
                                toolMode === mode ? 'bg-violet-100 text-violet-700' : 'text-gray-500 hover:bg-gray-100'
                            )}
                        >
                            {icon}
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>{label}</TooltipContent>
                </Tooltip>
            ))}
        </div>

        {/* Scrollable centre: shape tools */}
        <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1 px-2 py-2 w-max">
                {([
                    { label: 'Text', icon: <Type size={17} />, fn: onAddText, cls: '' },
                    { label: 'Rect', icon: <Square size={17} />, fn: onAddRect, cls: '' },
                    { label: 'Circle', icon: <Circle size={17} />, fn: onAddCircle, cls: '' },
                    { label: 'Line', icon: <Minus size={17} />, fn: onAddLine, cls: '' },
                    { label: 'Image', icon: <ImagePlus size={17} />, fn: onUploadClick, cls: 'text-teal-600' },
                ]).map(({ label, icon, fn, cls }) => (
                    <Tooltip key={label}>
                        <TooltipTrigger asChild>
                            <button type="button" onClick={fn}
                                className={clsx(
                                    'h-9 w-9 flex items-center justify-center rounded-xl',
                                    'hover:bg-gray-100 transition-colors',
                                    cls || 'text-gray-500'
                                )}>
                                {icon}
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>{label}</TooltipContent>
                    </Tooltip>
                ))}
                <FillPicker color={currentFill} onChange={onFillChange} hasSelection={isColorable} />
            </div>
        </div>

        {/* Static right: zoom + selection actions */}
        <div className="flex items-center gap-1 px-2 py-2 shrink-0 border-l">
            <Tooltip><TooltipTrigger asChild>
                <button type="button" onClick={onZoomOut}
                    className="h-9 w-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100">
                    <ZoomOut size={17} />
                </button>
            </TooltipTrigger><TooltipContent>Zoom out</TooltipContent></Tooltip>

            <Tooltip><TooltipTrigger asChild>
                <button type="button" onClick={onZoomIn}
                    className="h-9 w-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100">
                    <ZoomIn size={17} />
                </button>
            </TooltipTrigger><TooltipContent>Zoom in</TooltipContent></Tooltip>

            {hasSelection && toolMode === 'select' && (
                <>
                    {!hasMultiSelection && (
                        <Tooltip><TooltipTrigger asChild>
                            <button type="button" onClick={onDuplicate}
                                className="h-9 w-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100">
                                <Copy size={17} />
                            </button>
                        </TooltipTrigger><TooltipContent>Duplicate</TooltipContent></Tooltip>
                    )}
                    <Tooltip><TooltipTrigger asChild>
                        <button type="button" onClick={onDelete}
                            className={clsx(
                                'h-9 w-9 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100',
                                hasMultiSelection && 'text-red-700'
                            )}>
                            <Trash2 size={17} />
                        </button>
                    </TooltipTrigger><TooltipContent>Delete</TooltipContent></Tooltip>
                </>
            )}
        </div>
    </div>
)

export default MobileBottomBar