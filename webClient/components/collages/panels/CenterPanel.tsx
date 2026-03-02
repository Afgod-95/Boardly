'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import * as fabric from 'fabric'
import {
    Type, Trash2, ZoomIn, ZoomOut, Minus,
    Pencil, Scissors, Copy, MousePointer2,
    Square, Circle, ImagePlus,
} from 'lucide-react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Cutout } from '../types/cutout.types'
import { useMediaQuery } from 'react-responsive'
import clsx from 'clsx'
import {
    ToolMode, ShapeType, TextControls,
} from '../types/centerPanel.types'
import { TextToolbar, Divider, ToolBtn, FillPicker } from '../toolbar'

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────
interface CenterPanelProps {
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

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates an 80×80 thumbnail data URL from a fabric object.
 *
 * Tainted canvas guard: images loaded from external URLs (Pinterest CDN, etc.)
 * without crossOrigin="anonymous" will throw a SecurityError on toDataURL.
 * We wrap the call in try/catch and return a transparent 1×1 PNG fallback so
 * the rest of the app never crashes. The image still renders fine on the main
 * canvas — only the tiny layer-panel thumbnail is affected for cross-origin images.
 */
const generateShapeThumbnail = async (obj: fabric.Object): Promise<string> => {
    // Transparent 1×1 PNG — safe fallback for tainted canvases
    const FALLBACK =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

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
        // This throws SecurityError for tainted canvases (cross-origin images)
        const dataUrl = tempCanvas.toDataURL()
        fc.dispose()
        return dataUrl
    } catch {
        return FALLBACK
    }
}

