"use client";

import { motion } from "framer-motion";
import PinCard from "../card/PinCard";
import { PinItem } from "@/types/pin";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setSelectedPin } from "@/redux/pinSlice";
import { containerVariants, itemVariants } from "@/utils/animations";
import usePinHook from "@/components/pins/hooks/usePinHook";

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
    ProfileDialogContent?: React.ComponentType<{
      item: PinItem;
      onClose: () => void;
    }>;
    SaveDialogContent?: React.ComponentType<{
      item: PinItem;
      onClose: () => void;
    }>;
    VisitDialogContent?: React.ComponentType<{
      item: PinItem;
      onClose: () => void;
    }>;
    ShareDialogContent?: React.ComponentType<{
      item: PinItem;
      onClose: () => void;
    }>;
    EditDialogContent?: React.ComponentType<{
      item: PinItem;
      onClose: () => void;
    }>;
  };

  /** Metadata popovers */
  popoverComponents?: {
    MoreOptionsPopoverContent?: React.ComponentType<{ item: PinItem }>;
    FavoritesPopoverContent?: React.ComponentType<{ item: PinItem }>;
  };
}

export default function PinsGrid({
  items = [],
  variant,
  layout = "standard",
  showStarIcon,
  profileValue,
  showMetadata,
  dialogComponents,
  popoverComponents,
}: PinsGridProps) {
  const { hoveredItem, hoveredIndex } = usePinHook();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const {
    ProfileDialogContent,
    SaveDialogContent,
    VisitDialogContent,
    ShareDialogContent,
    EditDialogContent,
  } = dialogComponents || {};

  const {
    MoreOptionsPopoverContent,
    FavoritesPopoverContent,
  } = popoverComponents || {};

  const showSaveButton = ["feed", "board", "pin"].includes(variant);
  const showEditButton = ["pin", "board"].includes(variant);
  const showProfileButton = variant === "feed" || variant === "board";
  
  // Determine save mode based on variant
  const saveMode = variant === "board" ? "dialog" : "instant";

  const gridColumns = clsx(
    "gap-2 sm:gap-4 w-full",
    variant === "feed" && (
      "columns-2 sm:columns-3 md:columns-3 lg:columns-4 2xl:columns-7"
    ),
    variant === "board" &&
    (layout === "standard"
      ? "columns-2 sm:columns-3 md:columns-3 lg:columns-4 2xl:columns-7"
      : "columns-2 sm:columns-4 md:columns-4 2xl:columns-8"),
    variant === "pin" &&
    (layout === "standard"
      ? "columns-1 md:columns-3 lg:columns-5 xl:columns-4"
      : "columns-2 md:columns-4 lg:columns- 2xl:columns-8")
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
            key={item.id}
            className="break-inside-avoid mb-2"
            variants={itemVariants}
          >
            <PinCard
              item={item}
              profileValue={profileValue}
              layout={layout}
              saveMode={saveMode} // Add this
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

              /* ================= DIALOGS ================= */
              ProfileDialogContent={
                ProfileDialogContent
                  ? (props) => <ProfileDialogContent item={item} {...props} />
                  : undefined
              }
              SaveDialogContent={
                SaveDialogContent
                  ? (props) => <SaveDialogContent item={item} {...props} />
                  : undefined
              }
              VisitDialogContent={
                VisitDialogContent
                  ? (props) => <VisitDialogContent item={item} {...props} />
                  : undefined
              }
              ShareDialogContent={
                ShareDialogContent
                  ? (props) => <ShareDialogContent item={item} {...props} />
                  : undefined
              }
              EditDialogContent={
                EditDialogContent
                  ? (props) => <EditDialogContent item={item} {...props} />
                  : undefined
              }

              /* ================= POPOVERS ================= */
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
