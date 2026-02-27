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
} from '@dnd-kit/sortable'
import { Palette } from 'lucide-react'
import { Cutout } from '../types/types'
import { CutoutItem } from '../card/CutoutItem'
import { PinItem } from '@/types/pin'
import { FabricObject } from 'fabric'

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

const LeftPanel = ({
    activeObject, cutouts, setCutouts,
    canvasBg, onBgChange, onAddToCanvas, onReorder,
    onDeleteCutout, onSelectCutout,
}: LeftPanelProps) => {
    const [showBgPicker, setShowBgPicker] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 }
        })
    )

    const activeCutoutId = (activeObject as any)?.data?.cutoutId ?? null

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
        <div className="h-full flex flex-col p-5 gap-5 overflow-y-auto">

            {/* Cutouts Header */}
            <div className="space-y-0.5">
                <h2 className="font-bold text-sm">Cutouts</h2>
                <span className="text-gray-400 text-xs">Drag to reorder</span>
            </div>

            {/* Cutout list */}
            {cutouts.length === 0 ? (
                <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-200 rounded-xl">
                    <span className="text-gray-400 text-xs text-center">
                        No cutouts yet. Add pins from the right panel.
                    </span>
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={cutouts.map(getCutoutId)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-2">
                            {cutouts.map(cutout => (
                                <CutoutItem
                                    key={getCutoutId(cutout)}
                                    cutout={cutout}
                                    onDelete={onDeleteCutout}
                                    onAddToCanvas={onAddToCanvas}
                                    onSelect={onSelectCutout}
                                    isActive={getCutoutId(cutout) === activeCutoutId}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Background Picker */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <h2 className="font-bold text-sm">Background</h2>
                        <span className="text-gray-400 text-xs">Change canvas color</span>
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
                    <div className="grid grid-cols-4 gap-2">
                        {BACKGROUND_COLORS.map((color) => (
                            <button
                                key={color.label}
                                onClick={() => {
                                    onBgChange(color.value)
                                    setShowBgPicker(false)
                                }}
                                title={color.label}
                                className={`
                                    w-full aspect-square rounded-xl border-2 transition-all overflow-hidden
                                    ${canvasBg === color.value
                                        ? 'border-black scale-110'
                                        : 'border-gray-200 hover:border-gray-400'
                                    }
                                `}
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

                        <label
                            className="w-full aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-500 flex items-center justify-center cursor-pointer transition-colors"
                            title="Custom color"
                        >
                            <Palette size={14} className="text-gray-400" />
                            <input
                                type="color"
                                className="sr-only"
                                value={canvasBg}
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