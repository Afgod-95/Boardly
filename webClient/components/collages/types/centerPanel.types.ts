// centerPanel.types.ts

export type ToolMode = 'select' | 'draw' | 'cut'

export type ShapeType = 'text' | 'rect' | 'circle' | 'line' | 'path' | 'image'

export interface TextControls {
    fontSize: number
    fontFamily: string
    bold: boolean
    italic: boolean
    underline: boolean
    textAlign: 'left' | 'center' | 'right'
    fill: string
}

export const FONT_FAMILIES = [
    'Arial', 'Georgia', 'Times New Roman', 'Courier New',
    'Verdana', 'Trebuchet MS', 'Impact', 'Comic Sans MS',
    'Palatino', 'Garamond',
]

export const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72, 96]

export const SWATCHES = [
    '#111111', '#ffffff', '#ef4444', '#f97316',
    '#eab308', '#22c55e', '#3b82f6', '#8b5cf6',
    '#ec4899', '#6d28d9', '#0ea5e9', '#14b8a6',
]