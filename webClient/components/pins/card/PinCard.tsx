"use client";

import { PinItem } from "@/types/pin";
import Image from "next/image";
import { Ellipsis, Star, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PinOverlay from "./PinOverlay";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addPinToFavourite } from "@/redux/pinSlice";
import { Toast } from "radix-ui";
import { toast } from "sonner";

// We can define a type for just the popover content props to keep it clean
interface PinCardProps extends React.HTMLAttributes<HTMLDivElement> {
  item: PinItem;
  profileValue?: string;
  layout?: any;
  saveMode?: "popover" | "instant";
  isHovered?: boolean;
  onMouseEnter: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  showSaveButton?: boolean;
  showEditButton?: boolean;
  showProfileButton?: boolean;
  showMetadata?: boolean;
  showStarIcon?: boolean;
  showPlusButton?: boolean;
  onAddToCanvasClick?: (item: PinItem) => void;

  // Popover Contents
  ProfilePopoverContent?: React.ComponentType<any>;
  SavePopoverContent?: React.ComponentType<any>;
  VisitPopoverContent?: React.ComponentType<any>;
  SharePopoverContent?: React.ComponentType<any>;
  EditDialogContent?: React.ComponentType<any>;
  MoreOptionsPopoverContent?: React.ComponentType<any>;
  FavoritesPopoverContent?: React.ComponentType<any>;
}

export default function PinCard({
  item,
  profileValue = "Profile",
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onClick,
  showMetadata,
  showStarIcon,
  ...props // Captures all overlay and button visibility props
}: PinCardProps) {
  const [metadataOpen, setMetadataOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // Logic: Handle Star Click (Favorite toggle)
  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addPinToFavourite(item.id as number | string));
    toast.success("Pin added to favourites");
  };

  // The actual Button component used in both scenarios
  const IconButton = (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={showStarIcon ? handleStarClick : (e) => e.stopPropagation()}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors shrink-0"
    >
      {showStarIcon ? (
        <Star
          size={18}
          className={item.isFavourite ? "text-yellow-foreground" : "text-gray-400"}
          fill={item.isFavourite ? "currentColor" : "none"}
        />
      ) : (
        <Ellipsis size={20} className="text-gray-600" />
      )}
    </motion.button>
  );

  return (
    <div className="break-inside-avoid mb-5 group">
      <div
        className={cn(
          "relative rounded-3xl overflow-hidden bg-gray-100 transition-shadow hover:shadow-md",
          isHovered ? "cursor-default" : "cursor-zoom-in"
        )}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        <Image
          src={`${item.img}?w=500&auto=format`}
          alt={item.title || "Pin image"}
          width={500}
          height={700}
          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              {/* Spreading props here makes PinOverlay clean */}
              <PinOverlay
                pinId={item.id as number | string}
                pin={item}  // ← add this
                isSaved={item.isSaved}
                profileValue={profileValue}
                onAddToCanvasClick={() => props.onAddToCanvasClick?.(item)}
                {...props}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showMetadata && (
        <div className="flex items-center justify-between mt-3 px-2">
          <span className="text-sm font-bold text-gray-800 truncate pr-2">
            {item.title}
          </span>

          {/* Conditional Rendering: Popover only if NOT a star icon */}
          {!showStarIcon ? (
            <Popover open={metadataOpen} onOpenChange={setMetadataOpen}>
              <PopoverTrigger asChild>
                {IconButton}
              </PopoverTrigger>
              <PopoverContent
                onClick={(e) => e.stopPropagation()}
                side="top"
                align="end"
                className="p-2 rounded-2xl border-0 shadow-2xl bg-white min-w-50"
              >
                {props.MoreOptionsPopoverContent && <props.MoreOptionsPopoverContent />}
              </PopoverContent>
            </Popover>
          ) : (
            IconButton
          )}
        </div>
      )}
    </div>
  );
}