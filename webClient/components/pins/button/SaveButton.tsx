"use client"
import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { useDispatch } from 'react-redux';
import { updatePinSaveStatus } from '@/redux/pinSlice';
import { cn } from '@/lib/utils';

type SaveMode = 'instant' | 'popover'
type DialogType = "profile" | "save" | "visit" | "share" | "edit" | null;

interface SaveButtonProps {
    pinId: string | number,
    isSaved: boolean,
    saveMode?: SaveMode;
    setOpenPopover?: (dialog: DialogType) => void;
}

interface Particle {
    id: number | string;
}


const SaveButton = ({ pinId, isSaved, saveMode, setOpenPopover }: SaveButtonProps) => {
    const dispatch = useDispatch();
    const [particles, setParticles] = useState<Particle[]>([]);


    const triggerSave = () => {
        dispatch(updatePinSaveStatus({ id: pinId, isSaved: !isSaved }));

        const p = Array.from({ length: 8 }, (_, i) => ({
            id: Date.now() + i,
        }));

        setParticles(p);
        setTimeout(() => setParticles([]), 900);
    };

    const handleSaveClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (saveMode === "instant") {
            triggerSave();
        } else {
            setOpenPopover?.("save");
        }
    };
    return (
        <div className="relative">
            <motion.button
                onClick={handleSaveClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    "rounded-full px-4 py-2 font-semibold",
                    saveMode === 'instant' ? (isSaved
                        ? "bg-black text-white"
                        : "bg-violet-700 text-white hover:bg-violet-800")
                        : "bg-violet-700 text-white hover:bg-violet-800"

                )}
            >
                {saveMode === "instant" ? (isSaved ? "Saved" : "Save") : "Save"}
            </motion.button>

            {/* PARTICLES */}
            <AnimatePresence>
                {particles.map((p, i) => {
                    const angle = (i / particles.length) * Math.PI * 2;
                    return (
                        <motion.div
                            key={p.id}
                            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                            animate={{
                                x: Math.cos(angle) * 50,
                                y: Math.sin(angle) * 50,
                                scale: [0, 1.2, 0],
                                opacity: [1, 1, 0],
                            }}
                            transition={{ duration: 0.8 }}
                            className="absolute top-1/2 left-1/2 w-2.5 h-2.5 bg-violet-400 rounded-full pointer-events-none"
                        />
                    );
                })}
            </AnimatePresence>
        </div>
    )
}

export default SaveButton