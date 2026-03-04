'use client'

import React, { useState } from 'react'
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Palette, Trash2, Image as ImageIcon } from 'lucide-react'
import { Cutout } from '../../types/cutout.types'
import { PinItem } from '@/types/pin'
import { FabricObject } from 'fabric'
import clsx from 'clsx'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface LeftPanelProps {
    cutouts: Cutout[]
    setCutouts: React.Dispatch<React.SetStateAction<Cutout[]>>
    canvasBg: string
    onBgChange: (color: string) => void
    onAddToCanvas: (pin: PinItem) => void
    onReorder?: (cutouts: Cutout[]) => void
    activeObject: FabricObject | null
    onDeleteCutout: (id: string | number) => void
    onSelectCutout: (id: string | number) => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const BACKGROUND_COLORS = [
    { label: 'Default', value: '', isDotted: true },
    { label: 'White', value: '#ffffff' },
    { label: 'Black', value: '#000000' },
    { label: 'Gray', value: '#f3f4f6' },
    { label: 'Beige', value: '#f5f0e8' },
    { label: 'Navy', value: '#1a1a2e' },
    { label: 'Rose', value: '#ffe4e6' },
    { label: 'Sky', value: '#e0f2fe' },
    { label: 'Mint', value: '#d1fae5' },
]

const getCutoutId = (c: Cutout): string | number => c.pin?.id ?? c.shape?.id!

const getCutoutLabel = (c: Cutout): string => {
    if (c.pin) return c.pin.title ?? 'Pin'
    if (c.shape) return c.shape.label ?? c.shape.type ?? 'Shape'
    return 'Item'
}

const getCutoutThumbnail = (c: Cutout): string | undefined => {
    if (c.pin) return c.pin.img
    if (c.shape) return c.shape.thumbnail
    return undefined
}

// ─────────────────────────────────────────────────────────────────────────────
// Sortable cutout row — entire card is the drag surface
// ─────────────────────────────────────────────────────────────────────────────
interface CutoutRowProps {
    cutout: Cutout
    isActive: boolean
    onDelete: (id: string | number) => void
    onSelect: (id: string | number) => void
}

const CutoutRow: React.FC<CutoutRowProps> = ({ cutout, isActive, onDelete, onSelect }) => {
    const id = getCutoutId(cutout)
    const label = getCutoutLabel(cutout)
    const thumbnail = getCutoutThumbnail(cutout)

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        // Elevate dragging card visually
        zIndex: isDragging ? 50 : undefined,
        position: isDragging ? 'relative' : undefined,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            // Spread drag listeners on the whole card
            {...attributes}
            {...listeners}
            onClick={() => onSelect(id)}
            className={clsx(
                'flex items-center gap-2 px-2 py-2 rounded-xl transition-all group',
                'cursor-grab active:cursor-grabbing select-none',
                isDragging && 'shadow-xl ring-2 ring-violet-300 bg-white',
                isActive && !isDragging
                    ? 'bg-violet-50 ring-1 ring-violet-300'
                    : !isDragging && 'hover:bg-gray-50'
            )}
        >
            {/* Thumbnail */}
            <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-gray-100 bg-gray-100 flex items-center justify-center pointer-events-none">
                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt={label}
                        className="w-full h-full object-cover"
                        draggable={false}
                    />
                ) : (
                    <ImageIcon size={14} className="text-gray-400" />
                )}
            </div>

            {/* Label */}
            <span className={clsx(
                'flex-1 text-xs font-medium truncate pointer-events-none',
                isActive ? 'text-violet-700' : 'text-gray-700'
            )}>
                {label}
            </span>

            {/* Delete — stop drag events from propagating so click still fires */}
            <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); onDelete(id) }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 shrink-0"
            >
                <Trash2 size={13} />
            </button>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// LeftPanel
