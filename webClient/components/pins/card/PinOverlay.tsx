"use client";

import { PinsLayout } from "@/components/boards/MoreActions";
import { Pencil, ChevronDown, ArrowUpRight, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updatePinSaveStatus } from "@/redux/pinSlice";

type DialogType = "profile" | "save" | "visit" | "share" | "edit" | null;
type SaveMode = "dialog" | "instant";

interface PinOverlayProps {
  layout?: PinsLayout;
  profileValue?: string;

  showProfileButton?: boolean;
  showSaveButton?: boolean;
  showEditButton?: boolean;

  saveMode?: SaveMode;
  pinId: string | number;
  isSaved?: boolean;

  ProfileDialogContent?: React.ComponentType<{ onClose: () => void }>;
  SaveDialogContent?: React.ComponentType<{ onClose: () => void }>;
  VisitDialogContent?: React.ComponentType<{ onClose: () => void }>;
  ShareDialogContent?: React.ComponentType<{ onClose: () => void }>;
  EditDialogContent?: React.ComponentType<{ onClose: () => void }>;
}

interface Particle {
  id: number | string;
}

export default function PinOverlay({
  layout,
  profileValue,
  showProfileButton = true,
  showSaveButton = true,
  showEditButton = false,

  saveMode = "dialog",

  pinId,
  isSaved = false,

  ProfileDialogContent,
  SaveDialogContent,
  VisitDialogContent,
  ShareDialogContent,
  EditDialogContent,
}: PinOverlayProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [openDialog, setOpenDialog] = useState<DialogType>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  const closeDialog = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setOpenDialog(null);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setOpenDialog(null);
    }
  };

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
      setOpenDialog("save");
    }
  };

  const handleDialogClick = (
    e: React.MouseEvent,
    type: Exclude<DialogType, null>
  ) => {
    e.stopPropagation();
    setOpenDialog(type);
  };

  const dialogClass = cn(
    "w-[95vw] sm:w-full",
    "sm:max-w-137.5 md:max-w-162.5 lg:max-w-212.5",
    "rounded-3xl p-6"
  );

  return (
    <>
      {/* ================= OVERLAY ROOT ================= */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        {/* BACKGROUND */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />

        {/* INTERACTIVE LAYER */}
        <div className="absolute inset-0 z-10 pointer-events-auto">
          {/* ================= TOP ================= */}
          <div className="absolute top-3 left-3 right-3 flex justify-between">
            {/* PROFILE */}
            {showProfileButton ? (
              <motion.button
                onClick={(e) => handleDialogClick(e, "profile")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-white/10 text-white"
              >
                <span className="text-sm font-semibold truncate hidden sm:inline">
                  {profileValue}
                </span>
                <ChevronDown size={16} />
              </motion.button>
            ) : (
              <div />
            )}

            {/* SAVE */}
            {showSaveButton && (
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
            )}
          </div>

          {/* ================= BOTTOM LEFT ================= */}
          <div className="absolute bottom-3 left-3">
            <motion.button
              onClick={(e) => handleDialogClick(e, "visit")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/90 rounded-xl p-2 flex items-center gap-2"
            >
              <ArrowUpRight size={16} />
              {layout === "standard" && (
                <span className="hidden md:inline text-sm font-medium pr-1">
                  Visit
                </span>
              )}
            </motion.button>
          </div>

          {/* ================= BOTTOM RIGHT ================= */}
          <div className="absolute bottom-3 right-3 flex gap-2">
            {showEditButton && (
              <motion.button
                onClick={(e) => handleDialogClick(e, "edit")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/90 p-2 rounded-xl"
              >
                <Pencil size={16} />
              </motion.button>
            )}

            <motion.button
              onClick={(e) => handleDialogClick(e, "share")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/90 p-2 rounded-xl"
            >
              <Upload size={16} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* ================= DIALOG ================= */}
      <Dialog open={openDialog !== null} onOpenChange={handleDialogOpenChange}>
        <DialogContent 
          className={dialogClass}
          
        >
          {openDialog === "profile" && ProfileDialogContent && (
            <ProfileDialogContent onClose={closeDialog} />
          )}

          {openDialog === "save" && SaveDialogContent && (
            <SaveDialogContent
              onClose={() => {
                triggerSave();
                closeDialog();
              }}
            />
          )}

          {openDialog === "visit" && VisitDialogContent && (
            <VisitDialogContent onClose={closeDialog} />
          )}

          {openDialog === "edit" && EditDialogContent && (
            <EditDialogContent onClose={closeDialog} />
          )}

          {openDialog === "share" && ShareDialogContent && (
            <ShareDialogContent onClose={closeDialog} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}