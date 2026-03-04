import * as fabric from 'fabric'
import { CenterPanelProps } from '../types/center.panel.types'

// Helpers
// ─────────────────────────────────────────────────────────────────────────────
export const FALLBACK =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

export const generateShapeThumbnail = async (obj: fabric.Object): Promise<string> => {
    try {
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = 80
        tempCanvas.height = 80
        const fc = new fabric.StaticCanvas(tempCanvas, { width: 80, height: 80 })
        const cloned = await obj.clone()
        cloned.scaleToWidth(60)
        cloned.set({ left: 40, top: 40, originX: 'center', originY: 'center' })
        fc.add(cloned)
        fc.renderAll()
        const dataUrl = tempCanvas.toDataURL()
        fc.dispose()
        return dataUrl
    } catch {
        return FALLBACK
    }
}

export const refreshCutout = async (
    obj: fabric.Object,
    onUpdateCutout: CenterPanelProps['onUpdateCutout']
): Promise<void> => {
    const cutoutId: string | number | undefined = (obj as any).data?.cutoutId
    if (!cutoutId) return
    const thumbnail = await generateShapeThumbnail(obj)
    const label =
        obj.type === 'textbox' || obj.type === 'text'
            ? ((obj as fabric.Textbox).text?.slice(0, 24) ?? 'Text')
            : undefined
    onUpdateCutout(cutoutId, thumbnail, label)
}

export const isTextObject = (obj: fabric.Object | null): obj is fabric.Textbox =>
    !!obj && (obj.type === 'textbox' || obj.type === 'text')

export const isColorableObject = (obj: fabric.Object | null): boolean =>
    !!obj && ['rect', 'circle', 'textbox', 'text', 'path'].includes(obj.type ?? '')
