"use client";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// Varied aspect ratios to mimic real Pinterest image distribution
const ASPECT_RATIOS = [
  "75%",   // landscape-ish
  "100%",  // square
  "120%",  // portrait
  "140%",  // tall portrait
  "160%",  // very tall
  "110%",
  "130%",
  "90%",
];

interface PinCardSkeletonProps {
  showMetadata?: boolean;
  index?: number; // pass the map index for deterministic heights
}

export function PinCardSkeleton({ showMetadata, index = 0 }: PinCardSkeletonProps) {
  const paddingBottom = ASPECT_RATIOS[index % ASPECT_RATIOS.length];

  return (
    <>
      <Skeleton className="w-full rounded-3xl bg-gray-200 overflow-hidden relative">
        <div className="w-full" style={{ paddingBottom }} />
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/40 to-transparent" />
      </Skeleton>

      {showMetadata && (
        <div className="flex items-center justify-between mt-3 px-2 gap-3">
          <Skeleton className="h-3.5 rounded-full bg-gray-200 flex-1" />
          <Skeleton className="h-8 w-8 rounded-full bg-gray-200 shrink-0" />
        </div>
      )}
    </>
  );
}