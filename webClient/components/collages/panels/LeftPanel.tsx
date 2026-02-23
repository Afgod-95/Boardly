'use client'

import React, { useEffect, useState } from 'react'
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
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, Palette, Plus } from 'lucide-react'
import { Cutout } from '../types/types'
import { CutoutItem } from '../card/CutoutItem'



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


// ── Types ──
interface LeftPanelProps {
    cutouts: Cutout[]
    setCutouts: React.Dispatch<React.SetStateAction<Cutout[]>>
    canvasBg: string
    onBgChange: (color: string) => void
    onAddToCanvas: (imageUrl: string) => void
}




// ── Main LeftPanel ──
const LeftPanel = ({ cutouts, setCutouts, canvasBg, onBgChange, onAddToCanvas }: LeftPanelProps) => {
    const [showBgPicker, setShowBgPicker] = useState(false)

    const sensors = useSensors(useSensor(PointerSensor))

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return
        setCutouts((items) => {
            const oldIndex = items.findIndex(i => i.id === active.id)
            const newIndex = items.findIndex(i => i.id === over.id)
            return arrayMove(items, oldIndex, newIndex)
        })
    }

    const handleDelete = (id: string) => {
        setCutouts(prev => prev.filter(c => c.id !== id))
    }

    const handleAddCutout = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const url = URL.createObjectURL(file)
        const newCutout: Cutout = {
            id: Date.now().toString(),
            name: file.name.replace(/\.[^/.]+$/, ''), // remove extension
            imageUrl: url,
        }
        setCutouts(prev => [...prev, newCutout])
    }


    return (
        <div className="h-full flex flex-col p-5 gap-5 overflow-y-auto">

            {/* Cutouts Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <h2 className="font-bold text-sm">Cutouts</h2>
                    <span className="text-gray-400 text-xs">
                        Drag to reorder
                    </span>
                </div>

                {/* Add cutout button */}
                <label className="cursor-pointer">
                    <div className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                        <Plus size={16} className="text-gray-600" />
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAddCutout}
                    />
                </label>
            </div>

            {/* Cutout list */}
            {cutouts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-200 rounded-xl gap-2">
                    <span className="text-gray-400 text-xs text-center">
                        No cutouts yet.{' '}
                        <label className="text-violet-600 cursor-pointer underline">
                            Add one
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAddCutout}
                            />
                        </label>
                    </span>
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={cutouts.map(c => c.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-2">
                            {cutouts.map(cutout => (
                                <CutoutItem
                                    key={cutout.id}
                                    cutout={cutout}
                                    onDelete={handleDelete}
                                    onAddToCanvas={onAddToCanvas}
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
                        <span className="text-gray-400 text-xs">
                            Change canvas color
                        </span>
                    </div>

                    {/* Color preview toggle */}
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

                {/* Color swatches */}
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

                        {/* Custom color */}
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