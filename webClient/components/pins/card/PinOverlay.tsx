"use client";

import { PinsLayout } from "@/components/boards/MoreActions";
import { Pencil, ChevronDown, ArrowUpRight, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface PinOverlayProps {
  showProfileButton?: boolean;
  showSaveButton?: boolean;
  showEditButton?: boolean;
  profileValue?: string;
  layout?: PinsLayout;

  ProfileDialogContent?: React.ComponentType<{ onClose: () => void }>;
  SaveDialogContent?: React.ComponentType<{ onClose: () => void }>;
  VisitDialogContent?: React.ComponentType<{ onClose: () => void }>;
  ShareDialogContent?: React.ComponentType<{ onClose: () => void }>;
  EditDialogContent?: React.ComponentType<{ onClose: () => void }>;
}

interface Particle {
  id: number;
}

export default function PinOverlay({
  layout,
  profileValue,
  showProfileButton,
  showSaveButton,
  showEditButton,
  ProfileDialogContent,
  SaveDialogContent,
  VisitDialogContent,
  ShareDialogContent,
  EditDialogContent,
}: PinOverlayProps) {
  const [openDialog, setOpenDialog] = useState<
    "profile" | "save" | "visit" | "share" | "edit" | null
  >(null);

  const [particles, setParticles] = useState<Particle[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  const closeDialog = () => setOpenDialog(null);

  const openDialogOnly = (
    e: React.MouseEvent,
    type: NonNullable<typeof openDialog>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDialog(type);
  };

  const triggerSaveParticles = () => {
    setIsSaved(true);
    const p = Array.from({ length: 8 }, (_, i) => ({ id: Date.now() + i }));
    setParticles(p);
    setTimeout(() => setParticles([]), 900);
  };

  const dialogClass = cn(
    "w-[95vw] sm:w-full",
    "sm:max-w-137.5 md:max-w-162.5 lg:max-w-212.5",
    "rounded-3xl p-6"
  );

  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
      {/* DARK OVERLAY - Non-interactive */}
      <div className="absolute inset-0 bg-black/40 rounded-2xl pointer-events-none" />

      {/* ================= TOP ACTIONS ================= */}
      <div className="absolute top-3 left-3 right-3 flex justify-between z-10 pointer-events-none">

        {/* PROFILE */}
        {showProfileButton ? (
          <div className="pointer-events-auto">
            <Dialog
              open={openDialog === "profile"}
              onOpenChange={(o) => setOpenDialog(o ? "profile" : null)}
            >
              <DialogTrigger>
                <motion.button
                  onClick={(e) => openDialogOnly(e, "profile")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-white/10"
                >
                  <span className="text-white font-semibold text-sm truncate hidden sm:inline">
                    {profileValue}
                  </span>
                  <ChevronDown size={16} className="text-white" />
                </motion.button>
              </DialogTrigger>

              {ProfileDialogContent && (
                <DialogContent className={dialogClass}>
                  <ProfileDialogContent onClose={closeDialog} />
                </DialogContent>
              )}
            </Dialog>
          </div>
        ) : (
          <div className="pointer-events-none" />
        )}

        {/* SAVE */}
        {showSaveButton && (
          <div className="relative pointer-events-auto">
            <Dialog
              open={openDialog === "save"}
              onOpenChange={(o) => setOpenDialog(o ? "save" : null)}
            >
              <DialogTrigger>
                <motion.button
                  onClick={(e) => openDialogOnly(e, "save")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${
                    isSaved
                      ? "bg-black"
                      : "bg-violet-700 hover:bg-violet-800"
                  } text-white font-semibold rounded-full px-4 py-2`}
                >
                  {isSaved ? "Saved" : "Save"}
                </motion.button>
              </DialogTrigger>

              {SaveDialogContent && (
                <DialogContent className={dialogClass}>
                  <SaveDialogContent
                    onClose={() => {
                      triggerSaveParticles();
                      closeDialog();
                    }}
                  />
                </DialogContent>
              )}
            </Dialog>

            {/* SAVE PARTICLES */}
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
      <div className="absolute bottom-3 left-3 z-10 pointer-events-auto">
        <Dialog
          open={openDialog === "visit"}
          onOpenChange={(o) => setOpenDialog(o ? "visit" : null)}
        >
          <DialogTrigger>
            <motion.button
              onClick={(e) => openDialogOnly(e, "visit")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/90 rounded-xl p-2 flex items-center gap-2"
            >
              <ArrowUpRight size={16} />
              {layout === "standard" && (
                <span className="hidden md:inline text-sm font-medium">
                  Visit
                </span>
              )}
            </motion.button>
          </DialogTrigger>

          {VisitDialogContent && (
            <DialogContent className={dialogClass}>
              <VisitDialogContent onClose={closeDialog} />
            </DialogContent>
          )}
        </Dialog>
      </div>

      {/* ================= BOTTOM RIGHT ================= */}
      <div className="absolute bottom-3 right-3 flex gap-2 z-10 pointer-events-none">

        {/* EDIT */}
        {showEditButton && (
          <div className="pointer-events-auto">
            <Dialog
              open={openDialog === "edit"}
              onOpenChange={(o) => setOpenDialog(o ? "edit" : null)}
            >
              <DialogTrigger>
                <motion.button
                  onClick={(e) => openDialogOnly(e, "edit")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/90 p-2 rounded-xl"
                >
                  <Pencil size={16} />
                </motion.button>
              </DialogTrigger>

              {EditDialogContent && (
                <DialogContent className={dialogClass}>
                  <EditDialogContent onClose={closeDialog} />
                </DialogContent>
              )}
            </Dialog>
          </div>
        )}

        {/* SHARE */}
        <div className="pointer-events-auto">
          <Dialog
            open={openDialog === "share"}
            onOpenChange={(o) => setOpenDialog(o ? "share" : null)}
          >
            <DialogTrigger>
              <motion.button
                onClick={(e) => openDialogOnly(e, "share")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/90 p-2 rounded-xl"
              >
                <Upload size={16} />
              </motion.button>
            </DialogTrigger>

            {ShareDialogContent && (
              <DialogContent className={dialogClass}>
                <ShareDialogContent onClose={closeDialog} />
              </DialogContent>
            )}
          </Dialog>
        </div>
      </div>
    </div>
  );
}