"use client";

import { motion } from "framer-motion";
import PinCard from "../card/PinCard";
import { PinItem } from "@/types/pin";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setSelectedPin } from "@/redux/pinSlice";
import { itemVariants } from "@/utils/animations/animations";
import usePinHook from "@/components/hooks/usePinHook";
import { PinCardSkeleton } from "../card/PinCardSkeleton";
import { useEffect, useRef } from "react";

export type PinCardVariant = "feed" | "board" | "pin" | "detail" | "collage";

interface PinsGridProps {
  items?: PinItem[];
  isSaved?: boolean
  layout?: "standard" | "compact";
  variant: PinCardVariant;
  showMetadata?: boolean;
  showStarIcon?: boolean;
  profileValue?: (pin: PinItem) => string | undefined;
  showPlusButton?: boolean;
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  skeletonCount?: number;
  onLoadMore?: () => void;
  onAddToCanvasClick?: (item: PinItem) => void;
  onClick?: (item: PinItem) => void;

  // is organized 
  isOrganized?: boolean

  /** Popover content components */
  PopoverComponents?: {
    ProfilePopoverContent?: React.ComponentType<{
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
    SharePopoverContent,
    EditDialogContent,
  } = PopoverComponents || {};

  const { MoreOptionsPopoverContent, FavoritesPopoverContent } = popoverComponents || {};

  const showSaveButton = ["feed", "board", "pin", "detail"].includes(variant);
  const showEditButton = ["pin", "board"].includes(variant);
  const showProfileButton = variant === "feed" || variant === "board" || variant === "detail";
  const resolvedShowMetadata = variant === "feed" ? true : showMetadata;

  // ── Column classes ────────────────────────────────────────────────────────
  //
  // Breakpoints (Tailwind defaults, no sidebar offset needed):
  //   sm  640px   sm phone landscape / small tablet
  //   md  768px   tablet portrait
  //   lg  1024px  tablet landscape / small laptop
  //   xl  1280px  laptop
  //   2xl 1536px  desktop / wide monitor
  //
  // Rule: always at least 2 columns. Scale up smoothly without jumping too
  // many columns at once, which causes jarring reflow on resize.
  //
  const gridColumns = clsx(
    "gap-2 w-full",

    // ── feed ─────────────────────────────────────────────────────────────────
    // Public explore / home feed — full viewport width, most generous scaling.
    variant === "feed" &&
    "px-2 sm:px-5 columns-2 md:columns-3 lg:columns-4 xl:columns-6 2xl:columns-7 3xl:columns-8",

    // ── board ─────────────────────────────────────────────────────────────────
    // Curated pin collection — matches feed density but with a tighter max.
    variant === "board" &&
    (layout === "standard"
      ? "columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 2xl:columns-7"
      : "columns-2 sm:columns-3 md:columns-5 lg:columns-6 xl:columns-7 2xl:columns-8"),

    // ── pin ───────────────────────────────────────────────────────────────────
    // Related pins shown beneath a pin detail — content width is narrower
    // because the detail card occupies space above, so cap lower.
    variant === "pin" &&
    (layout === "standard"
      ? "columns-2 sm:columns-3 md:columns-3 lg:columns-4 xl:columns-4 2xl:columns-5"
      : "columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-5 2xl:columns-6"),

    // ── detail ────────────────────────────────────────────────────────────────
    // Sidebar-style related content panel — intentionally stays narrow,
    // never goes above 3 columns even on very wide screens.
    variant === "detail" &&
    "columns-2 sm:columns-2 md:columns-2 lg:columns-3 2xl:columns-3",

    // ── collage ───────────────────────────────────────────────────────────────
    // Fixed creative canvas — 2 columns is intentional at all sizes.
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
              showMetadata={resolvedShowMetadata}
              isHovered={hoveredIndex === index}
              onMouseEnter={() => hoveredItem(index)}
              onMouseLeave={() => hoveredItem(null)}
              onClick={() => {
                props.onClick?.(item);
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