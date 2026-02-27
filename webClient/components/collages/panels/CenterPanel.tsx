'use client'

import React, { useEffect, useRef } from 'react'
import * as fabric from 'fabric'
import {
    Type, Trash2, ZoomIn, ZoomOut, Square, Circle, Minus,
    AlignLeft, AlignCenter, AlignRight,
    AlignStartVertical, AlignCenterVertical, AlignEndVertical,
} from 'lucide-react'
import CustomButton from '@/components/shared/buttons/CustomButton'
import { Cutout } from '../types/types'

interface CenterPanelProps {
    fabricRef: React.RefObject<fabric.Canvas | null>
    activeObject: fabric.Object | null
    setActiveObject: React.Dispatch<React.SetStateAction<fabric.Object | null>>
    canvasBg: string
    cutouts: Cutout[]
    setCutouts: React.Dispatch<React.SetStateAction<Cutout[]>>
    onSaveHistory: () => void
    onDeleteCutout: (id: string | number) => void
}

// Generate a small thumbnail canvas for shapes
const generateShapeThumbnail = async (obj: fabric.Object): Promise<string> => {
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
}

const CenterPanel = ({
    fabricRef,
    activeObject,
    setActiveObject,
    canvasBg,
    setCutouts,
    onSaveHistory,
    onDeleteCutout,
}: CenterPanelProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!canvasRef.current) return
        const canvas = new fabric.Canvas(canvasRef.current, {
            width: 600,
            height: 600,
            backgroundColor: canvasBg,
            preserveObjectStacking: true,
        })
        fabricRef.current = canvas

        canvas.on('selection:created', (e) => setActiveObject(e.selected[0]))
        canvas.on('selection:updated', (e) => setActiveObject(e.selected[0]))
        canvas.on('selection:cleared', () => setActiveObject(null))
        canvas.on('object:modified', () => onSaveHistory())
        canvas.on('object:added', () => onSaveHistory())
        canvas.on('object:removed', () => onSaveHistory())

        return () => {
            canvas.dispose()
            fabricRef.current = null
        }
    }, [])

    useEffect(() => {
        if (!fabricRef.current) return
        fabricRef.current.backgroundColor = canvasBg
        fabricRef.current.renderAll()
    }, [canvasBg])

    const addShapeToCutouts = async (obj: fabric.Object, type: 'text' | 'rect' | 'circle' | 'line', label: string) => {
        const id = (obj as any).data?.cutoutId
        const thumbnail = await generateShapeThumbnail(obj)
        setCutouts(prev => [...prev, {
            shape: { id, type, label, thumbnail }
        }])
    }

    const handleDelete = () => {
        if (!fabricRef.current || !activeObject) return
        const cutoutId = (activeObject as any).data?.cutoutId
        if (cutoutId) {
            onDeleteCutout(cutoutId)
        } else {
            fabricRef.current.remove(activeObject)
            fabricRef.current.renderAll()
            setActiveObject(null)
        }
    }

    const handleAddText = async () => {
        if (!fabricRef.current) return
        const id = Date.now()
        const text = new fabric.Textbox('Type something...', {
            left: 100, top: 100,
            fontSize: 24, fontFamily: 'Arial',
            fill: '#111111', width: 220,
            data: { cutoutId: id }
        })
        fabricRef.current.add(text)
        fabricRef.current.setActiveObject(text)
        fabricRef.current.renderAll()
        await addShapeToCutouts(text, 'text', 'Text')
    }

    const handleAddRect = async () => {
        if (!fabricRef.current) return
        const id = Date.now()
        const rect = new fabric.Rect({
            left: 100, top: 100,
            width: 150, height: 100,
            fill: '#6d28d9', rx: 8, ry: 8,
            data: { cutoutId: id }
        })
        fabricRef.current.add(rect)
        fabricRef.current.setActiveObject(rect)
        fabricRef.current.renderAll()
        await addShapeToCutouts(rect, 'rect', 'Rectangle')
    }

    const handleAddCircle = async () => {
        if (!fabricRef.current) return
        const id = Date.now()
        const circle = new fabric.Circle({
            left: 100, top: 100,
            radius: 60, fill: '#7c3aed',
            data: { cutoutId: id }
        })
        fabricRef.current.add(circle)
        fabricRef.current.setActiveObject(circle)
        fabricRef.current.renderAll()
        await addShapeToCutouts(circle, 'circle', 'Circle')
    }

    const handleAddLine = async () => {
        if (!fabricRef.current) return
        const id = Date.now()
        const line = new fabric.Path('M50,50 L250,50', {
            stroke: '#111111', strokeWidth: 2,
            data: { cutoutId: id }
        })
        fabricRef.current.add(line)
        fabricRef.current.setActiveObject(line)
        fabricRef.current.renderAll()
        await addShapeToCutouts(line, 'line', 'Line')
    }

    const handleZoomIn = async () => {
        if (!fabricRef.current) return
        fabricRef.current.setZoom(Math.min(fabricRef.current.getZoom() * 1.1, 5))
    }

    const handleZoomOut = () => {
        if (!fabricRef.current) return
        fabricRef.current.setZoom(Math.max(fabricRef.current.getZoom() / 1.1, 0.2))
    }

    // ── Alignment helpers ──
    const getCanvasSize = () => ({
        w: fabricRef.current?.getWidth() ?? 600,
        h: fabricRef.current?.getHeight() ?? 600,
    })

    const align = (type: string) => {
        const canvas = fabricRef.current
        const obj = activeObject
        if (!canvas || !obj) return
        const { w, h } = getCanvasSize()
        const bw = obj.getBoundingRect().width
        const bh = obj.getBoundingRect().height

        switch (type) {
            case 'left': obj.set({ left: 0 }); break
            case 'center': obj.set({ left: (w - bw) / 2 }); break
            case 'right': obj.set({ left: w - bw }); break
            case 'top': obj.set({ top: 0 }); break
            case 'middle': obj.set({ top: (h - bh) / 2 }); break
            case 'bottom': obj.set({ top: h - bh }); break
        }
        obj.setCoords()
        canvas.renderAll()
        onSaveHistory()
    }

    const isText = activeObject?.type === 'textbox' || activeObject?.type === 'text'

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Toolbar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b bg-white flex-wrap">
                <CustomButton icon={<Type size={18} />} onClick={handleAddText} />
                <CustomButton icon={<Square size={18} />} onClick={handleAddRect} />
                <CustomButton icon={<Circle size={18} />} onClick={handleAddCircle} />
                <CustomButton icon={<Minus size={18} />} onClick={handleAddLine} />

                <div className="w-px h-6 bg-gray-200 mx-1" />

                <CustomButton icon={<ZoomOut size={18} />} onClick={handleZoomOut} />
                <CustomButton icon={<ZoomIn size={18} />} onClick={handleZoomIn} />

                {/* Alignment — show when object selected */}
                {activeObject && (
                    <>
                        <div className="w-px h-6 bg-gray-200 mx-1" />
                        <CustomButton icon={<AlignLeft size={18} />} onClick={() => align('left')} />
                        <CustomButton icon={<AlignCenter size={18} />} onClick={() => align('center')} />
                        <CustomButton icon={<AlignRight size={18} />} onClick={() => align('right')} />
                        <CustomButton icon={<AlignStartVertical size={18} />} onClick={() => align('top')} />
                        <CustomButton icon={<AlignCenterVertical size={18} />} onClick={() => align('middle')} />
                        <CustomButton icon={<AlignEndVertical size={18} />} onClick={() => align('bottom')} />
                        <div className="w-px h-6 bg-gray-200 mx-1" />
                        <CustomButton
                            icon={<Trash2 size={18} />}
                            onClick={handleDelete}
                            className="bg-red-100 hover:bg-red-200 text-red-600"
                        />
                    </>
                )}
            </div>

            {/* Canvas area */}
            <div
                ref={containerRef}
                className="flex-1 flex items-center justify-center overflow-auto p-6"
            >
                <div
                    className="shadow-2xl rounded-xl overflow-hidden"
                    style={{
                        backgroundColor: '#f8f8f8',
                        backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
                        backgroundSize: '24px 24px',
                    }}
                >
                    <canvas ref={canvasRef} />
                </div>
            </div>
        </div>
    )
}

export default CenterPanel