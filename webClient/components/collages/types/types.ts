// types/types.ts
import { PinItem } from "@/types/pin"

export interface Cutout {
    pin?: PinItem
    shape?: {
        id: string | number
        type: 'text' | 'rect' | 'circle' | 'line'
        label: string
        thumbnail: string // base64
    }
}