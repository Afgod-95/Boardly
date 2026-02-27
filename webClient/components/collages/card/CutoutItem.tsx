import { useSortable } from '@dnd-kit/sortable'
import { Trash2, Type, Square, Circle, Minus } from 'lucide-react'
import { CSS } from '@dnd-kit/utilities'
import { Cutout } from '../types/types'
import { PinItem } from '@/types/pin'

interface CutoutItemProps {
    cutout: Cutout
    onDelete: (id: string | number) => void
    onAddToCanvas: (pin: PinItem) => void
    onSelect: (id: string | number) => void
    isActive?: boolean
}

const shapeIcon = (type: string) => {
    switch (type) {
        case 'text': return <Type size={18} className="text-gray-500" />
        case 'rect': return <Square size={18} className="text-violet-500" />
        case 'circle': return <Circle size={18} className="text-violet-500" />
        case 'line': return <Minus size={18} className="text-gray-500" />
        default: return <Square size={18} className="text-gray-400" />
    }
}

export function CutoutItem({ cutout, onDelete, onAddToCanvas, onSelect, isActive }: CutoutItemProps) {
    const id = cutout.pin?.id ?? cutout.shape?.id!

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onSelect(id)}
            className={`
                flex items-center gap-3 p-3 rounded-xl
                border group select-none
                cursor-grab active:cursor-grabbing
                transition-all duration-200
                ${isActive
                    ? 'bg-violet-50 border-violet-400 shadow-md'
                    : 'bg-white border-gray-100 hover:shadow-md'
                }
                ${isDragging ? 'shadow-2xl border-gray-300 z-50 opacity-50' : ''}
            `}
        >
            {/* Thumbnail — image for pins, generated thumbnail or icon for shapes */}
            {cutout.pin ? (
                <img
                    src={cutout.pin.img}
                    alt={cutout.pin.title}
                    className="w-10 h-10 rounded-lg object-cover shrink-0 bg-gray-100"
                />
            ) : cutout.shape?.thumbnail ? (
                <img
                    src={cutout.shape.thumbnail}
                    alt={cutout.shape.label}
                    className="w-10 h-10 rounded-lg object-cover shrink-0 bg-gray-100"
                />
            ) : (
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    {shapeIcon(cutout.shape?.type ?? '')}
                </div>
            )}

            {/* Label */}
            <span className="flex-1 text-sm font-medium truncate">
                {cutout.pin?.title ?? cutout.shape?.label ?? 'Shape'}
            </span>

            {/* Delete */}
            <button
                onClick={(e) => {
                    e.stopPropagation()
                    onDelete(id)
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600 shrink-0"
            >
                <Trash2 size={16} />
            </button>
        </div>
    )
}