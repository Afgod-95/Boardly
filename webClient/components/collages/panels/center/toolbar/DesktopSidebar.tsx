import React from 'react'
import {
    Type, Trash2, ZoomIn, ZoomOut, Minus,
    Pencil, Scissors, Copy, MousePointer2,
    Square, Circle, ImagePlus,
} from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import { SideToolBtn } from './SideToolBtn'
import { ToolMode } from '@/components/collages/types/centerPanel.types'
import { FillPicker } from '.'
import { VSeparator } from './Separator'
import { DesktopSidebarProps } from '../types/center.panel.types'

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
    toolMode, setToolMode,
    currentFill, isColorable,
    hasSelection, hasMultiSelection,
    onFillChange,
    onAddText, onAddRect, onAddCircle, onAddLine, onUploadClick,
    onZoomIn, onZoomOut,
    onDuplicate, onDelete,
}) => (
    <div className="flex flex-col h-full w-12 border-r bg-white shrink-0 py-3 px-1.5 gap-0.5 shadow-sm">

        {/* Group 1 — Mode tools */}
        <SideToolBtn label="Select (V)" icon={<MousePointer2 size={17} />}
            onClick={() => setToolMode('select')} active={toolMode === 'select'} />
        <SideToolBtn label="Draw (D)" icon={<Pencil size={17} />}
            onClick={() => setToolMode('draw')} active={toolMode === 'draw'} />
        <SideToolBtn label="Cut (X)" icon={<Scissors size={17} />}
            onClick={() => setToolMode('cut')} active={toolMode === 'cut'} />

        <VSeparator />

        {/* Group 2 — Add shapes */}
        <SideToolBtn label="Add Text (T)" icon={<Type size={17} />} onClick={onAddText} />
        <SideToolBtn label="Rectangle" icon={<Square size={17} />} onClick={onAddRect} />
        <SideToolBtn label="Circle" icon={<Circle size={17} />} onClick={onAddCircle} />
        <SideToolBtn label="Line" icon={<Minus size={17} />} onClick={onAddLine} />
        <SideToolBtn label="Upload Image" icon={<ImagePlus size={17} />}
            onClick={onUploadClick} className="text-teal-600 hover:bg-teal-50" />

        {/* Fill picker */}
        <Tooltip>
            <TooltipTrigger asChild>
                <div className={clsx("h-9 w-9 flex items-center justify-center rounded-xl",
                    "hover:bg-gray-100 transition-colors cursor-pointer")}>
                    <FillPicker color={currentFill} onChange={onFillChange} hasSelection={isColorable} />
                </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">Fill colour</TooltipContent>
        </Tooltip>

        <VSeparator />

        {/* Group 3 — Zoom */}
        <SideToolBtn label="Zoom Out (⌘−)" icon={<ZoomOut size={17} />} onClick={onZoomOut} />
        <SideToolBtn label="Zoom In (⌘+)" icon={<ZoomIn size={17} />} onClick={onZoomIn} />

        {/* Group 4 — Selection actions */}
        <AnimatePresence initial={false}>
            {hasSelection && toolMode === 'select' && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col gap-0.5 overflow-hidden"
                >
                    <VSeparator />
                    {!hasMultiSelection && (
                        <SideToolBtn label="Duplicate (⌘D)" icon={<Copy size={17} />} onClick={onDuplicate} />
                    )}
                    <SideToolBtn
                        label={hasMultiSelection ? 'Delete selected' : 'Delete (⌫)'}
                        icon={<Trash2 size={17} />}
                        onClick={onDelete}
                        danger
                    />
                </motion.div>
            )}
        </AnimatePresence>

        {/* Mode hint */}
        <AnimatePresence>
            {toolMode !== 'select' && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={clsx(
                                'mt-auto h-9 w-9 flex items-center justify-center rounded-xl animate-pulse',
                                toolMode === 'draw' ? 'bg-violet-50 text-violet-500' : 'bg-red-50 text-red-400'
                            )}
                        >
                            {toolMode === 'draw' ? <Pencil size={14} /> : <Scissors size={14} />}
                        </motion.div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="text-xs">
                        {toolMode === 'draw' ? 'Click & drag to draw' : 'Click any object to remove it'}
                    </TooltipContent>
                </Tooltip>
            )}
        </AnimatePresence>
    </div>
)

export default DesktopSidebar