'use client'

import { useRef, useState, useCallback } from 'react'
import * as fabric from 'fabric'
import CustomButton from "@/components/shared/buttons/CustomButton"
import { motion, AnimatePresence } from "framer-motion"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { MoreHorizontal, Undo, Redo, ChevronLeft, PanelLeft, PanelRight, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { CenterPanel, LeftPanel, RightPanel } from "../panels"
import { Cutout } from '../types/cutout.types'
import { PinItem } from '@/types/pin'
import { useMediaQuery } from 'react-responsive'
import Drawer from '../drawer/Drawer'
import { ToolBtn } from '../panels/center/toolbar'



// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
const CollageResizablePanel = () => {
    const router = useRouter()
    const isMobile = useMediaQuery({ maxWidth: 767 })
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 })
    const isCompact = isMobile || isTablet

    const [leftOpen, setLeftOpen] = useState(false)
    const [rightOpen, setRightOpen] = useState(false)

    const fabricRef = useRef<fabric.Canvas | null>(null)
    const fabricObjectsRef = useRef<Map<string | number, fabric.FabricImage>>(new Map())

    const historyRef = useRef<string[]>([])
    const redoRef = useRef<string[]>([])
    const isUndoRedoing = useRef(false)

    const [activeObject, setActiveObject] = useState<fabric.Object | null>(null)
    const [canvasBg, setCanvasBg] = useState('')
    const [cutouts, setCutouts] = useState<Cutout[]>([])

    // ── Cutout CRUD ──────────────────────────────────────────────────────────

    const deleteFromCanvas = useCallback((pinId: string | number) => {
        const img = fabricObjectsRef.current.get(pinId)
        if (img && fabricRef.current) {
            fabricRef.current.remove(img)
            fabricRef.current.renderAll()
            fabricObjectsRef.current.delete(pinId)
        }
        setCutouts(prev => prev.filter(c => (c.pin?.id ?? c.shape?.id) !== pinId))
        setActiveObject(null)
    }, [])

    /**
     * Called from CenterPanel whenever a shape/text is modified:
     * updates the matching cutout's thumbnail and optionally its label.
     */
    const updateCutout = useCallback((
        id: string | number,
        thumbnail: string,
        label?: string
    ) => {
        setCutouts(prev => prev.map(c => {
            const cId = c.pin?.id ?? c.shape?.id
            if (cId !== id) return c
            // Only shapes have mutable thumbnails / labels
            if (c.shape) {
                return {
                    ...c,
                    shape: {
                        ...c.shape,
                        thumbnail,
                        ...(label !== undefined ? { label } : {}),
                    },
                }
            }
            return c
        }))
    }, [])

    // ── Background ───────────────────────────────────────────────────────────

    const handleBgChange = useCallback((color: string) => {
        setCanvasBg(color)
        if (fabricRef.current) {
            fabricRef.current.backgroundColor = color
            fabricRef.current.renderAll()
        }
    }, [])

    // ── History ──────────────────────────────────────────────────────────────

    const saveHistory = useCallback(() => {
        if (!fabricRef.current || isUndoRedoing.current) return
        historyRef.current.push(JSON.stringify(fabricRef.current.toJSON()))
        redoRef.current = []
    }, [])

    const handleUndo = useCallback(() => {
        if (!fabricRef.current || historyRef.current.length === 0) return
        isUndoRedoing.current = true
        redoRef.current.push(JSON.stringify(fabricRef.current.toJSON()))
        const previous = historyRef.current.pop()!
        fabricRef.current.loadFromJSON(JSON.parse(previous), () => {
            fabricRef.current?.renderAll()
            isUndoRedoing.current = false
        })
    }, [])

    const handleRedo = useCallback(() => {
        if (!fabricRef.current || redoRef.current.length === 0) return
        isUndoRedoing.current = true
        historyRef.current.push(JSON.stringify(fabricRef.current.toJSON()))
        const next = redoRef.current.pop()!
        fabricRef.current.loadFromJSON(JSON.parse(next), () => {
            fabricRef.current?.renderAll()
            isUndoRedoing.current = false
        })
    }, [])

    const handleSave = useCallback(() => {
        if (!fabricRef.current) return
        const json = fabricRef.current.toJSON()
        const thumbnail = fabricRef.current.toDataURL({ multiplier: 1, format: 'png', quality: 0.8 })
        console.log('Saving collage JSON:', json)
        console.log('Thumbnail:', thumbnail)
        // TODO: POST { json, thumbnail, cutouts } to API
    }, [])

    // ── Canvas object selection ───────────────────────────────────────────────

    const selectOnCanvas = useCallback((pinId: string | number) => {
        const img = fabricObjectsRef.current.get(pinId)
        if (img && fabricRef.current) {
            fabricRef.current.setActiveObject(img)
            fabricRef.current.renderAll()
        }
    }, [])

    const handleReorder = useCallback((reorderedCutouts: Cutout[]) => {
        if (!fabricRef.current) return
        const total = reorderedCutouts.length
        reorderedCutouts.forEach((cutout, index) => {
            const id = cutout.pin?.id ?? cutout.shape?.id!
            const obj = fabricObjectsRef.current.get(id)
            if (obj) fabricRef.current?.moveObjectTo(obj, total - 1 - index)
        })
        fabricRef.current.renderAll()
    }, [])

    const addCutoutToCanvas = useCallback((pin: PinItem) => {
        if (!fabricRef.current) return
        if (fabricObjectsRef.current.has(pin.id!)) return

        setCutouts(prev => {
            if (prev.find(c => (c.pin?.id ?? c.shape?.id) === pin.id)) return prev
            return [...prev, { pin }]
        })

        fabric.FabricImage.fromURL(pin.img, { crossOrigin: 'anonymous' }).then((img) => {
            img.scaleToWidth(200)
            img.set({
                left: Math.random() * 200 + 50,
                top: Math.random() * 200 + 50,
                data: { cutoutId: pin.id },
            })
            fabricObjectsRef.current.set(pin.id!, img)
            fabricRef.current?.add(img)
            fabricRef.current?.bringObjectToFront(img)
            fabricRef.current?.setActiveObject(img)
            fabricRef.current?.renderAll()
        })

        if (isCompact) setRightOpen(false)
    }, [isCompact])

    // ── Shared panel content ─────────────────────────────────────────────────

    const leftPanelContent = (
        <LeftPanel
            cutouts={cutouts}
            setCutouts={setCutouts}
            canvasBg={canvasBg}
            onAddToCanvas={addCutoutToCanvas}
            onBgChange={handleBgChange}
            onDeleteCutout={deleteFromCanvas}
            activeObject={activeObject}
            onSelectCutout={selectOnCanvas}
            onReorder={handleReorder}
        />
    )

    const rightPanelContent = (
        <RightPanel
            onAddToCanvas={addCutoutToCanvas}
            activeObject={activeObject}
            fabricRef={fabricRef}
        />
    )

    const centerPanel = (
        <CenterPanel
            fabricRef={fabricRef}
            activeObject={activeObject}
            setActiveObject={setActiveObject}
            canvasBg={canvasBg}
            cutouts={cutouts}
            setCutouts={setCutouts}
            onSaveHistory={saveHistory}
            onDeleteCutout={deleteFromCanvas}
            onUpdateCutout={updateCutout}
        />
    )

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="flex flex-col h-screen overflow-hidden">

            {/* Header */}
            <div className="pl-3 sm:pl-0 flex items-center justify-between pr-4 md:px-4 py-2 shrink-0 z-10">
                <div className="flex items-center gap-3">
                    <CustomButton onClick={() => router.back()} icon={<ChevronLeft size={20} />} />
                    <span className="text-sm sm:text-lg font-bold sm:truncate">Create Collage</span>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-1 sm:gap-2">
                        <ToolBtn
                            label='Undo'
                            onClick={handleUndo} icon={<Undo size={18} />}
                        />
                        <ToolBtn
                            label='Redo'
                            onClick={handleRedo} icon={<Redo size={18} />}
                        />
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                        <CustomButton
                            className='border-0 hover:bg-muted'
                            onClick={() => console.log('more options')}
                            icon={<MoreHorizontal size={18} />}
                        />
                        <CustomButton
                            onClick={handleSave}
                            className="text-white sm:px-6 rounded-full bg-violet-700 hover:bg-violet-800 cursor-pointer transition-colors"
                            text='Next'
                        />
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden relative md:px-4">

                {/* Desktop — resizable 3-column */}
                {!isCompact && (
                    <ResizablePanelGroup
                        orientation="horizontal"
                        className="w-full h-full rounded-xl border"
                    >
                        <ResizablePanel defaultSize="20%">
                            {leftPanelContent}
                        </ResizablePanel>

                        <ResizableHandle withHandle />

                        <ResizablePanel defaultSize="50%">
                            {centerPanel}
                        </ResizablePanel>

                        <ResizableHandle withHandle />

                        <ResizablePanel defaultSize="30%">
                            {rightPanelContent}
                        </ResizablePanel>
                    </ResizablePanelGroup>
                )}

                {/* Mobile / Tablet — full canvas + drawer toggles */}
                {isCompact && (
                    <>
                        <div className="w-full h-full">
                            {centerPanel}
                        </div>

                        <motion.button
                            onClick={() => { setLeftOpen(true); setRightOpen(false) }}
                            className="fixed left-0 sm:left-24 top-1/2 -translate-y-1/2 z-30 border border-l-0 rounded-r-xl shadow-lg p-2.5"
                            whileTap={{ scale: 0.92 }}
                        >
                            <PanelLeft size={20} className="text-gray-600" />
                        </motion.button>

                        <motion.button
                            onClick={() => { setRightOpen(true); setLeftOpen(false) }}
                            className="fixed right-0 top-1/2 -translate-y-1/2 z-30 border border-r-0 rounded-l-xl shadow-lg p-2.5"
                            whileTap={{ scale: 0.92 }}
                        >
                            <PanelRight size={20} className="text-gray-600" />
                        </motion.button>

                        <Drawer open={leftOpen} onClose={() => setLeftOpen(false)} side="left">
                            {leftPanelContent}
                        </Drawer>
                        <Drawer open={rightOpen} onClose={() => setRightOpen(false)} side="right">
                            {rightPanelContent}
                        </Drawer>
                    </>
                )}
            </div>
        </div>
    )
}

export default CollageResizablePanel