'use client'

import { useRef, useState, useCallback } from 'react'
import * as fabric from 'fabric'
import CustomButton from "@/components/shared/buttons/CustomButton"
import PageWrapper from "@/components/shared/wrapper/PageWrapper"
import { motion } from "framer-motion"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { MoreHorizontal, Undo, Redo, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { pressedButtons } from "@/lib/animations/pressedButtons"
import clsx from "clsx"
import { CenterPanel, LeftPanel, RightPanel } from "../panels"
import { Cutout } from '../types/types'
import { PinItem } from '@/types/pin'
import { FabricObject } from 'fabric'

const CollageResizablePanel = () => {
    const router = useRouter()

    // Shared fabric canvas ref
    const fabricRef = useRef<fabric.Canvas | null>(null)
    const fabricObjectsRef = useRef<Map<string | number, fabric.FabricImage>>(new Map())

    // Undo history stack
    const historyRef = useRef<string[]>([])
    const redoRef = useRef<string[]>([])

    // Shared state
    const [activeObject, setActiveObject] = useState<fabric.Object | null>(null)
    const [canvasBg, setCanvasBg] = useState('')
    const [cutouts, setCutouts] = useState<Cutout[]>([])


    // Delete from canvas by pin id (called from LeftPanel)
    const deleteFromCanvas = useCallback((pinId: string | number) => {
        const img = fabricObjectsRef.current.get(pinId)
        if (img && fabricRef.current) {
            fabricRef.current.remove(img)
            fabricRef.current.renderAll()
            fabricObjectsRef.current.delete(pinId)
        }
        // ← fix: use getCutoutId instead of c.pin.id
        setCutouts(prev => prev.filter(c => (c.pin?.id ?? c.shape?.id) !== pinId))
        setActiveObject(null)
    }, [])

    // Sync background to canvas
    const handleBgChange = useCallback((color: string) => {
        setCanvasBg(color)
        if (fabricRef.current) {
            fabricRef.current.backgroundColor = color
            fabricRef.current.renderAll()
        }
    }, [])

    // Save state to history before any action
    const isUndoRedoing = useRef(false)

    const saveHistory = useCallback(() => {
        if (!fabricRef.current || isUndoRedoing.current) return
        const json = JSON.stringify(fabricRef.current.toJSON())
        historyRef.current.push(json)
        redoRef.current = []
    }, [])

    const handleUndo = useCallback(() => {
        if (!fabricRef.current || historyRef.current.length === 0) return
        isUndoRedoing.current = true
        const current = JSON.stringify(fabricRef.current.toJSON())
        redoRef.current.push(current)
        const previous = historyRef.current.pop()!
        fabricRef.current.loadFromJSON(JSON.parse(previous), () => {
            fabricRef.current?.renderAll()
            isUndoRedoing.current = false
        })
    }, [])

    const handleRedo = useCallback(() => {
        if (!fabricRef.current || redoRef.current.length === 0) return
        isUndoRedoing.current = true
        const current = JSON.stringify(fabricRef.current.toJSON())
        historyRef.current.push(current)
        const next = redoRef.current.pop()!
        fabricRef.current.loadFromJSON(JSON.parse(next), () => {
            fabricRef.current?.renderAll()
            isUndoRedoing.current = false
        })
    }, [])

    // Save collage
    const handleSave = useCallback(() => {
        if (!fabricRef.current) return
        const json = fabricRef.current.toJSON()
        const thumbnail = fabricRef.current.toDataURL({ multiplier: 1, format: 'png', quality: 0.8 })
        console.log('Saving collage JSON:', json)
        console.log('Thumbnail:', thumbnail)
        // TODO: POST { json, thumbnail, cutouts } to your PostgreSQL API
    }, [])


    // Select object on canvas when clicked in left panel
    const selectOnCanvas = useCallback((pinId: string | number) => {
        const img = fabricObjectsRef.current.get(pinId)
        if (img && fabricRef.current) {
            fabricRef.current.setActiveObject(img)
            fabricRef.current.renderAll()
        }
    }, [])

    // Reorder z-index on canvas to match left panel order
    const handleReorder = useCallback((reorderedCutouts: Cutout[]) => {
        if (!fabricRef.current) return
        const total = reorderedCutouts.length
        reorderedCutouts.forEach((cutout, index) => {
            const id = cutout.pin?.id ?? cutout.shape?.id!
            const obj = fabricObjectsRef.current.get(id)
            if (obj) {
                // Reverse: first in list = top layer, last = bottom
                fabricRef.current?.moveObjectTo(obj, total - 1 - index)
            }
        })
        fabricRef.current.renderAll()
    }, [])


    //add cutout to canvas
    const addCutoutToCanvas = useCallback((pin: PinItem) => {
        if (!fabricRef.current) return

        // Prevent duplicate
        if (fabricObjectsRef.current.has(pin.id!)) return
        setCutouts(prev => {
            if (prev.find(c => (c.pin?.id ?? c.shape?.id) === pin.id)) return prev
            return [...prev, { pin }]
        })

        fabric.FabricImage.fromURL(pin.img, {}).then((img) => {
            img.scaleToWidth(200)
            img.set({
                left: Math.random() * 200 + 50,
                top: Math.random() * 200 + 50,
                data: { cutoutId: pin.id }
            })
            fabricObjectsRef.current.set(pin.id!, img)
            fabricRef.current?.add(img)
            fabricRef.current?.bringObjectToFront(img)  
            fabricRef.current?.setActiveObject(img)
            fabricRef.current?.renderAll()
        })
    }, [])

    return (
        <PageWrapper className="space-y-4 pt-4 h-screen ">

            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 z-10 bg-white pb-2 border-b">
                <div className="flex items-center gap-3">
                    <CustomButton
                        onClick={() => router.back()}
                        icon={<ChevronLeft size={20} />}
                    />
                    <span className="text-lg font-bold">Create Collage</span>
                </div>

                <div className="flex items-center gap-4">
                    {/* Undo / Redo */}
                    <div className="flex items-center gap-2">
                        <CustomButton
                            onClick={handleUndo}
                            icon={<Undo size={20} />}
                        />
                        <CustomButton
                            onClick={handleRedo}
                            icon={<Redo size={20} />}
                        />
                    </div>

                    {/* More / Next */}
                    <div className="flex items-center gap-2">
                        <CustomButton
                            onClick={() => console.log('more options')}
                            icon={<MoreHorizontal size={20} />}
                        />
                        <motion.button
                            onClick={handleSave}
                            className={clsx(
                                'px-6 py-2 rounded-full flex items-center justify-center',
                                'bg-violet-700 hover:bg-violet-800 cursor-pointer transition-colors'
                            )}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ ...pressedButtons.transition }}
                        >
                            <span className="text-white font-medium">Next</span>
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Resizable Panels */}
            <ResizablePanelGroup
                orientation="horizontal"
                className="w-full rounded-xl border h-[calc(100vh-120px)]"
            >
                {/* Left Panel — Cutouts + Background */}
                <ResizablePanel defaultSize="25%">
                    <LeftPanel
                        cutouts={cutouts}
                        setCutouts={setCutouts}
                        canvasBg={canvasBg}
                        onAddToCanvas={addCutoutToCanvas}
                        onBgChange={handleBgChange}
                        onDeleteCutout={deleteFromCanvas}
                        activeObject={activeObject}
                        onSelectCutout={selectOnCanvas}   // ← new
                        onReorder={handleReorder}          // ← now actually does something
                    />
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Center Panel — Fabric Canvas */}
                <ResizablePanel defaultSize={"50%"}>
                    <CenterPanel
                        fabricRef={fabricRef}
                        activeObject={activeObject}
                        setActiveObject={setActiveObject}
                        canvasBg={canvasBg}
                        cutouts={cutouts}
                        setCutouts={setCutouts}
                        onSaveHistory={saveHistory}
                        onDeleteCutout={deleteFromCanvas}
                    />
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Right Panel — Properties */}
                <ResizablePanel defaultSize="25%">
                    <RightPanel
                        onAddToCanvas={addCutoutToCanvas}
                        activeObject={activeObject}
                        fabricRef={fabricRef}
                    />
                </ResizablePanel>

            </ResizablePanelGroup>

        </PageWrapper>
    )
}

export default CollageResizablePanel