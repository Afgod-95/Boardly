
import { useSortable } from '@dnd-kit/sortable'
import { GripVertical, Trash2 } from 'lucide-react'
import { CSS } from '@dnd-kit/utilities'
import { Cutout } from '../types/types'


interface CutoutItemProps {
    cutout: Cutout
    onDelete: (id: string) => void
    onAddToCanvas: (imageUrl: string) => void  // new
}



// ── Single draggable cutout ──
export function CutoutItem({ cutout, onDelete, onAddToCanvas }: CutoutItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: cutout.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
            flex items-center gap-3 p-3 bg-white rounded-xl
            border border-gray-100 group select-none
            transition-shadow duration-200
            ${isDragging ? 'shadow-2xl border-gray-300 z-50' : 'hover:shadow-md'}
            `}
        >
            {/* Drag handle */}
            <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 shrink-0"
            >
                <GripVertical size={18} />
            </button>

            {/* Thumbnail */}
            <img
                src={cutout.imageUrl}
                alt={cutout.name}
            onClick={() => onAddToCanvas(cutout.imageUrl)}
            className="w-10 h-10 rounded-lg object-cover shrink-0 bg-gray-100"
        />

            {/* Name */}
            <span className="flex-1 text-sm font-medium truncate">
                {cutout.name}
            </span>

            {/* Delete */}
            <button
                onClick={(e) => {
                    e.stopPropagation()
                    onDelete(cutout.id)
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600 shrink-0"
            >
                <Trash2 size={16} />
            </button>
        </div>
    )
}
