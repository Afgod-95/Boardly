'use client'

import React, { useEffect, useRef } from 'react'
import * as fabric from 'fabric'
import {
    Image,
    Type,
    Trash2,
    ZoomIn,
    ZoomOut,
    Square,
    Circle,
    Minus,
} from 'lucide-react'
import CustomButton from '@/components/shared/buttons/CustomButton'
import { Cutout } from '../types/types'

interface CenterPanelProps {
    fabricRef: React.RefObject<fabric.Canvas | null>
    activeObject: fabric.Object | null
    setActiveObject: React.Dispatch<React.SetStateAction<fabric.Object | null>>
    canvasBg: string
    cutouts: Cutout[]
    setCutouts: React.Dispatch<React.SetStateAction<Cutout[]>>  // ← add this
    onSaveHistory: () => void
}

const CenterPanel = ({
    fabricRef,
    activeObject,
    setActiveObject,
    canvasBg,
    setCutouts,   // 
    onSaveHistory,
}: CenterPanelProps)  => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Initialize Fabric canvas
    useEffect(() => {
        if (!canvasRef.current) return

        const canvas = new fabric.Canvas(canvasRef.current, {
            width: 600,
            height: 600,
            backgroundColor: canvasBg,
            preserveObjectStacking: true,
        })

        fabricRef.current = canvas

        // Track selected object
        canvas.on('selection:created', (e) => setActiveObject(e.selected[0]))
        canvas.on('selection:updated', (e) => setActiveObject(e.selected[0]))
        canvas.on('selection:cleared', () => setActiveObject(null))

        // Save history on object modified
        canvas.on('object:modified', () => onSaveHistory())
        canvas.on('object:added', () => onSaveHistory())
        canvas.on('object:removed', () => onSaveHistory())

        return () => {
            canvas.dispose()
            fabricRef.current = null
        }
    }, [])

    // Sync background color from parent
    useEffect(() => {
        if (!fabricRef.current) return
        fabricRef.current.backgroundColor = canvasBg
        fabricRef.current.renderAll()
    }, [canvasBg])

    // Add ref at top of component
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Update handleImageUpload to also remove from cutouts when deleted
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !fabricRef.current) return

        const url = URL.createObjectURL(file)
        const id = Date.now().toString()

        // Add to cutouts list
        setCutouts(prev => [...prev, {
            id,
            name: file.name.replace(/\.[^/.]+$/, ''),
            imageUrl: url,
        }])

        // Add to canvas with the same id stored as custom property
        fabric.FabricImage.fromURL(url, {}).then((img) => {
            img.set({
                left: 80,
                top: 80,
                data: { cutoutId: id }  // store cutout id on the fabric object
            })
            img.scaleToWidth(200)
            fabricRef.current?.add(img)
            fabricRef.current?.setActiveObject(img)
            fabricRef.current?.renderAll()
        })

        e.target.value = ''
    }


    // Delete selected — also remove from cutouts
    const handleDelete = () => {
        if (!fabricRef.current || !activeObject) return

        // Remove from cutouts if it has a cutoutId
        const cutoutId = (activeObject as any).data?.cutoutId
        if (cutoutId) {
            setCutouts(prev => prev.filter(c => c.id !== cutoutId))
        }

        fabricRef.current.remove(activeObject)
        fabricRef.current.renderAll()
        setActiveObject(null)
    }

   
    // Add text
    const handleAddText = () => {
        if (!fabricRef.current) return
        const text = new fabric.Textbox('Type something...', {
            left: 100,
            top: 100,
            fontSize: 24,
            fontFamily: 'Arial',
            fill: '#111111',
            width: 220,
        })
        fabricRef.current.add(text)
        fabricRef.current.setActiveObject(text)
        fabricRef.current.renderAll()
    }

    // Add rectangle
    const handleAddRect = () => {
        if (!fabricRef.current) return
        const rect = new fabric.Rect({
            left: 100,
            top: 100,
            width: 150,
            height: 100,
            fill: '#6d28d9',
            rx: 8,
            ry: 8,
        })
        fabricRef.current.add(rect)
        fabricRef.current.setActiveObject(rect)
        fabricRef.current.renderAll()
    }

    // Add circle
    const handleAddCircle = () => {
        if (!fabricRef.current) return
        const circle = new fabric.Circle({
            left: 100,
            top: 100,
            radius: 60,
            fill: '#7c3aed',
        })
        fabricRef.current.add(circle)
        fabricRef.current.setActiveObject(circle)
        fabricRef.current.renderAll()
    }

    // Add line
    const handleAddLine = () => {
        if (!fabricRef.current) return
        const line = new fabric.Line([50, 50, 250, 50], {
            stroke: '#111111',
            strokeWidth: 2,
        })
        fabricRef.current.add(line)
        fabricRef.current.setActiveObject(line)
        fabricRef.current.renderAll()
    }


    // Zoom in
    const handleZoomIn = () => {
        if (!fabricRef.current) return
        const zoom = fabricRef.current.getZoom()
        fabricRef.current.setZoom(Math.min(zoom * 1.1, 5))
    }

    // Zoom out
    const handleZoomOut = () => {
        if (!fabricRef.current) return
        const zoom = fabricRef.current.getZoom()
        fabricRef.current.setZoom(Math.max(zoom / 1.1, 0.2))
    }

    return (
        <div className="flex flex-col h-full bg-gray-50">

            {/* Toolbar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b bg-white flex-wrap">

                {/* Upload image */}
                <label className="cursor-pointer">
                    {/* Upload image */}
                    <CustomButton
                        icon={<Image size={18} />}
                        onClick={() => fileInputRef.current?.click()}  // ← trigger via ref
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                    />
                </label>

                {/* Add text */}
                <CustomButton
                    icon={<Type size={18} />}
                    onClick={handleAddText}
                />

                {/* Add rectangle */}
                <CustomButton
                    icon={<Square size={18} />}
                    onClick={handleAddRect}
                />

                {/* Add circle */}
                <CustomButton
                    icon={<Circle size={18} />}
                    onClick={handleAddCircle}
                />

                {/* Add line */}
                <CustomButton
                    icon={<Minus size={18} />}
                    onClick={handleAddLine}
                />

                {/* Divider */}
                <div className="w-px h-6 bg-gray-200 mx-1" />

                {/* Zoom controls */}
                <CustomButton icon={<ZoomOut size={18} />} onClick={handleZoomOut} />
                <CustomButton icon={<ZoomIn size={18} />} onClick={handleZoomIn} />

                {/* Delete — only show when object selected */}
                {activeObject && (
                    <>
                        <div className="w-px h-6 bg-gray-200 mx-1" />
                        <CustomButton
                            icon={<Trash2 size={18} />}
                            onClick={handleDelete}
                            className="bg-red-100 hover:bg-red-200 text-red-600"
                        />
                    </>
                )}
            </div>

       
            {/* Canvas area - dotted background  */}
            <div
                ref={containerRef}
                className=" flex-1 flex items-center justify-center overflow-auto p-6"
                
            >
                <div className="shadow-2xl rounded-xl overflow-hidden"
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