const refreshCutout = async (
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

const isTextObject = (obj: fabric.Object | null): obj is fabric.Textbox =>
    !!obj && (obj.type === 'textbox' || obj.type === 'text')

const isColorableObject = (obj: fabric.Object | null): boolean =>
    !!obj && ['rect', 'circle', 'textbox', 'text', 'path'].includes(obj.type ?? '')

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
const CenterPanel: React.FC<CenterPanelProps> = ({
    fabricRef,
    activeObject,
    setActiveObject,
    canvasBg,
    setCutouts,
    onSaveHistory,
    onDeleteCutout,
    onUpdateCutout,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const imageInputRef = useRef<HTMLInputElement>(null)

    const [toolMode, setToolMode] = useState<ToolMode>('select')
    const [shapeFill, setShapeFill] = useState<string>('#6d28d9')
    const [textControls, setTextControls] = useState<TextControls>({
        fontSize: 24,
        fontFamily: 'Arial',
        bold: false,
        italic: false,
        underline: false,
        textAlign: 'left',
        fill: '#111111',
    })

    const isMobile = useMediaQuery({ maxWidth: 767 })
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 })
    const isCompact = isMobile || isTablet

    const isTextSelected = isTextObject(activeObject)
    const isColorable = isColorableObject(activeObject)
    const currentFill = isColorable
        ? ((activeObject as any).fill as string ?? shapeFill)
        : shapeFill

    const toolModeRef = useRef<ToolMode>(toolMode)
    const activeObjectRef = useRef<fabric.Object | null>(activeObject)
    const textControlsRef = useRef<TextControls>(textControls)
    useEffect(() => { toolModeRef.current = toolMode }, [toolMode])
    useEffect(() => { activeObjectRef.current = activeObject }, [activeObject])
    useEffect(() => { textControlsRef.current = textControls }, [textControls])

    // ── Sync text controls ───────────────────────────────────────────────────
    const syncTextControls = useCallback((obj: fabric.Textbox) => {
        setTextControls({
            fontSize: (obj.fontSize as number) ?? 24,
            fontFamily: (obj.fontFamily as string) ?? 'Arial',
            bold: obj.fontWeight === 'bold',
            italic: obj.fontStyle === 'italic',
            underline: obj.underline ?? false,
            textAlign: (obj.textAlign as TextControls['textAlign']) ?? 'left',
            fill: (obj.fill as string) ?? '#111111',
        })
    }, [])

    // ── addShapeToCutouts ────────────────────────────────────────────────────
    const addShapeToCutouts = useCallback(async (
        obj: fabric.Object,
        type: ShapeType,
        label: string
    ): Promise<void> => {
        const id: string | number = (obj as any).data?.cutoutId
        const thumbnail = await generateShapeThumbnail(obj)
        setCutouts((prev: any) => [...prev, { shape: { id, type, label, thumbnail } }])
    }, [setCutouts])

    // ── Canvas init ──────────────────────────────────────────────────────────
    useEffect(() => {
        if (!canvasRef.current) return
        const canvas = new fabric.Canvas(canvasRef.current, {
            width: 600,
            height: 600,
            backgroundColor: canvasBg,
            preserveObjectStacking: true,
        })
        fabricRef.current = canvas

        canvas.on('selection:created', (e: any) => {
            const obj = e.selected?.[0] as fabric.Object
            if (!obj) return
            setActiveObject(obj)
            if (isTextObject(obj)) syncTextControls(obj)
        })
        canvas.on('selection:updated', (e: any) => {
            const obj = e.selected?.[0] as fabric.Object
            if (!obj) return
            setActiveObject(obj)
            if (isTextObject(obj)) syncTextControls(obj)
        })
        canvas.on('selection:cleared', () => setActiveObject(null))

        canvas.on('object:modified', async (e: any) => {
            onSaveHistory()
            const obj = e.target as fabric.Object
            if (obj) await refreshCutout(obj, onUpdateCutout)
        })
        canvas.on('object:added', () => onSaveHistory())
        canvas.on('object:removed', () => onSaveHistory())

        canvas.on('text:changed', async (e: any) => {
            const obj = e.target as fabric.Textbox
            if (!obj) return
            syncTextControls(obj)
            await refreshCutout(obj, onUpdateCutout)
        })

        canvas.on('path:created', async (e: any) => {
            const path = e.path as fabric.Path
            if (!path) return
            const id = Date.now()
            path.set({ data: { cutoutId: id } })
            canvas.renderAll()
            const thumbnail = await generateShapeThumbnail(path)
            setCutouts((prev: any) => [...prev, { shape: { id, type: 'path', label: 'Drawing', thumbnail } }])
            onSaveHistory()
        })

        return () => { canvas.dispose(); fabricRef.current = null }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // ── Background sync ──────────────────────────────────────────────────────
    useEffect(() => {
        if (!fabricRef.current) return
        fabricRef.current.backgroundColor = canvasBg
        fabricRef.current.renderAll()
    }, [canvasBg])

    // ── Tool mode ────────────────────────────────────────────────────────────
    useEffect(() => {
        const canvas = fabricRef.current
        if (!canvas) return

        if (toolMode === 'draw') {
            canvas.isDrawingMode = true
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas)
            canvas.freeDrawingBrush.color = '#111111'
            canvas.freeDrawingBrush.width = 3
        } else {
            canvas.isDrawingMode = false
        }

        canvas.selection = toolMode === 'select'
        canvas.getObjects().forEach((obj) => {
            obj.selectable = toolMode === 'select'
            obj.evented = toolMode !== 'draw'
        })
        canvas.renderAll()
    }, [toolMode])

    // ── Cut mode ─────────────────────────────────────────────────────────────
    useEffect(() => {
        const canvas = fabricRef.current
        if (!canvas) return

        const handleCut = (e: any) => {
            if (toolModeRef.current !== 'cut') return
            const target: fabric.Object | undefined = e.target
            if (!target) return
            e.e?.stopPropagation?.()
            const cutoutId: string | number | undefined = (target as any).data?.cutoutId
            if (cutoutId) {
                onDeleteCutout(cutoutId)
            } else {
                canvas.remove(target)
                canvas.discardActiveObject()
                canvas.renderAll()
                setActiveObject(null)
            }
            onSaveHistory()
        }

        canvas.on('mouse:down:before', handleCut)
        return () => { canvas.off('mouse:down:before', handleCut) }
    }, [onDeleteCutout, onSaveHistory])

    // ── Delete ───────────────────────────────────────────────────────────────
    const handleDelete = useCallback((): void => {
        const canvas = fabricRef.current
        if (!canvas) return
        const active = canvas.getActiveObject()
        if (!active) return

        const targets: fabric.Object[] =
            (active as any).type === 'activeselection'
                ? (active as fabric.ActiveSelection).getObjects()
                : [active]

        targets.forEach((obj) => {
            const cutoutId: string | number | undefined = (obj as any).data?.cutoutId
            if (cutoutId) onDeleteCutout(cutoutId)
            canvas.remove(obj)
        })

        canvas.discardActiveObject()
        canvas.renderAll()
        setActiveObject(null)
        onSaveHistory()
    }, [onDeleteCutout, onSaveHistory])

    // ── Duplicate ────────────────────────────────────────────────────────────
    const handleDuplicate = useCallback(async (): Promise<void> => {
        const canvas = fabricRef.current
        const obj = activeObjectRef.current
        if (!canvas || !obj) return

        const cloned = await obj.clone()
        const newId = Date.now()
        cloned.set({
            left: (obj.left ?? 0) + 20,
            top: (obj.top ?? 0) + 20,
            data: { cutoutId: newId },
        })
        canvas.add(cloned)
        canvas.setActiveObject(cloned)
        canvas.renderAll()
        const origType = (obj as any).type as ShapeType
        if (origType) await addShapeToCutouts(cloned, origType, `${origType} copy`)
    }, [addShapeToCutouts])

    // ── Text controls ────────────────────────────────────────────────────────
    const handleTextControlChange = useCallback(async (patch: Partial<TextControls>) => {
        const canvas = fabricRef.current
        const obj = activeObjectRef.current
        if (!canvas || !obj || !isTextObject(obj)) return

        const updated: TextControls = { ...textControlsRef.current, ...patch }
        setTextControls(updated)

        obj.set({
            fontSize: updated.fontSize,
            fontFamily: updated.fontFamily,
            fontWeight: updated.bold ? 'bold' : 'normal',
            fontStyle: updated.italic ? 'italic' : 'normal',
            underline: updated.underline,
            textAlign: updated.textAlign,
            fill: updated.fill,
        })
        canvas.renderAll()
        onSaveHistory()
        await refreshCutout(obj, onUpdateCutout)
    }, [onSaveHistory, onUpdateCutout])

    // ── Fill change ──────────────────────────────────────────────────────────
    const handleFillChange = useCallback(async (color: string) => {
        setShapeFill(color)
        const obj = activeObjectRef.current
        if (isColorableObject(obj) && obj && fabricRef.current) {
            obj.set('fill', color)
            fabricRef.current.renderAll()
            onSaveHistory()
            await refreshCutout(obj, onUpdateCutout)
        }
    }, [onSaveHistory, onUpdateCutout])

    // ── Image upload ─────────────────────────────────────────────────────────
    const handleUploadClick = useCallback((): void => {
        imageInputRef.current?.click()
    }, [])

    const handleImageFileChange = useCallback(async (
        e: React.ChangeEvent<HTMLInputElement>
    ): Promise<void> => {
        const file = e.target.files?.[0]
        if (!file || !fabricRef.current) return
        e.target.value = ''

        const canvas = fabricRef.current
        const id = Date.now()
        const fileName = file.name.replace(/\.[^.]+$/, '')

        // Read file as data URL (same-origin blob — never tainted)
        const dataUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onload = (ev) => resolve(ev.target?.result as string)
            reader.readAsDataURL(file)
        })

        /**
         * Load image with crossOrigin="anonymous" so the canvas stays clean
         * and toDataURL() works for thumbnail generation.
         * For local blob data URLs, crossOrigin has no effect but doesn't hurt.
         */
        const img = await fabric.FabricImage.fromURL(dataUrl, { crossOrigin: 'anonymous' })

        const maxDim = 300
        if ((img.width ?? 0) > maxDim || (img.height ?? 0) > maxDim) {
            (img.width ?? 0) > (img.height ?? 0)
                ? img.scaleToWidth(maxDim)
                : img.scaleToHeight(maxDim)
        }

        img.set({
            left: (canvas.width! - img.getScaledWidth()) / 2,
            top: (canvas.height! - img.getScaledHeight()) / 2,
            data: { cutoutId: id },
        })

        canvas.add(img)
        canvas.setActiveObject(img)
        canvas.renderAll()

        // Thumbnail is safe because the source is a same-origin data URL
        const thumbnail = await generateShapeThumbnail(img)
        setCutouts((prev: any) => [
            ...prev,
            { shape: { id, type: 'image' as ShapeType, label: fileName || 'Image', thumbnail } },
        ])

        onSaveHistory()
        setToolMode('select')
    }, [setCutouts, onSaveHistory])

    // ── Add shapes ───────────────────────────────────────────────────────────
    const handleAddText = useCallback(async (): Promise<void> => {
        if (!fabricRef.current) return
        const id = Date.now()
        const text = new fabric.Textbox('Type here...', {
            left: 100, top: 100,
            fontSize: textControlsRef.current.fontSize,
            fontFamily: textControlsRef.current.fontFamily,
            fill: textControlsRef.current.fill,
            width: 220,
            data: { cutoutId: id },
        })
        fabricRef.current.add(text)
        fabricRef.current.setActiveObject(text)
        fabricRef.current.renderAll()
        await addShapeToCutouts(text, 'text', 'Type here...')
        setToolMode('select')
    }, [addShapeToCutouts])

    const handleAddRect = useCallback(async (): Promise<void> => {
        if (!fabricRef.current) return
        const id = Date.now()
        const rect = new fabric.Rect({
            left: 100, top: 100, width: 150, height: 100,
            fill: shapeFill, rx: 8, ry: 8, data: { cutoutId: id },
        })
        fabricRef.current.add(rect)
        fabricRef.current.setActiveObject(rect)
        fabricRef.current.renderAll()
        await addShapeToCutouts(rect, 'rect', 'Rectangle')
        setToolMode('select')
    }, [shapeFill, addShapeToCutouts])

    const handleAddCircle = useCallback(async (): Promise<void> => {
        if (!fabricRef.current) return
        const id = Date.now()
        const circle = new fabric.Circle({
            left: 100, top: 100, radius: 60,
            fill: shapeFill, data: { cutoutId: id },
        })
        fabricRef.current.add(circle)
        fabricRef.current.setActiveObject(circle)
        fabricRef.current.renderAll()
        await addShapeToCutouts(circle, 'circle', 'Circle')
        setToolMode('select')
    }, [shapeFill, addShapeToCutouts])

    const handleAddLine = useCallback(async (): Promise<void> => {
        if (!fabricRef.current) return
        const id = Date.now()
        const line = new fabric.Path('M50,50 L250,50', {
            stroke: '#111111', strokeWidth: 2, data: { cutoutId: id },
        })
        fabricRef.current.add(line)
        fabricRef.current.setActiveObject(line)
        fabricRef.current.renderAll()
        await addShapeToCutouts(line, 'line', 'Line')
        setToolMode('select')
    }, [addShapeToCutouts])

    const handleZoomIn = useCallback((): void => {
        if (!fabricRef.current) return
        fabricRef.current.setZoom(Math.min(fabricRef.current.getZoom() * 1.1, 5))
    }, [])

    const handleZoomOut = useCallback((): void => {
        if (!fabricRef.current) return
        fabricRef.current.setZoom(Math.max(fabricRef.current.getZoom() / 1.1, 0.2))
    }, [])

    // ── Keyboard shortcuts ───────────────────────────────────────────────────
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            const tag = (e.target as HTMLElement)?.tagName
            const isEditing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
            const activeObj = fabricRef.current?.getActiveObject()
            const isCanvasTextEditing = activeObj?.type === 'textbox' && (activeObj as any).isEditing === true
            const meta = e.metaKey || e.ctrlKey

            switch (e.key) {
                case 't': case 'T':
                    if (!isEditing && !isCanvasTextEditing) { e.preventDefault(); handleAddText() }
                    break
                case 'v': case 'V':
                    if (!isEditing && !isCanvasTextEditing) { e.preventDefault(); setToolMode('select') }
                    break
                case 'd': case 'D':
                    if (meta && !isEditing) { e.preventDefault(); handleDuplicate() }
                    else if (!isEditing && !isCanvasTextEditing && !meta) { e.preventDefault(); setToolMode('draw') }
                    break
                case 'x': case 'X':
                    if (!isEditing && !isCanvasTextEditing && !meta) { e.preventDefault(); setToolMode('cut') }
                    break
                case 'Escape':
                    setToolMode('select')
                    break
                case 'Delete': case 'Backspace':
                    if (!isEditing && !isCanvasTextEditing) { e.preventDefault(); handleDelete() }
                    break
                case '=': case '+':
                    if (meta) { e.preventDefault(); handleZoomIn() }
                    break
                case '-':
                    if (meta) { e.preventDefault(); handleZoomOut() }
                    break
                case 'b': case 'B':
                    if (meta && isCanvasTextEditing) { e.preventDefault(); handleTextControlChange({ bold: !textControlsRef.current.bold }) }
                    break
                case 'i': case 'I':
                    if (meta && isCanvasTextEditing) { e.preventDefault(); handleTextControlChange({ italic: !textControlsRef.current.italic }) }
                    break
                case 'u': case 'U':
                    if (meta && isCanvasTextEditing) { e.preventDefault(); handleTextControlChange({ underline: !textControlsRef.current.underline }) }
                    break
            }
        }

        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [handleDelete, handleDuplicate, handleZoomIn, handleZoomOut, handleTextControlChange, handleAddText])

    // ── Toolbar ───────────────────────────────────────────────────────────────
    const hasSelection = !!activeObject
    const hasMultiSelection = (activeObject as any)?.type === 'activeselection'

    const mainToolbar = (
        <div className={clsx(
            'flex items-center gap-1 px-3 py-2 bg-white flex-wrap',
            isCompact ? 'border-t justify-center' : 'border-b'
        )}>
            <ToolBtn label="Select (V)" icon={<MousePointer2 size={17} />} onClick={() => setToolMode('select')} active={toolMode === 'select'} />
            <ToolBtn label="Draw (D)" icon={<Pencil size={17} />} onClick={() => setToolMode('draw')} active={toolMode === 'draw'} />
            <ToolBtn label="Cut — click to remove (X)" icon={<Scissors size={17} />} onClick={() => setToolMode('cut')} active={toolMode === 'cut'} />

            <Divider />

            <ToolBtn label="Add Text (T)" icon={<Type size={17} />} onClick={handleAddText} />
            <ToolBtn label="Add Rectangle" icon={<Square size={17} />} onClick={handleAddRect} />
            <ToolBtn label="Add Circle" icon={<Circle size={17} />} onClick={handleAddCircle} />
            <ToolBtn label="Add Line" icon={<Minus size={17} />} onClick={handleAddLine} />
            <ToolBtn
                label="Upload Image"
                icon={<ImagePlus size={17} />}
                onClick={handleUploadClick}
                className="text-teal-600 hover:bg-teal-50"
            />
            <FillPicker color={currentFill} onChange={handleFillChange} hasSelection={isColorable} />

            <Divider />

            <ToolBtn label="Zoom Out (⌘-)" icon={<ZoomOut size={17} />} onClick={handleZoomOut} />
            <ToolBtn label="Zoom In (⌘+)" icon={<ZoomIn size={17} />} onClick={handleZoomIn} />

            {hasSelection && toolMode === 'select' && (
                <>
                    <Divider />
                    {!hasMultiSelection && (
                        <ToolBtn label="Duplicate (⌘D)" icon={<Copy size={17} />} onClick={handleDuplicate} />
                    )}
                    <ToolBtn
                        label={hasMultiSelection ? 'Delete all selected (⌫)' : 'Delete (⌫)'}
                        icon={<Trash2 size={17} />}
                        onClick={handleDelete}
                        className="bg-red-50 hover:bg-red-100 text-red-600"
                    />
                </>
            )}

            {toolMode !== 'select' && !isMobile && (
                <span className={clsx(
                    'ml-2 text-xs font-medium animate-pulse',
                    toolMode === 'draw' ? 'text-violet-500' : 'text-rose-500'
                )}>
                    {toolMode === 'draw' ? 'Click & drag to draw' : 'Click any object to remove it'}
                </span>
            )}

            {toolMode === 'select' && !hasSelection && !isMobile && (
                <span className="ml-auto text-[10px] text-gray-300 hidden lg:block">
                    V select · D draw · X cut · ⌘D dup · ⌫ delete
                </span>
            )}
        </div>
    )

    return (
        <TooltipProvider delayDuration={300}>
            <div className="flex flex-col h-full">
                {/* Hidden file input — triggered by Upload Image button */}
                <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageFileChange}
                />

                {!isCompact && mainToolbar}

                {isTextSelected && (
                    <TextToolbar controls={textControls} onChange={handleTextControlChange} />
                )}

                <div
                    ref={containerRef}
                    className="flex-1 flex items-center justify-center overflow-auto p-4 sm:p-6"
                >
                    <div
                        className="shadow-2xl rounded-xl overflow-hidden"
                        style={{
                            backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
                            backgroundSize: '24px 24px',
                            backgroundColor: '#f8f8f8',
                        }}
                    >
                        <canvas ref={canvasRef} />
                    </div>
                </div>

                {isCompact && mainToolbar}
            </div>
        </TooltipProvider>
    )
}

export default CenterPanel