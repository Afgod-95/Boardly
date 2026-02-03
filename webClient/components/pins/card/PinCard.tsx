"use client";

import { PinItem } from "@/types/pin";
import Image from "next/image";
import { Ellipsis, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PinOverlay from "./PinOverlay";
import { PinsLayout } from "@/components/boards/MoreActions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

interface PinCardProps {
  item: PinItem;
  profileValue?: string;
  layout?: PinsLayout;

  isHovered?: boolean;
  onMouseEnter: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;

  showSaveButton?: boolean;
  showEditButton?: boolean;
  showProfileButton?: boolean;
  showMetadata?: boolean;
  showStarIcon?: boolean;

  // Dialog contents
  ProfileDialogContent?: React.ComponentType<{ onClose: () => void }>;
  SaveDialogContent?: React.ComponentType<{ onClose: () => void }>;
  VisitDialogContent?: React.ComponentType<{ onClose: () => void }>;
  ShareDialogContent?: React.ComponentType<{ onClose: () => void }>;
  EditDialogContent?: React.ComponentType<{ onClose: () => void }>;

  // Metadata popovers
  MoreOptionsPopoverContent?: React.ComponentType;
  FavoritesPopoverContent?: React.ComponentType;
}

export default function PinCard({
  item,
  profileValue = "Profile",
  layout,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onClick,

  showSaveButton,
  showEditButton,
  showProfileButton,
  showMetadata,
  showStarIcon,

  ProfileDialogContent,
  SaveDialogContent,
  VisitDialogContent,
  ShareDialogContent,
  EditDialogContent,

  MoreOptionsPopoverContent,
  FavoritesPopoverContent,
}: PinCardProps) {
  const [metadataOpen, setMetadataOpen] = useState(false);

  return (
    <div
      className="break-inside-avoid mb-5 group"
    >
      {/* ================= IMAGE CARD ================= */}
      <div
        className="relative rounded-3xl overflow-hidden bg-gray-100 cursor-zoom-in transition-shadow hover:shadow-md"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Image
          src={`${item.img}?w=500&auto=format`}
          alt={item.title || "Pin image"}
          width={500}
          height={700}
          loading="lazy"
          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* ================= OVERLAY ================= */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <PinOverlay
                profileValue={profileValue}
                layout={layout}
                showProfileButton={showProfileButton}
                showSaveButton={showSaveButton}
                showEditButton={showEditButton}
                ProfileDialogContent={ProfileDialogContent}
                SaveDialogContent={SaveDialogContent}
                VisitDialogContent={VisitDialogContent}
                ShareDialogContent={ShareDialogContent}
                EditDialogContent={EditDialogContent}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ================= METADATA ================= */}
      {showMetadata && (
        <div className="flex items-center justify-between mt-3 px-2">
          <span className="text-sm font-bold text-gray-800 truncate">
            {item.title}
          </span>

          <Popover open={metadataOpen} onOpenChange={setMetadataOpen}>
            <PopoverTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                {showStarIcon ? (
                  <Star size={18} />
                ) : (
                  <Ellipsis size={20} className="text-gray-600" />
                )}
              </motion.button>
            </PopoverTrigger>

            {(showStarIcon
              ? FavoritesPopoverContent
              : MoreOptionsPopoverContent) && (
              <PopoverContent
                onClick={(e) => e.stopPropagation()}
                className="p-4 rounded-2xl border-0 shadow-xl"
              >
                {showStarIcon && FavoritesPopoverContent ? (
                  <FavoritesPopoverContent />
                ) : (
                  MoreOptionsPopoverContent && <MoreOptionsPopoverContent />
                )}
              </PopoverContent>
            )}
          </Popover>
        </div>
      )}
    </div>
  );
}
