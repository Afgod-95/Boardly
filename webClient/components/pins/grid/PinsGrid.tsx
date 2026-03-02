"use client";

import { motion } from "framer-motion";
import PinCard from "../card/PinCard";
import { PinItem } from "@/types/pin";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setSelectedPin } from "@/redux/pinSlice";
import { itemVariants } from "@/utils/animations";
import usePinHook from "@/components/pins/hooks/usePinHook";
import { PinCardSkeleton } from "../card/PinCardSkeleton";
import { useEffect, useRef } from "react";

export type PinCardVariant = "feed" | "board" | "pin" | "detail" | "collage";

interface PinsGridProps {
  items?: PinItem[];
  layout?: "standard" | "compact";
  variant: PinCardVariant;
  showMetadata?: boolean;
  showStarIcon?: boolean;
  profileValue?: string;
  showPlusButton?: boolean;
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  skeletonCount?: number;
  onLoadMore?: () => void;
  onAddToCanvasClick?: (item: PinItem) => void;

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
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  skeletonCount = 12,
  onLoadMore,
  PopoverComponents,
  popoverComponents,
  ...props
}: PinsGridProps) {
  const { hoveredItem, hoveredIndex } = usePinHook();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const sentinelRef = useRef<HTMLDivElement>(null);

  // ── Infinite scroll via IntersectionObserver ──────────────────────────────
  useEffect(() => {
    if (!onLoadMore || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage && !isLoading) {
          onLoadMore();
        }
      },
      { rootMargin: "200px" }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [onLoadMore, hasNextPage, isFetchingNextPage, isLoading]);

  // ── Popover destructuring ─────────────────────────────────────────────────
  const {
    ProfilePopoverContent,
    SavePopoverContent,
    VisitPopoverContent,
    SharePopoverContent,
    EditDialogContent,
  } = PopoverComponents || {};

  const { MoreOptionsPopoverContent, FavoritesPopoverContent } = popoverComponents || {};

  const showSaveButton = ["feed", "board", "pin", "detail"].includes(variant);
  const showEditButton = ["pin", "board"].includes(variant);
  const showProfileButton = variant === "feed" || variant === "board" || variant === "detail";
  const saveMode = variant === "board" ? "popover" : "instant";
  const resolvedShowMetadata = variant === "feed" ? true : showMetadata;

  // ── Column classes ────────────────────────────────────────────────────────
  const gridColumns = clsx(
    "gap-2 sm:gap-4 w-full",
    variant === "feed" && "columns-2 sm:columns-3 md:columns-3 lg:columns-4 2xl:columns-7",
    variant === "board" &&
      (layout === "standard"
        ? "columns-2 sm:columns-3 md:columns-3 lg:columns-4 2xl:columns-7"
        : "columns-2 sm:columns-4 md:columns-4 2xl:columns-7"),
    variant === "pin" &&
      (layout === "standard"
        ? "columns-1 md:columns-3 lg:columns-5 xl:columns-4"
        : "columns-2 md:columns-4 lg:columns-6 2xl:columns-7"),
    variant === "detail" && "columns-2 md:columns-2 2xl:columns-3",
    variant === "collage" && "columns-2"
  );

  // ── Initial load: show skeleton only, no motion wrapper ──────────────────
  if (isLoading) {
    return (
      <div className="w-full">
        <div className={gridColumns}>
          {Array.from({ length: skeletonCount }, (_, i) => (
            <div key={i} className="break-inside-avoid mb-2">
              <PinCardSkeleton index={i} showMetadata={resolvedShowMetadata} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div className="w-full">
      <div className={gridColumns}>
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            className="break-inside-avoid mb-2"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <PinCard
              {...props}
              showPlusButton={props.showPlusButton}
              onAddToCanvasClick={
                props.onAddToCanvasClick
                  ? () => props.onAddToCanvasClick?.(item)
                  : undefined
              }
              item={item}
              profileValue={profileValue}
              layout={layout}
              saveMode={saveMode}
              showMetadata={resolvedShowMetadata}
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
              /* ── Popovers ── */
              ProfilePopoverContent={
                ProfilePopoverContent
                  ? (p: any) => <ProfilePopoverContent item={item} onClose={p.onClose} />
                  : undefined
              }
              SavePopoverContent={
                SavePopoverContent
                  ? (p: any) => <SavePopoverContent item={item} onClose={p.onClose} />
                  : undefined
              }
              VisitPopoverContent={
                VisitPopoverContent
                  ? (p: any) => <VisitPopoverContent item={item} onClose={p.onClose} />
                  : undefined
              }
              SharePopoverContent={
                SharePopoverContent
                  ? (p: any) => <SharePopoverContent item={item} onClose={p.onClose} />
                  : undefined
              }
              EditDialogContent={
                EditDialogContent
                  ? (p: any) => <EditDialogContent item={item} onClose={p.onClose} />
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

        {/* ── Fetch-next-page skeletons appended inline ── */}
        {isFetchingNextPage &&
          Array.from({ length: 6 }, (_, i) => (
            <div key={`next-${i}`} className="break-inside-avoid mb-2">
              <PinCardSkeleton index={i} showMetadata={resolvedShowMetadata} />
            </div>
          ))}
      </div>

      {/* ── Sentinel: triggers onLoadMore when scrolled into view ── */}
      {hasNextPage && <div ref={sentinelRef} className="h-1 w-full" />}
    </div>
  );
}