"use client";

import { PinsLayout } from "@/components/boards/MoreActions";
import { Pencil, ChevronDown, ArrowUpRight, Upload, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updatePinSaveStatus } from "@/redux/pinSlice";
import SaveButton from "../button/SaveButton";
import { PinItem } from "@/types/pin";

type PopoverType = "profile" | "save" | "visit" | "share" | "edit" | null;
type SaveMode = "popover" | "instant";

interface PinOverlayProps {
  layout?: PinsLayout;
  profileValue?: string;
  showProfileButton?: boolean;
  showSaveButton?: boolean;
  showEditButton?: boolean;
  saveMode?: SaveMode;
  pinId: string | number;
  pin?: PinItem;
  isSaved?: boolean;
  showPlusButton?: boolean,
  onAddToCanvasClick?: (item: PinItem) => void;
  ProfilePopoverContent?: React.ComponentType<{}>;
  SavePopoverContent?: React.ComponentType<{}>;
  VisitPopoverContent?: React.ComponentType<{}>;
  SharePopoverContent?: React.ComponentType<{}>;
  EditDialogContent?: React.ComponentType<{}>;
}

export default function PinOverlay({
  layout,
  profileValue,
  showProfileButton = true,
  showSaveButton = true,
  showEditButton = false,
  saveMode = "popover",
  showPlusButton = false,
  onAddToCanvasClick,
  pinId,
  pin,
  isSaved = false,
  ProfilePopoverContent,
  SavePopoverContent,
  VisitPopoverContent,
  SharePopoverContent,
  EditDialogContent,
}: PinOverlayProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [openPopover, setOpenPopover] = useState<PopoverType>(null);

  const handlePopoverOpenChange = (type: PopoverType, open: boolean) => {
    setOpenPopover(open ? type : null);
  };

  const shouldPreventInteractOutside = (target: HTMLElement): boolean => {
    return (
      !!target.closest('[role="dialog"]') ||
      !!target.closest('[data-radix-popper-content-wrapper]') ||
      target.hasAttribute('data-radix-portal')
    );
  };

  const handleInteractOutside = (e: Event) => {
    const target = e.target as HTMLElement;
    if (shouldPreventInteractOutside(target)) {
      e.preventDefault();
    }
  };

  // Modern Pinterest-style Popover Class
  const popoverStyles = cn(
    "z-50 rounded-3xl bg-white p-4 shadow-xl border-none",
    "w-[calc(100vw-2rem)] sm:w-auto sm:min-w-[320px] max-w-[95vw]", // Responsive width
    "max-h-[80vh] overflow-y-auto no-scrollbar" // Prevents overflow on short screens
  );

  return (
    <>
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        <div className="absolute inset-0 z-10 pointer-events-auto">

          {/* ================= TOP ACTIONS ================= */}
          <div className="absolute top-3 left-3 right-3 flex justify-between">
            {showProfileButton && (
              <Popover open={openPopover === "profile"} onOpenChange={(o) => handlePopoverOpenChange("profile", o)} modal={true}>
                <PopoverTrigger asChild>
                  <motion.button
                    onClick={(e) => e.stopPropagation()}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-white/10 text-white backdrop-blur-sm"
                  >
                    <span className="text-sm font-semibold truncate hidden sm:inline">{profileValue}</span>
                    <ChevronDown size={16} />
                  </motion.button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  sideOffset={8}
                  className={popoverStyles}
                  onClick={(e) => e.stopPropagation()}
                  onInteractOutside={handleInteractOutside}
                >
                  {ProfilePopoverContent && <ProfilePopoverContent />}
                </PopoverContent>
              </Popover>
            )}

            {showSaveButton && (
              <Popover open={openPopover === "save"} onOpenChange={(o) => handlePopoverOpenChange("save", o)} modal={true}>
                <PopoverTrigger asChild>
                  <div onClick={(e) => e.stopPropagation()}>
                    <SaveButton pinId={pinId} isSaved={isSaved} saveMode={saveMode} setOpenPopover={setOpenPopover} />
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  sideOffset={8}
                  className={cn(popoverStyles, "sm:min-w-90")}
                  onClick={(e) => e.stopPropagation()}
                  onInteractOutside={handleInteractOutside}
                >
                  {SavePopoverContent && <SavePopoverContent />}
                </PopoverContent>
              </Popover>
            )}
          </div>

          {showPlusButton === true ? (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                if (pin) onAddToCanvasClick?.(pin);
               
              }}
              whileTap={{ scale: 0.95 }}
              className="absolute bottom-2 right-2 bg-white/90 p-2.5 rounded-xl shadow-sm "
            >
              <Plus size={18} />
            </motion.button>

          ) : (

            <>

              {/* ================= BOTTOM LEFT ================= */}
              <div className="absolute bottom-3 left-3">
                <Popover open={openPopover === "visit"} onOpenChange={(o) => handlePopoverOpenChange("visit", o)} modal={true}>
                  <PopoverTrigger asChild>
                    <motion.button
                      onClick={(e) => e.stopPropagation()}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white/90 rounded-xl p-2.5 flex items-center gap-2 shadow-sm"
                    >
                      <ArrowUpRight size={18} />
                      {layout === "standard" && <span className="hidden md:inline text-sm font-bold pr-1">Visit</span>}
                    </motion.button>
                  </PopoverTrigger>
                  <PopoverContent
                    side="top"
                    align="start"
                    sideOffset={12}
                    className={popoverStyles}
                    onClick={(e) => e.stopPropagation()}
                    onInteractOutside={handleInteractOutside}
                  >
                    {VisitPopoverContent && <VisitPopoverContent />}
                  </PopoverContent>
                </Popover>
              </div>

              {/* ================= BOTTOM RIGHT ================= */}
              <div className="absolute bottom-3 right-3 flex gap-2">
                {showEditButton && (
                  <Popover open={openPopover === "edit"} onOpenChange={(o) => handlePopoverOpenChange("edit", o)} modal={true}>
                    <PopoverTrigger asChild>
                      <motion.button
                        onClick={(e) => e.stopPropagation()}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white/90 p-2.5 rounded-xl shadow-sm"
                      >
                        <Pencil size={18} />
                      </motion.button>
                    </PopoverTrigger>
                    <PopoverContent
                      sideOffset={12}
                      className={cn(popoverStyles, "sm:w-112.5 md:w-150")} // Wider for Edit fields
                      onClick={(e) => e.stopPropagation()}
                      onInteractOutside={handleInteractOutside}
                    >
                      <div className="p-1">
                        {EditDialogContent && <EditDialogContent />}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}

                <Popover open={openPopover === "share"} onOpenChange={(o) => handlePopoverOpenChange("share", o)} modal={true}>
                  <PopoverTrigger asChild>
                    <motion.button
                      onClick={(e) => e.stopPropagation()}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white/90 p-2.5 rounded-xl shadow-sm"
                    >
                      <Upload size={18} />
                    </motion.button>
                  </PopoverTrigger>
                  <PopoverContent
                    side="top"
                    align="end"
                    sideOffset={12}
                    className={popoverStyles}
                    onClick={(e) => e.stopPropagation()}
                    onInteractOutside={handleInteractOutside}
                  >
                    {SharePopoverContent && <SharePopoverContent />}
                  </PopoverContent>
                </Popover>


              </div>
            </>

          )}

        </div>
      </div>
    </>
  );
}