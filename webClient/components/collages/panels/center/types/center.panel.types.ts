
import * as fabric from 'fabric'
import { Cutout } from '@/components/collages/types/cutout.types'
import { ToolMode } from '@/components/collages/types/centerPanel.types'

export interface CenterPanelProps {
    fabricRef: React.RefObject<fabric.Canvas | null>
    activeObject: fabric.Object | null
    setActiveObject: React.Dispatch<React.SetStateAction<fabric.Object | null>>
    canvasBg: string
    cutouts: Cutout[]
    setCutouts: React.Dispatch<React.SetStateAction<Cutout[]>>
    onSaveHistory: () => void
    onDeleteCutout: (id: string | number) => void
    onUpdateCutout: (id: string | number, thumbnail: string, label?: string) => void
}



export interface DesktopSidebarProps {
    toolMode: ToolMode
    setToolMode: (mode: ToolMode) => void
    currentFill: string
    isColorable: boolean
    hasSelection: boolean
    hasMultiSelection: boolean
    onFillChange: (color: string) => void
    onAddText: () => void
    onAddRect: () => void
    onAddCircle: () => void
    onAddLine: () => void
    onUploadClick: () => void
    onZoomIn: () => void
    onZoomOut: () => void
    onDuplicate: () => void
    onDelete: () => void
}


export interface MobileBottomBarProps {
    toolMode: ToolMode
    setToolMode: (mode: ToolMode) => void
    currentFill: string
    isColorable: boolean
    hasSelection: boolean
    hasMultiSelection: boolean
    onFillChange: (color: string) => void
    onAddText: () => void
    onAddRect: () => void
    onAddCircle: () => void
    onAddLine: () => void
    onUploadClick: () => void
    onZoomIn: () => void
    onZoomOut: () => void
    onDuplicate: () => void
    onDelete: () => void
}