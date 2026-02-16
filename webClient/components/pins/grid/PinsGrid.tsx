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

export type PinCardVariant = "feed" | "board" | "pin" | "detail";

interface PinsGridProps {
  items?: PinItem[];
  layout?: "standard" | "compact";
  variant: PinCardVariant;
  showMetadata?: boolean;
  showStarIcon?: boolean;
  profileValue?: string;

  /** Popover content components */
  PopoverComponents?: {
    ProfilePopoverContent?: React.ComponentType<{
      item: PinItem;
      onClose: () => void;
    }>;
    SavePopoverContent?: React.ComponentType<{
      item: PinItem;
      onClose: () => void;
    }>;
    VisitPopoverContent?: React.ComponentType<{
      item: PinItem;
      onClose: () => void;
    }>;
    SharePopoverContent?: React.ComponentType<{
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
  profileValue,
  showMetadata,
  PopoverComponents,
  popoverComponents,
  ...props

}: PinsGridProps) {
  const { hoveredItem, hoveredIndex } = usePinHook();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const {
    ProfilePopoverContent,
    SavePopoverContent,
    VisitPopoverContent,
    SharePopoverContent,
    EditDialogContent,
  } = PopoverComponents || {};

  const {
    MoreOptionsPopoverContent,
    FavoritesPopoverContent,
  } = popoverComponents || {};

  const showSaveButton = ["feed", "board", "pin", "detail"].includes(variant);
  const showEditButton = ["pin", "board"].includes(variant);
  const showProfileButton = variant === "feed" || variant === "board" || variant === "detail";
  
  // Determine save mode based on variant
  const saveMode = variant === "board" ? "popover" : "instant";

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
      : "columns-2 md:columns-4 lg:columns- 2xl:columns-8"),

      variant === 'detail' && "columns-1 md:columns-2 2xl:columns-3"
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
              {...props}
              item={item}
              profileValue={profileValue}
              layout={layout}
              saveMode={saveMode} 
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

              /* ================= PopoverS ================= */
              ProfilePopoverContent={
                ProfilePopoverContent
                  ? (props: any) => <ProfilePopoverContent item={item} onClose={props.onClose} />
                  : undefined
              }
              SavePopoverContent={
                SavePopoverContent
                  ? (props: any) => <SavePopoverContent item={item} onClose={props.onClose} />
                  : undefined
              }
              VisitPopoverContent={
                VisitPopoverContent
                  ? (props: any) => <VisitPopoverContent item={item} onClose={props.onClose} />
                  : undefined
              }
              SharePopoverContent={
                SharePopoverContent
                  ? (props: any) => <SharePopoverContent item={item} onClose={props.onClose} />
                  : undefined
              }
              EditDialogContent={
                EditDialogContent
                  ? (props: any) => <EditDialogContent item={item} onClose={props.onClose} />
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
