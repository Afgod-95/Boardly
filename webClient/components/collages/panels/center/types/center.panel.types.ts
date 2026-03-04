
import * as fabric from 'fabric'
import { Cutout } from '@/components/collages/types/cutout.types'

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