"use client";

import { PinsLayout } from "@/components/boards/MoreActions";
import { Pencil, ChevronDown, ArrowUpRight, Upload, Plus, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import SaveButton from "./button/SaveButton";
import { PinItem } from "@/types/pin";
import PopoverWrapper from "./shared/PopoverWrapper";


interface PinOverlayProps {
  layout?: PinsLayout;
  profileValue?: (pin: PinItem) => string | undefined;
  showProfileButton?: boolean;
  showSaveButton?: boolean;
  showEditButton?: boolean;
  pinId: string | number;
  pin?: PinItem;
  isSaved?: boolean;
  showPlusButton?: boolean;
  onAddToCanvasClick?: (item: PinItem) => void;
  ProfilePopoverContent?: React.ComponentType<{}>;
  SharePopoverContent?: React.ComponentType<{}>;
  EditDialogContent?: React.ComponentType<{}>;

  // unorganized prop
  isOrganized?: boolean;
}

export default function PinOverlay({
  layout,
  profileValue,
  showProfileButton = true,
  showSaveButton = true,
  showEditButton = false,
  showPlusButton = false,
  onAddToCanvasClick,
  pinId,
  pin,
  isSaved,
  ProfilePopoverContent,
  SharePopoverContent,
  EditDialogContent,
  isOrganized = true,
}: PinOverlayProps) {


  //Edit Popover
  const EditPopover = (
    <PopoverWrapper
      icon={Pencil}
      popoverType="edit"
      layout={layout as PinsLayout}
      alignContent="end"
    >
      {EditDialogContent && <EditDialogContent />}
    </PopoverWrapper>
  )

  //share Popover
  const SharePopover = (
    <PopoverWrapper
      icon={Share2}
      popoverType="share"
      layout={layout as PinsLayout}
      side="top"
      alignContent="end"
    >
      {SharePopoverContent && <SharePopoverContent />}
    </PopoverWrapper>
  )

  //profile Popover
  const ProfilePopover = (
    <PopoverWrapper
      iconCont={false}
      icon={ChevronDown}
      value={typeof profileValue === 'function' ? profileValue(pin as PinItem) : profileValue}
      popoverType="profile"
      layout={layout as PinsLayout}
    >
      {ProfilePopoverContent && <ProfilePopoverContent />}
    </PopoverWrapper>
  )


  //share Popover
  const SharePopOver = (
    <PopoverWrapper
      icon={Share2}
      popoverType="share"
      layout={layout as PinsLayout}
      side="top"
      alignContent="end"
    >
      {SharePopoverContent && <SharePopoverContent />}
    </PopoverWrapper>
  )


  const VisitPinLink = () => {
    if (pin?.link) {
      return (
        <motion.button
          onClick={(e) => {
            e.stopPropagation()
            window.open(pin?.link || '', '_blank')
          }}
          whileTap={{ scale: 0.95 }}
          className={cn("bg-white/90 p-2 sm:p-2.5 rounded-xl shadow-sm flex",
            "items-center justify-center active:scale-95 transition-transform",
            "touch-manipulation min-w-[36px] min-h-[36px]", "gap-1.5"
          )}
        >
          <ArrowUpRight size={16} className="sm:w-[18px] sm:h-[18px]" />
          {layout === "standard" && (
            <span className="hidden md:inline text-sm font-bold pr-1">Visit</span>
          )}
        </motion.button>
      )
    }
    else { return <div />}
  }






  return (
    <>
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        <div className="absolute inset-0 z-10 pointer-events-auto">

          {/* ================= TOP ACTIONS ================= */}
          {isOrganized && (
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex justify-between items-start gap-2">
              {showProfileButton && (
                ProfilePopover
              )}

              {showSaveButton && (
                <SaveButton pinId={pinId}
                  isSaved={isSaved as boolean}
                />
              )}
            </div>
          )}


          {/* ================= BOTTOM ACTIONS ================= */}

          {/* --- UNORGANIZED: Plus + Visit + Share all together --- */}
          {(!isOrganized && showEditButton) ? (
            <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 flex justify-between items-end gap-2">
              {<VisitPinLink />}
              {/* Share + Plus — bottom right */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {SharePopover}
                {EditPopover}
              </div>
            </div>

          ) : showPlusButton ? (
            /* --- CANVAS MODE: Plus only --- */
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                if (pin) onAddToCanvasClick?.(pin);
              }}
              whileTap={{ scale: 0.95 }}
              className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 bg-white/90 p-2 sm:p-2.5 rounded-xl shadow-sm touch-manipulation"
            >
              <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
            </motion.button>

          ) : (
            /* --- ORGANIZED / DEFAULT: Visit + Share + Edit --- */
            <>
              <div className="absolute bottom-3 left-3 right-3 items-center flex justify-between">
                <div className="">
                  {<VisitPinLink />}
                </div>

                {/* Bottom Right: Edit + Share */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {showEditButton && (EditPopover)}
                  {SharePopover}
                </div>
              </div>

            </>
          )}

        </div>
      </div>
    </>
  );
}