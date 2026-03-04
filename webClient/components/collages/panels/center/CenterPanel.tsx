"use client"

import React, { useRef, useState, useCallback, useEffect } from 'react'
import * as fabric from 'fabric'
import {
    Type, Trash2, ZoomIn, ZoomOut, Minus,
    Pencil, Scissors, Copy, MousePointer2,
    Square, Circle, ImagePlus,
} from 'lucide-react'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Cutout } from '../../types/cutout.types'
import { useMediaQuery } from 'react-responsive'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import { ToolMode, ShapeType, TextControls } from '../../types/centerPanel.types'
import { TextToolbar, FillPicker } from './toolbar'
import { SideToolBtn } from './SideTooBtn'

//types 
import { CenterPanelProps } from './types/center.panel.types'

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
import { generateShapeThumbnail, refreshCutout, isTextObject, isColorableObject } from './helpers/center_panel_helpers'


const VSeparator = () => <div className="w-full h-px bg-gray-100 my-1" />

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
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
        italic: false, underline: false, textAlign: 'left', fill: '#111111',
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
        setCutouts((prev: any) => [...prev, { shape: { id, type, label, thumbnail } }])
    }, [setCutouts])

    // ── Canvas init ──────────────────────────────────────────────────────────
    useEffect(() => {
        if (!canvasRef.current) return
        const canvas = new fabric.Canvas(canvasRef.current, {
            width: 600, height: 600, backgroundColor: canvasBg, preserveObjectStacking: true,
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
        canvas.on('object:modified', async (e: any) => { onSaveHistory(); if (e.target) await refreshCutout(e.target, onUpdateCutout) })
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
        canvas.getObjects().forEach(obj => { obj.selectable = toolMode === 'select'; obj.evented = toolMode !== 'draw' })
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
            else { canvas.remove(target); canvas.discardActiveObject(); canvas.renderAll(); setActiveObject(null) }
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
        canvas.discardActiveObject(); canvas.renderAll(); setActiveObject(null); onSaveHistory()
    }, [onDeleteCutout, onSaveHistory])

    const handleDuplicate = useCallback(async (): Promise<void> => {
        const canvas = fabricRef.current; const obj = activeObjectRef.current
        if (!canvas || !obj) return
        const cloned = await obj.clone()
        cloned.set({ left: (obj.left ?? 0) + 20, top: (obj.top ?? 0) + 20, data: { cutoutId: Date.now() } })
        canvas.add(cloned); canvas.setActiveObject(cloned); canvas.renderAll()
        const origType = (obj as any).type as ShapeType
        if (origType) await addShapeToCutouts(cloned, origType, `${origType} copy`)
    }, [addShapeToCutouts])

    const handleTextControlChange = useCallback(async (patch: Partial<TextControls>) => {
        const canvas = fabricRef.current; const obj = activeObjectRef.current
        if (!canvas || !obj || !isTextObject(obj)) return
        const updated: TextControls = { ...textControlsRef.current, ...patch }
        setTextControls(updated)
        obj.set({
            fontSize: updated.fontSize, fontFamily: updated.fontFamily,
            fontWeight: updated.bold ? 'bold' : 'normal', fontStyle: updated.italic ? 'italic' : 'normal',
            underline: updated.underline, textAlign: updated.textAlign, fill: updated.fill,
        })
        canvas.renderAll(); onSaveHistory(); await refreshCutout(obj, onUpdateCutout)
    }, [onSaveHistory, onUpdateCutout])

    const handleFillChange = useCallback(async (color: string) => {
        setShapeFill(color)
        const obj = activeObjectRef.current
        if (isColorableObject(obj) && obj && fabricRef.current) {
            obj.set('fill', color); fabricRef.current.renderAll(); onSaveHistory(); await refreshCutout(obj, onUpdateCutout)
        }
    }, [onSaveHistory, onUpdateCutout])

    const handleUploadClick = useCallback((): void => { imageInputRef.current?.click() }, [])

    const handleImageFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const file = e.target.files?.[0]
        if (!file || !fabricRef.current) return
        e.target.value = ''
        const canvas = fabricRef.current; const id = Date.now(); const fileName = file.name.replace(/\.[^.]+$/, '')
        const dataUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader(); reader.onload = ev => resolve(ev.target?.result as string); reader.readAsDataURL(file)
        })
        const img = await fabric.FabricImage.fromURL(dataUrl, { crossOrigin: 'anonymous' })
        const maxDim = 300
        if ((img.width ?? 0) > maxDim || (img.height ?? 0) > maxDim) {
            (img.width ?? 0) > (img.height ?? 0) ? img.scaleToWidth(maxDim) : img.scaleToHeight(maxDim)
        }
        img.set({ left: (canvas.width! - img.getScaledWidth()) / 2, top: (canvas.height! - img.getScaledHeight()) / 2, data: { cutoutId: id } })
        canvas.add(img); canvas.setActiveObject(img); canvas.renderAll()
        const thumbnail = await generateShapeThumbnail(img)
        setCutouts((prev: any) => [...prev, { shape: { id, type: 'image' as ShapeType, label: fileName || 'Image', thumbnail } }])
        onSaveHistory(); setToolMode('select')
    }, [setCutouts, onSaveHistory])

    const handleAddText = useCallback(async (): Promise<void> => {
        if (!fabricRef.current) return
        const id = Date.now()
        const text = new fabric.Textbox('Type here...', {
            left: 100, top: 100, fontSize: textControlsRef.current.fontSize,
            fontFamily: textControlsRef.current.fontFamily, fill: textControlsRef.current.fill,
            width: 220, data: { cutoutId: id },
        })
        fabricRef.current.add(text); fabricRef.current.setActiveObject(text); fabricRef.current.renderAll()
        await addShapeToCutouts(text, 'text', 'Type here...'); setToolMode('select')
    }, [addShapeToCutouts])

    const handleAddRect = useCallback(async (): Promise<void> => {
        if (!fabricRef.current) return
        const id = Date.now()
        const rect = new fabric.Rect({ left: 100, top: 100, width: 150, height: 100, fill: shapeFill, rx: 8, ry: 8, data: { cutoutId: id } })
        fabricRef.current.add(rect); fabricRef.current.setActiveObject(rect); fabricRef.current.renderAll()
        await addShapeToCutouts(rect, 'rect', 'Rectangle'); setToolMode('select')
    }, [shapeFill, addShapeToCutouts])

    const handleAddCircle = useCallback(async (): Promise<void> => {
        if (!fabricRef.current) return
        const id = Date.now()
        const circle = new fabric.Circle({ left: 100, top: 100, radius: 60, fill: shapeFill, data: { cutoutId: id } })
        fabricRef.current.add(circle); fabricRef.current.setActiveObject(circle); fabricRef.current.renderAll()
        await addShapeToCutouts(circle, 'circle', 'Circle'); setToolMode('select')
    }, [shapeFill, addShapeToCutouts])

    const handleAddLine = useCallback(async (): Promise<void> => {
        if (!fabricRef.current) return
        const id = Date.now()
        const line = new fabric.Path('M50,50 L250,50', { stroke: '#111111', strokeWidth: 2, data: { cutoutId: id } })
        fabricRef.current.add(line); fabricRef.current.setActiveObject(line); fabricRef.current.renderAll()
        await addShapeToCutouts(line, 'line', 'Line'); setToolMode('select')
    }, [addShapeToCutouts])

    const handleZoomIn = useCallback((): void => {
        if (!fabricRef.current) return; fabricRef.current.setZoom(Math.min(fabricRef.current.getZoom() * 1.1, 5))
    }, [])
    const handleZoomOut = useCallback((): void => {
        if (!fabricRef.current) return; fabricRef.current.setZoom(Math.max(fabricRef.current.getZoom() / 1.1, 0.2))
    }, [])

    // ── Keyboard shortcuts ───────────────────────────────────────────────────
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            const tag = (e.target as HTMLElement)?.tagName
            const isEditing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
            const activeObj = fabricRef.current?.getActiveObject()
            const isCanvasEditing = activeObj?.type === 'textbox' && (activeObj as any).isEditing === true
            const meta = e.metaKey || e.ctrlKey
            switch (e.key) {
                case 't': case 'T': if (!isEditing && !isCanvasEditing) {
                    e.preventDefault();
                    handleAddText()
                }
                    break

                case 'v': case 'V': if (!isEditing && !isCanvasEditing) {
                    e.preventDefault();
                    setToolMode('select')
                } break

                case 'd': case 'D':
                    if (meta && !isEditing) {
                        e.preventDefault();
                        handleDuplicate()
                    }
                    else if (!isEditing && !isCanvasEditing && !meta) {
                        e.preventDefault();
                        setToolMode('draw')
                    }
                    break
                case 'x': case 'X': if (!isEditing && !isCanvasEditing && !meta) {
                    e.preventDefault(); setToolMode('cut')
                } break
                case 'Escape': setToolMode('select'); break
                case 'Delete': case 'Backspace': if (!isEditing && !isCanvasEditing) {
                    e.preventDefault(); handleDelete()
                }
                    break
                case '=': case '+': if (meta) { e.preventDefault(); handleZoomIn() } break
                case '-': if (meta) { e.preventDefault(); handleZoomOut() } break
                case 'b': case 'B': if (meta && isCanvasEditing) {
                    e.preventDefault();
                    handleTextControlChange({
                        bold: !textControlsRef.current.bold
                    })
                }
                    break
                case 'i': case 'I': if (meta && isCanvasEditing) {
                    e.preventDefault();
                    handleTextControlChange({ italic: !textControlsRef.current.italic })
                }
                    break
                case 'u': case 'U': if (meta && isCanvasEditing) {
                    e.preventDefault();
                    handleTextControlChange({ underline: !textControlsRef.current.underline })
                } break
            }
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [handleDelete, handleDuplicate, handleZoomIn, handleZoomOut, handleTextControlChange, handleAddText])

    // ─────────────────────────────────────────────────────────────────────────
    // Sidebar & bottom bar
    // ─────────────────────────────────────────────────────────────────────────
    const hasSelection = !!activeObject
    const hasMultiSelection = (activeObject as any)?.type === 'activeselection'

    // ── Desktop vertical sidebar ─────────────────────────────────────────────
    const desktopSidebar = (
        <div className="flex flex-col h-full w-12 border-r bg-white shrink-0 py-3 px-1.5 gap-0.5 shadow-sm">

            {/* Group 1 — Mode tools */}
            <SideToolBtn label="Select (V)"
                icon={<MousePointer2 size={17} />}
                onClick={() => setToolMode('select')}
                active={toolMode === 'select'}
            />
            <SideToolBtn label="Draw (D)"
                icon={<Pencil size={17} />}
                onClick={() => setToolMode('draw')}
                active={toolMode === 'draw'}
            />
            <SideToolBtn
                label="Cut (X)"
                icon={<Scissors size={17} />}
                onClick={() => setToolMode('cut')}
                active={toolMode === 'cut'}
            />

            <VSeparator />

            {/* Group 2 — Add shapes */}
            <SideToolBtn label="Add Text (T)" icon={<Type size={17} />} onClick={handleAddText} />
            <SideToolBtn label="Rectangle" icon={<Square size={17} />} onClick={handleAddRect} />
            <SideToolBtn label="Circle" icon={<Circle size={17} />} onClick={handleAddCircle} />
            <SideToolBtn label="Line" icon={<Minus size={17} />} onClick={handleAddLine} />


            <SideToolBtn label="Upload Image"
                icon={<ImagePlus size={17} />}
                onClick={handleUploadClick}
                className="text-teal-600 hover:bg-teal-50"
            />

            {/* Fill picker wrapped in tooltip */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={clsx("h-9 w-9 flex items-center justify-center rounded-xl",
                        "hover:bg-gray-100 transition-colors cursor-pointer")}>
                        <FillPicker color={currentFill} onChange={handleFillChange}
                            hasSelection={isColorable}
                        />
                    </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">Fill colour</TooltipContent>
            </Tooltip>

            <VSeparator />

            {/* Group 3 — Zoom */}
            <SideToolBtn label="Zoom Out (⌘−)" icon={<ZoomOut size={17} />} onClick={handleZoomOut} />
            <SideToolBtn label="Zoom In (⌘+)" icon={<ZoomIn size={17} />} onClick={handleZoomIn} />

            {/* Group 4 — Selection actions (slide in when object selected) */}
            <AnimatePresence initial={false}>
                {hasSelection && toolMode === 'select' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-col gap-0.5 overflow-hidden"
                    >
                        <VSeparator />
                        {!hasMultiSelection && (
                            <SideToolBtn label="Duplicate (⌘D)" icon={<Copy size={17} />} onClick={handleDuplicate} />
                        )}
                        <SideToolBtn
                            label={hasMultiSelection ? 'Delete selected' : 'Delete (⌫)'}
                            icon={<Trash2 size={17} />}
                            onClick={handleDelete}
                            danger
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mode hint — pulsing icon at bottom when not in select mode */}
            <AnimatePresence>
                {toolMode !== 'select' && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={clsx(
                                    'mt-auto h-9 w-9 flex items-center justify-center rounded-xl animate-pulse',
                                    toolMode === 'draw' ? 'bg-violet-50 text-violet-500' : 'bg-red-50 text-red-400'
                                )}
                            >
                                {toolMode === 'draw' ? <Pencil size={14} /> : <Scissors size={14} />}
                            </motion.div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="text-xs">
                            {toolMode === 'draw' ? 'Click & drag to draw' : 'Click any object to remove it'}
                        </TooltipContent>
                    </Tooltip>
                )}
            </AnimatePresence>
        </div>
    )

    // ── Mobile bottom bar ─────────────────────────────────────────────────────
    const mobileBottomBar = (
        <div className="flex items-center bg-white border-t w-full shrink-0">
            {/* Static left: mode tools */}
            <div className="flex items-center gap-1 px-2 py-2 shrink-0 border-r">
                {([
                    { label: 'Select', icon: <MousePointer2 size={17} />, mode: 'select' },
                    { label: 'Draw', icon: <Pencil size={17} />, mode: 'draw' },
                    { label: 'Cut', icon: <Scissors size={17} />, mode: 'cut' },
                ] as { label: string; icon: React.ReactNode; mode: ToolMode }[]).map(({ label, icon, mode }) => (
                    <Tooltip key={mode}>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                onClick={() => setToolMode(mode)}
                                className={clsx(
                                    'h-9 w-9 flex items-center justify-center rounded-xl transition-colors',
                                    toolMode === mode ? 'bg-violet-100 text-violet-700' : 'text-gray-500 hover:bg-gray-100'
                                )}
                            >
                                {icon}
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>{label}</TooltipContent>
                    </Tooltip>
                ))}
            </div>

            {/* Scrollable centre: shape tools */}
            <div className="flex-1 overflow-x-auto scrollbar-hide">
                <div className="flex items-center gap-1 px-2 py-2 w-max">
                    {([
                        { label: 'Text', icon: <Type size={17} />, fn: handleAddText, cls: '' },
                        { label: 'Rect', icon: <Square size={17} />, fn: handleAddRect, cls: '' },
                        { label: 'Circle', icon: <Circle size={17} />, fn: handleAddCircle, cls: '' },
                        { label: 'Line', icon: <Minus size={17} />, fn: handleAddLine, cls: '' },
                        { label: 'Image', icon: <ImagePlus size={17} />, fn: handleUploadClick, cls: 'text-teal-600' },
                    ] as { label: string; icon: React.ReactNode; fn: () => void; cls: string }[]).map(({ label, icon, fn, cls }) => (
                        <Tooltip key={label}>
                            <TooltipTrigger asChild>
                                <button type="button" onClick={fn}
                                    className={clsx('h-9 w-9 flex items-center justify-center rounded-xl',
                                        'hover:bg-gray-100 transition-colors', cls || 'text-gray-500')}>
                                    {icon}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>{label}</TooltipContent>
                        </Tooltip>
                    ))}
                    <FillPicker color={currentFill} onChange={handleFillChange} hasSelection={isColorable} />
                </div>
            </div>

            {/* Static right: zoom + selection */}
            <div className="flex items-center gap-1 px-2 py-2 shrink-0 border-l">
                <Tooltip><TooltipTrigger asChild>
                    <button type="button" onClick={handleZoomOut}
                        className="h-9 w-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100"
                    >
                        <ZoomOut size={17} />
                    </button>
                </TooltipTrigger><TooltipContent>Zoom out</TooltipContent></Tooltip>

                <Tooltip><TooltipTrigger asChild>
                    <button type="button" onClick={handleZoomIn}
                        className="h-9 w-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100"
                    >
                        <ZoomIn size={17} />
                    </button>
                </TooltipTrigger><TooltipContent>Zoom in</TooltipContent></Tooltip>

                {hasSelection && toolMode === 'select' && (
                    <>
                        {!hasMultiSelection && (
                            <Tooltip><TooltipTrigger asChild>
                                <button type="button"
                                    onClick={handleDuplicate}
                                    className="h-9 w-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100"
                                >
                                    <Copy size={17} />
                                </button>
                            </TooltipTrigger><TooltipContent>Duplicate</TooltipContent></Tooltip>
                        )}
                        <Tooltip><TooltipTrigger asChild>
                            <button type="button" onClick={handleDelete}
                                className={clsx(
                                    'h-9 w-9 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100',
                                    hasMultiSelection ? 'text-red-700' : ''
                                )}
                            >
                                <Trash2 size={17} />
                            </button>
                        </TooltipTrigger><TooltipContent>Delete</TooltipContent></Tooltip>
                    </>
                )}
            </div>
        </div>
    )

    // ─────────────────────────────────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <TooltipProvider delayDuration={200}>
            <div className="flex flex-col h-full">
                <input ref={imageInputRef} type="file" accept="image/*"
                    className="sr-only" onChange={handleImageFileChange}
                />

                {isTextSelected && (
                    <TextToolbar controls={textControls} onChange={handleTextControlChange} />
                )}

                <div className="flex flex-1 min-h-0">
                    {!isCompact && desktopSidebar}

                    <div
                        ref={containerRef}
                        className="flex-1 flex items-center justify-center overflow-auto p-4 sm:p-6"
                    >
                        <div
                            className="shadow-2xl rounded-xl h-full overflow-hidden"
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

                {isCompact && mobileBottomBar}
            </div>
        </TooltipProvider>
    )
}

export default CenterPanel