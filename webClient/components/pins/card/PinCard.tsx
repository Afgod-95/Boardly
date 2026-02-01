"use client"

import { PinItem } from "@/types/pin";
import Image from "next/image";
import { Ellipsis, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PinOverlay from "./PinOverlay";
import { PinsLayout } from "@/components/boards/MoreActions";
import { cn } from "@/lib/utils";

interface PinCardProps {
  item: PinItem;
  showStarIcon?: boolean;
  profileValue?: string;
  layout?: PinsLayout;
  index?: number;
  isHovered?: boolean;
  onMouseEnter: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  showSaveButton?: boolean;
  showEditButton?: boolean;
  showProfileButton?: boolean | string;
  showMetadata?: string | boolean;
  onProfileClick?: (e: React.MouseEvent) => void;
  onSave?: (e: React.MouseEvent) => void;
  onVisitSite?: (e: React.MouseEvent) => void;
  onShare?: (e: React.MouseEvent) => void;
  onEdit?: (e: React.MouseEvent) => void;
  onMoreOptions?: (e: React.MouseEvent) => void;
  onAddToFavorites?: (e: React.MouseEvent) => void;
}

export default function PinCard({
  item,
  showStarIcon = false,
  onAddToFavorites,
  profileValue = 'Profile',
  layout,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onClick,
  showSaveButton,
  showEditButton,
  showProfileButton,
  showMetadata,
  onProfileClick,
  onSave,
  onVisitSite,
  onShare,
  onEdit,
  onMoreOptions
}: PinCardProps) {

  // CRITICAL: Stops the parent onClick from firing when a button is clicked
  const handleAction = (e: React.MouseEvent, action?: (e: React.MouseEvent) => void) => {
    e.stopPropagation();
    if (action) action(e);
  };

  return (
    <div
      className="break-inside-avoid mb-5 group"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div 
        className="relative rounded-3xl overflow-hidden cursor-zoom-in bg-gray-100 transition-shadow hover:shadow-md"
        onClick={onClick}
      >
        <Image
          src={`${item.img}?w=500&auto=format`}
          alt={item.title || "Pin Image"}
          width={500}
          height={700}
          loading="lazy"
          className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Animation Wrapper for the Overlay */}
        <AnimatePresence>
          {isHovered && (
            <PinOverlay
              profileValue={profileValue}
              layout={layout}
              showProfileButton={Boolean(showProfileButton)}
              showSaveButton={showSaveButton}
              showEditButton={showEditButton}
              onProfileClick={(e) => handleAction(e, onProfileClick)}
              onSave={(e) => handleAction(e, onSave)}
              onVisitSite={(e) => handleAction(e, onVisitSite)}
              onShare={(e) => handleAction(e, onShare)}
              onEdit={(e) => handleAction(e, onEdit)}
            />
          )}
        </AnimatePresence>
      </div>

      {showMetadata && (
        <div className="flex justify-between items-center mt-3 px-2">
          <span className="text-sm font-bold text-gray-800 truncate tracking-tight">
            {item.title}
          </span>

          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => handleAction(e, showStarIcon ? onAddToFavorites : onMoreOptions)}
            className="p-2 rounded-full transition-colors"
          >
            {showStarIcon ? (
              <Star size={18} />
            ) : (
              <Ellipsis size={20} className="text-gray-600" />
            )}
          </motion.button>
        </div>
      )}
    </div>
  );
}