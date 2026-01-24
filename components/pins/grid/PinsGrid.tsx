"use client"

import { motion, Variants } from 'framer-motion';
import PinCard from '../card/PinCard';
import { PinItem } from '@/types/pin';
import clsx from 'clsx';
import usePinsHook from '@/hooks/usePinsHook';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setSelectedPin } from '@/redux/pinSlice';
import { containerVariants, itemVariants } from '@/utils/animationsVariants';

export type PinCardVariant = 'feed' | 'board' | 'pin';

interface PinsGridProps {
  items?: PinItem[];
  layout?: 'standard' | 'compact';
  variant: PinCardVariant;
  showMetadata?: string | boolean;
  showStarIcon?: boolean;
  profileValue?: string;
  actions?: {
    onItemAddToFavourites?: (item: PinItem, index: number) => void;
    onItemClick?: (item: PinItem, index: number) => void;
    onProfileClick?: (item: PinItem, index: number) => void;
    onSave?: (item: PinItem, index: number) => void;
    onVisitSite?: (item: PinItem, index: number) => void;
    onShare?: (item: PinItem, index: number) => void;
    onEdit?: (item: PinItem, index: number) => void;
    onMoreOptions?: (item: PinItem, index: number) => void;
  };
}




export default function PinsGrid({
  items = [],
  variant = 'feed',
  layout = 'standard',
  showStarIcon,
  profileValue,
  showMetadata,
  actions
}: PinsGridProps) {
  const { hoveredItem, hoveredIndex, handleClick } = usePinsHook();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const {
    onItemClick,
    onProfileClick,
    onSave,
    onVisitSite,
    onShare,
    onEdit,
    onMoreOptions,
    onItemAddToFavourites
  } = actions || {};

  const showSaveButton = ['feed', 'board', 'pin'].includes(variant);
  const showEditButton = ['pin', 'board'].includes(variant);
  const showProfileButton = variant === 'feed' || variant === 'board';

  const gridColumns = clsx(
    "gap-4 w-full", 
    variant === "feed" && (layout === "standard" ? "columns-2 md:columns-3 lg:columns-4 2xl:columns-5" : "columns-2 md:columns-4 lg:columns-5 2xl:columns-6"),
    variant === "board" && (layout === "standard" ? "columns-2 md:columns-3 lg:columns-4 2xl:columns-5" : "columns-3 md:columns-5 lg:columns-6"),
    variant === "pin" && (layout === "standard" ? "columns-2 md:columns-2 lg:columns-3" : "columns-2 md:columns-4 lg:columns-5")
  );

  return (
    <div className="w-full pb-14">
      <motion.div 
        className={gridColumns}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item, index) => (
          <motion.div 
            key={`${item.img}-${index}`} 
            className="break-inside-avoid mb-4"
            variants={itemVariants} 
          >
            <PinCard
              profileValue={profileValue}
              layout={layout}
              item={item}
              index={index}
              showStarIcon={showStarIcon}
              showMetadata={variant === 'feed' ? true : showMetadata ?? false}
              isHovered={hoveredIndex === index}
              onMouseEnter={() => hoveredItem(index)}
              onMouseLeave={() => hoveredItem(null)}
              onClick={() => { 
                dispatch(setSelectedPin(item)) 
                router.push(`/dashboard/pins/${item?.id}`)
              }}
              showSaveButton={showSaveButton}
              showEditButton={showEditButton}
              showProfileButton={showProfileButton}
              onProfileClick={(e) => handleClick(e, onProfileClick, item, index)}
              onSave={(e) => handleClick(e, onSave, item, index)}
              onVisitSite={(e) => handleClick(e, onVisitSite, item, index)}
              onShare={(e) => handleClick(e, onShare, item, index)}
              onEdit={(e) => handleClick(e, onEdit, item, index)}
              onMoreOptions={(e) => handleClick(e, onMoreOptions, item, index)}
              onAddToFavorites={(e) => handleClick(e, onItemAddToFavourites, item, index)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}