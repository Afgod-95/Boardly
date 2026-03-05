"use client"

import React, { useRef, useState, useCallback, useEffect } from 'react'
import * as fabric from 'fabric'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useMediaQuery } from 'react-responsive'
import { ToolMode, ShapeType, TextControls } from '../../types/centerPanel.types'
import { TextToolbar } from './toolbar'
import { CenterPanelProps } from './types/center.panel.types'
import { 
    generateShapeThumbnail, 
    refreshCutout, isTextObject, isColorableObject 
} 
from './helpers/center_panel_helpers'
import { MobileBottomBar, DesktopSidebar } from './toolbar'

// Logical canvas size — never changes, only zoom/scale changes
const CANVAS_SIZE = 600

const CenterPanel: React.FC<CenterPanelProps> = ({
    fabricRef, activeObject, setActiveObject,
    canvasBg, setCutouts, onSaveHistory, onDeleteCutout, onUpdateCutout,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const imageInputRef = useRef<HTMLInputElement>(null)

    const [toolMode, setToolMode] = useState<ToolMode>('select')
    const [shapeFill, setShapeFill] = useState<string>('#6d28d9')
    const [textControls, setTextControls] = useState<TextControls>({
        fontSize: 24, fontFamily: 'Arial', bold: false,
        italic: false, underline: false, textAlign: 'left', 
        fill: '#111111',
    })

    const isMobile = useMediaQuery({ maxWidth: 767 })
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 })
    const isCompact = isMobile || isTablet

    const isTextSelected = isTextObject(activeObject)
    const isColorable = isColorableObject(activeObject)
    const currentFill = isColorable ? ((activeObject as any).fill as string ?? shapeFill) : shapeFill

    const toolModeRef = useRef<ToolMode>(toolMode)
    const activeObjectRef = useRef<fabric.Object | null>(activeObject)
    const textControlsRef = useRef<TextControls>(textControls)
    useEffect(() => { toolModeRef.current = toolMode }, [toolMode])
    useEffect(() => { activeObjectRef.current = activeObject }, [activeObject])
    useEffect(() => { textControlsRef.current = textControls }, [textControls])

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

    const addShapeToCutouts = useCallback(async (obj: fabric.Object, type: ShapeType, label: string): Promise<void> => {
        const id: string | number = (obj as any).data?.cutoutId
        const thumbnail = await generateShapeThumbnail(obj)
        setCutouts((prev: any) => [...prev, 
            { shape: { id, type, label, thumbnail } 
        }])
    }, [setCutouts])

    // ── Scale function — defined before canvas init so it can be called inside ──
    const applyScale = useCallback(() => {
        const canvas = fabricRef.current
        const container = containerRef.current
        if (!canvas || !container) return
        const pad = window.innerWidth < 768 ? 32 : 48
        const availW = container.clientWidth - pad
        const availH = container.clientHeight - pad
        const scale = Math.min(availW / CANVAS_SIZE, availH / CANVAS_SIZE, 1)
        canvas.setZoom(scale)
        canvas.setDimensions({ width: CANVAS_SIZE * scale, height: CANVAS_SIZE * scale })
        canvas.renderAll()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // ── Canvas init ──────────────────────────────────────────────────────────
    useEffect(() => {
        if (!canvasRef.current) return
        const canvas = new fabric.Canvas(canvasRef.current, {
            width: CANVAS_SIZE, 
            height: CANVAS_SIZE, 
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
            onSaveHistory(); 
            if (e.target) 
                await refreshCutout(e.target, onUpdateCutout) })
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
            setCutouts((prev: any) => [...prev, 
                { shape: 
                    { 
                        id, type: 'path', label: 'Drawing', thumbnail 
                    }
                }
            ])
            onSaveHistory()
        })

        // fabricRef.current is now set — safe to scale
        applyScale()

        return () => { 
            canvas.dispose(); 
            fabricRef.current = null 
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // ── ResizeObserver — handles subsequent container resizes ────────────────
    useEffect(() => {
        const container = containerRef.current
        if (!container) return
        const observer = new ResizeObserver(applyScale)
        observer.observe(container)
        return () => observer.disconnect()
    }, [applyScale])

    useEffect(() => {
        if (!fabricRef.current) return
        fabricRef.current.backgroundColor = canvasBg
        fabricRef.current.renderAll()
    }, [canvasBg])

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
        canvas.getObjects().forEach(obj => 
            { 
                obj.selectable = toolMode === 'select'; obj.evented = toolMode !== 'draw' 
            }
        )
        canvas.renderAll()
    }, [toolMode])

    useEffect(() => {
        const canvas = fabricRef.current
        if (!canvas) return
        const handleCut = (e: any) => {
            if (toolModeRef.current !== 'cut') return
            const target: fabric.Object | undefined = e.target
            if (!target) return
            e.e?.stopPropagation?.()
            const cutoutId: string | number | undefined = (target as any).data?.cutoutId
            if (cutoutId) onDeleteCutout(cutoutId)
            else { 
                canvas.remove(target); 
                canvas.discardActiveObject(); 
                canvas.renderAll(); 
                setActiveObject(null) 
            }
            onSaveHistory()
        }
        canvas.on('mouse:down:before', handleCut)
        return () => { canvas.off('mouse:down:before', handleCut) }
    }, [onDeleteCutout, onSaveHistory])

    const handleDelete = useCallback((): void => {
        const canvas = fabricRef.current
        if (!canvas) return
        const active = canvas.getActiveObject()
        if (!active) return
        const targets: fabric.Object[] =
            (active as any).type === 'activeselection'
                ? (active as fabric.ActiveSelection).getObjects() : [active]
        targets.forEach(obj => {
            const cutoutId: string | number | undefined = (obj as any).data?.cutoutId
            if (cutoutId) onDeleteCutout(cutoutId)
            canvas.remove(obj)
        })
        canvas.discardActiveObject(); 
        canvas.renderAll(); 
        setActiveObject(null); 
        onSaveHistory()
    }, [onDeleteCutout, onSaveHistory])

    const handleDuplicate = useCallback(async (): Promise<void> => {
        const canvas = fabricRef.current; const obj = activeObjectRef.current
        if (!canvas || !obj) return
        const cloned = await obj.clone()
        cloned.set({ 
            left: (obj.left ?? 0) + 20, top: (obj.top ?? 0) + 20, 
            data: { cutoutId: Date.now() } 
        })
        canvas.add(cloned); 
        canvas.setActiveObject(cloned); 
        canvas.renderAll()
        const origType = (obj as any).type as ShapeType
        if (origType) {
            await addShapeToCutouts(cloned, origType, `${origType} copy`)
        }
    }, [addShapeToCutouts])

    const handleTextControlChange = useCallback(async (patch: Partial<TextControls>) => {
        const canvas = fabricRef.current; const obj = activeObjectRef.current
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
        canvas.renderAll(); 
        onSaveHistory(); 
        await refreshCutout(obj, onUpdateCutout)
    }, [onSaveHistory, onUpdateCutout])

    const handleFillChange = useCallback(async (color: string) => {
        setShapeFill(color)
        const obj = activeObjectRef.current
        if (isColorableObject(obj) && obj && fabricRef.current) {
            obj.set('fill', color); 
            fabricRef.current.renderAll(); 
            onSaveHistory(); 
            await refreshCutout(obj, onUpdateCutout)
        }
    }, [onSaveHistory, onUpdateCutout])

    const handleUploadClick = useCallback((): void => { 
        imageInputRef.current?.click() 
    },[])

    const handleImageFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const file = e.target.files?.[0]
        if (!file || !fabricRef.current) return
        e.target.value = ''
        const canvas = fabricRef.current; 
        const id = Date.now(); 
        const fileName = file.name.replace(/\.[^.]+$/, '')
        const dataUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader(); 
            reader.onload = ev => resolve(ev.target?.result as string); 
            reader.readAsDataURL(file)
        })
        const img = await fabric.FabricImage.fromURL(
            dataUrl, { crossOrigin: 'anonymous' }
        )
        const maxDim = 300
        if ((img.width ?? 0) > maxDim || (img.height ?? 0) > maxDim) {
            (img.width ?? 0) > (img.height ?? 0) ? img.scaleToWidth(maxDim) : img.scaleToHeight(maxDim)
        }
        img.set({ left: (canvas.width! - img.getScaledWidth()) / 2, 
            top: (canvas.height! - img.getScaledHeight()) / 2, 
            data: { cutoutId: id } 
        })
        canvas.add(img); 
        canvas.setActiveObject(img); 
        canvas.renderAll()
        const thumbnail = await generateShapeThumbnail(img)
        setCutouts((prev: any) => [...prev, { 
            shape: { id, type: 'image' as ShapeType, label: fileName || 'Image', thumbnail } 
        }])
        onSaveHistory(); setToolMode('select')
    }, [setCutouts, onSaveHistory])

    const handleAddText = useCallback(async (): Promise<void> => {
        if (!fabricRef.current) return
        const id = Date.now()
        const text = new fabric.Textbox('Type here...', {
            left: 100, top: 100, 
            fontSize: textControlsRef.current.fontSize,
            fontFamily: textControlsRef.current.fontFamily, 
            fill: textControlsRef.current.fill,
            width: 220, data: { cutoutId: id },
        })
        fabricRef.current.add(text); 
        fabricRef.current.setActiveObject(text); 
        fabricRef.current.renderAll()
        await addShapeToCutouts(text, 'text', 'Type here...'); 
        setToolMode('select')
    }, [addShapeToCutouts])


    const handleAddRect = useCallback(async (): Promise<void> => {
        if (!fabricRef.current) return
        const id = Date.now()
        const rect = new fabric.Rect({ 
            left: 100, top: 100, 
            width: 150, 
            height: 100, 
            fill: shapeFill, rx: 8, ry: 8,
            data: { cutoutId: id } 
        })
        fabricRef.current.add(rect); 
        fabricRef.current.setActiveObject(rect); 
        fabricRef.current.renderAll()
        await addShapeToCutouts(rect, 'rect', 'Rectangle'); 
        setToolMode('select')
    }, [shapeFill, addShapeToCutouts])

    const handleAddCircle = useCallback(async (): Promise<void> => {
        if (!fabricRef.current) return
        const id = Date.now()
        const circle = new fabric.Circle({ 
            left: 100, top: 100, 
            radius: 60, 
            fill: shapeFill, 
            data: { cutoutId: id } 
        })
        fabricRef.current.add(circle); 
        fabricRef.current.setActiveObject(circle); 
        fabricRef.current.renderAll()
        await addShapeToCutouts(circle, 'circle', 'Circle'); 
        setToolMode('select')
    }, [shapeFill, addShapeToCutouts])

    const handleAddLine = useCallback(async (): Promise<void> => {
        if (!fabricRef.current) return
        const id = Date.now()
        const line = new fabric.Path('M50,50 L250,50', { 
            stroke: '#111111', strokeWidth: 2, 
            data: { cutoutId: id } 
        })
        fabricRef.current.add(line); 
        fabricRef.current.setActiveObject(line); 
        fabricRef.current.renderAll()
        await addShapeToCutouts(line, 'line', 'Line'); 
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
            const isCanvasEditing = activeObj?.type === 'textbox' && (activeObj as any).isEditing === true
            const meta = e.metaKey || e.ctrlKey

            const isEditingAndCanvasEditing = isEditing && isCanvasEditing
            switch (e.key) {
                case 't': case 'T': if (!isEditingAndCanvasEditing) { 
                    e.preventDefault(); 
                    handleAddText() 
                } 
                break
                case 'v': case 'V': if (!isEditingAndCanvasEditing) {
                        e.preventDefault(); 
                        setToolMode('select') 
                    } 
                    break
                case 'd': case 'D':
                    if (meta && !isEditing) { 
                        e.preventDefault(); 
                        handleDuplicate() 
                    }
                    else if (!isEditingAndCanvasEditing && !meta) { 
                        e.preventDefault(); 
                        setToolMode('draw') 
                    }
                    break
                case 'x': case 'X': 
                    if (!isEditingAndCanvasEditing && !meta) { 
                        e.preventDefault(); 
                        setToolMode('cut') 
                    } 
                    break

                case 'Escape': setToolMode('select'); break
                case 'Delete': case 'Backspace': 
                    if (!isEditingAndCanvasEditing) { 
                        e.preventDefault(); 
                        handleDelete() 
                    } 
                    break

                case '=': case '+': 
                    if (meta) {   
                        e.preventDefault(); 
                        handleZoomIn() 
                    } 
                    break

                case '-': 
                    if (meta) { 
                        e.preventDefault(); 
                        handleZoomOut() 
                    } 
                    break

                case 'b': case 'B': 
                    if (meta && isCanvasEditing) { 
                        e.preventDefault(); 
                        handleTextControlChange({ bold: !textControlsRef.current.bold }) 
                    } 
                    break

                case 'i': case 'I': 
                    if (meta && isCanvasEditing) { 
                        e.preventDefault(); 
                        handleTextControlChange({ italic: !textControlsRef.current.italic }) 
                    } 
                    break
                case 'u': case 'U': 
                    if (meta && isCanvasEditing) { 
                        e.preventDefault(); 
                        handleTextControlChange({ underline: !textControlsRef.current.underline }) 
                    } 
                    break
            }
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [handleDelete, handleDuplicate, handleZoomIn, handleZoomOut, handleTextControlChange, handleAddText])

    const hasSelection = !!activeObject
    const hasMultiSelection = (activeObject as any)?.type === 'activeselection'

    // Shared props for both toolbars
    const toolbarProps = {
        toolMode, setToolMode,
        currentFill, isColorable,
        hasSelection, hasMultiSelection,
        onFillChange: handleFillChange,
        onAddText: handleAddText,
        onAddRect: handleAddRect,
        onAddCircle: handleAddCircle,
        onAddLine: handleAddLine,
        onUploadClick: handleUploadClick,
        onZoomIn: handleZoomIn,
        onZoomOut: handleZoomOut,
        onDuplicate: handleDuplicate,
        onDelete: handleDelete,
    }

    return (
        <TooltipProvider delayDuration={200}>
            <div className="flex flex-col h-full min-h-0">
                <input ref={imageInputRef} type="file" accept="image/*"
                    className="sr-only" onChange={handleImageFileChange}
                />

                {isTextSelected && (
                    <TextToolbar controls={textControls} onChange={handleTextControlChange} />
                )}

                {/* min-h-0 on this flex row prevents it from overflowing its parent */}
                <div className="flex flex-1 min-h-0">
                    {!isCompact && <DesktopSidebar {...toolbarProps} />}

                    {/*
                        Key fixes for canvas visibility:
                        - overflow-hidden (not overflow-auto) so the scaled canvas
                          doesn't get clipped by a scroll container
                        - min-h-0 so the flex child can shrink below its content size
                    */}
                    <div
                        ref={containerRef}
                        className="flex-1 flex items-center justify-center overflow-hidden min-h-0 p-4 sm:p-6"
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
                </div>

                {isCompact && <MobileBottomBar {...toolbarProps} />}
            </div>
        </TooltipProvider>
    )
}

export default CenterPanel