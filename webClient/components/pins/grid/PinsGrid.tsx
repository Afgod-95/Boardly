"use client";

import { motion } from "framer-motion";
import PinCard from "../card/PinCard";
import { PinItem } from "@/types/pin";
import clsx from "clsx";
import usePinsHook from "@/hooks/usePinsHook";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setSelectedPin } from "@/redux/pinSlice";
import { containerVariants, itemVariants } from "@/utils/animations";

export type PinCardVariant = "feed" | "board" | "pin";

interface PinsGridProps {
  items?: PinItem[];
  layout?: "standard" | "compact";
  variant: PinCardVariant;
  showMetadata?: boolean;
  showStarIcon?: boolean;
  profileValue?: string;

  /** Dialog content components */
  dialogComponents?: {
    ProfileDialogContent?: React.ComponentType<{ item: PinItem; onClose: () => void }>;
    SaveDialogContent?: React.ComponentType<{ item: PinItem; onClose: () => void }>;
    VisitDialogContent?: React.ComponentType<{ item: PinItem; onClose: () => void }>;
    ShareDialogContent?: React.ComponentType<{ item: PinItem; onClose: () => void }>;
    EditDialogContent?: React.ComponentType<{ item: PinItem; onClose: () => void }>;
  };

  /** Metadata popovers */
  popoverComponents?: {
    MoreOptionsPopoverContent?: React.ComponentType<{ item: PinItem }>;
    FavoritesPopoverContent?: React.ComponentType<{ item: PinItem }>;
  };
}

export default function PinsGrid({
  items = [],
  variant = "feed",
  layout = "standard",
  showStarIcon,
  profileValue,
  showMetadata,
  dialogComponents,
  popoverComponents,
}: PinsGridProps) {
  const { hoveredItem, hoveredIndex } = usePinsHook();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const {
    ProfileDialogContent,
    SaveDialogContent,
    VisitDialogContent,
    ShareDialogContent,
    EditDialogContent,
  } = dialogComponents || {};

  const { MoreOptionsPopoverContent, FavoritesPopoverContent } =
    popoverComponents || {};

  const showSaveButton = ["feed", "board", "pin"].includes(variant);
  const showEditButton = ["pin", "board"].includes(variant);
  const showProfileButton = variant === "feed" || variant === "board";

  const gridColumns = clsx(
    "gap-2 md:gap-4 w-full",
    variant === "feed" &&
      (layout === "standard"
        ? "columns-2 sm:columns-3 md:columns-4 lg:columns-4 xl:columns-6 2xl:columns-7"
        : "columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6"),
    variant === "board" &&
      (layout === "standard"
        ? "columns-2 sm:columns-3 md:columns-3 lg:columns-4 2xl:columns-7"
        : "columns-2 sm:columns-3 md:columns-4 lg:columns-6 2xl:columns-8"),
    variant === "pin" &&
      (layout === "standard"
        ? "columns-1 sm:columns-3 md:columns-4 lg:columns-5"
        : "columns-2 md:columns-3 lg:columns-5")
  );

  return (
    <div className="w-full pb-24">
      <motion.div
        className={gridColumns}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item, index) => (
          <motion.div
            key={`${item.id}-${index}`}
            className="break-inside-avoid mb-2"
            variants={itemVariants}
          >
            <PinCard
              item={item}
              profileValue={profileValue}
              layout={layout}
              showStarIcon={showStarIcon}
              showMetadata={variant === "feed" ? true : showMetadata}
              isHovered={hoveredIndex === index}
              onMouseEnter={() => hoveredItem(index)}
              onMouseLeave={() => hoveredItem(null)}
              onClick={() => {
                dispatch(setSelectedPin(item));
                router.push(`/dashboard/pins/${item.id}`);
              }}
              showSaveButton={showSaveButton}
              showEditButton={showEditButton}
              showProfileButton={showProfileButton}
              ProfileDialogContent={
                ProfileDialogContent
                  ? ({ onClose }) => (
                      <ProfileDialogContent item={item} onClose={onClose} />
                    )
                  : undefined
              }
              SaveDialogContent={
                SaveDialogContent
                  ? ({ onClose }) => (
                      <SaveDialogContent item={item} onClose={onClose} />
                    )
                  : undefined
              }
              VisitDialogContent={
                VisitDialogContent
                  ? ({ onClose }) => (
                      <VisitDialogContent item={item} onClose={onClose} />
                    )
                  : undefined
              }
              ShareDialogContent={
                ShareDialogContent
                  ? ({ onClose }) => (
                      <ShareDialogContent item={item} onClose={onClose} />
                    )
                  : undefined
              }
              EditDialogContent={
                EditDialogContent
                  ? ({ onClose }) => (
                      <EditDialogContent item={item} onClose={onClose} />
                    )
                  : undefined
              }
              MoreOptionsPopoverContent={
                MoreOptionsPopoverContent
                  ? () => <MoreOptionsPopoverContent item={item} />
                  : undefined
              }
              FavoritesPopoverContent={
                FavoritesPopoverContent
                  ? () => <FavoritesPopoverContent item={item} />
                  : undefined
              }
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