// ─────────────────────────────────────────────────────────────────────────────
const LeftPanel: React.FC<LeftPanelProps> = ({
    activeObject,
    cutouts,
    setCutouts,
    canvasBg,
    onBgChange,
    onAddToCanvas,
    onReorder,
    onDeleteCutout,
    onSelectCutout,
}) => {
    const [showBgPicker, setShowBgPicker] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            // Require 6px of movement before drag starts so click still fires
            activationConstraint: { distance: 6 },
        })
    )

    const activeCutoutId: string | number | null =
        (activeObject as any)?.data?.cutoutId ?? null

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return
        setCutouts((items) => {
            const oldIndex = items.findIndex(i => getCutoutId(i) === active.id)
            const newIndex = items.findIndex(i => getCutoutId(i) === over.id)
            const reordered = arrayMove(items, oldIndex, newIndex)
            onReorder?.(reordered)
            return reordered
        })
    }

    return (
        <div className="h-full flex flex-col p-4 gap-4 overflow-y-hidden">

            {/* ── Layers ───────────────────────────────────────────────────── */}
            <div>
                <div className="flex items-center justify-between mb-1">
                    <h2 className="font-bold text-sm">Layers</h2>
                    <span className="text-gray-400 text-xs">
                        {cutouts.length} item{cutouts.length !== 1 ? 's' : ''}
                    </span>
                </div>
                <p className="text-gray-400 text-xs mb-3">Drag to reorder · click to select</p>

                {cutouts.length === 0 ? (
                    <div className="flex items-center justify-center h-24 border-2 border-dashed border-gray-200 rounded-xl">
                        <span className="text-gray-400 text-xs text-center px-4">
                            No layers yet. Add pins from the right panel.
                        </span>
                    </div>
                ) : (
                    <div className='overflow-y-scroll max-h-[calc(100vh-200px)] p-1 collage-scrollbar'>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={cutouts.map(getCutoutId)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-1">
                                    {cutouts.map(cutout => (
                                        <CutoutRow
                                            key={getCutoutId(cutout)}
                                            cutout={cutout}
                                            isActive={getCutoutId(cutout) === activeCutoutId}
                                            onDelete={onDeleteCutout}
                                            onSelect={onSelectCutout}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>

                )}
            </div>

            <div className="border-t" />

            {/* ── Background ───────────────────────────────────────────────── */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-bold text-sm">Background</h2>
                        <p className="text-gray-400 text-xs">Canvas colour</p>
                    </div>
                    <button
                        onClick={() => setShowBgPicker(!showBgPicker)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-gray-400 transition-colors"
                    >
                        <div
                            className="w-4 h-4 rounded-full border border-gray-200 overflow-hidden"
                            style={
                                !canvasBg
                                    ? {
                                        backgroundColor: '#f8f8f8',
                                        backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
                                        backgroundSize: '4px 4px',
                                    }
                                    : { backgroundColor: canvasBg }
                            }
                        />
                        <Palette size={14} className="text-gray-500" />
                    </button>
                </div>

                {showBgPicker && (
                    <div className="grid grid-cols-5 gap-2">
                        {BACKGROUND_COLORS.map((color) => (
                            <button
                                key={color.label}
                                onClick={() => { onBgChange(color.value); setShowBgPicker(false) }}
                                title={color.label}
                                className={clsx(
                                    'w-full aspect-square rounded-xl border-2 transition-all overflow-hidden',
                                    canvasBg === color.value
                                        ? 'border-violet-500 scale-110 shadow-md'
                                        : 'border-gray-200 hover:border-gray-400'
                                )}
                                style={
                                    color.isDotted
                                        ? {
                                            backgroundColor: '#f8f8f8',
                                            backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
                                            backgroundSize: '6px 6px',
                                        }
                                        : { backgroundColor: color.value }
                                }
                            />
                        ))}

                        {/* Custom colour */}
                        <label
                            className="w-full aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-500 flex items-center justify-center cursor-pointer transition-colors"
                            title="Custom color"
                        >
                            <Palette size={14} className="text-gray-400" />
                            <input
                                type="color"
                                className="sr-only"
                                value={canvasBg || '#ffffff'}
                                onChange={(e) => onBgChange(e.target.value)}
                            />
                        </label>
                    </div>
                )}
            </div>
        </div>
    )
}

export default LeftPanel