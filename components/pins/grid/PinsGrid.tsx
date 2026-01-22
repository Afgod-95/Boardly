import PinCard from '../card/PinCard';
import { PinItem } from '@/types/pin';
import clsx from 'clsx';
import usePinsHook from '@/hooks/usePinsHook';

type PinCardVariant = 'feed' | 'board' | 'pin';

interface PinsGridProps {
  items?: PinItem[];
  layout?: 'standard' | 'compact';
  variant: PinCardVariant;

  actions?: {
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
  layout,
  actions
}: PinsGridProps) {

  const { hoveredItem, hoveredIndex, handleClick } = usePinsHook();

  const {
    onItemClick,
    onProfileClick,
    onSave,
    onVisitSite,
    onShare,
    onEdit,
    onMoreOptions
  } = actions || {};

  // Derived states
  const showSaveButton = variant === 'feed' || variant === 'board' || variant === 'pin';
  const showEditButton = variant === 'pin' || variant === 'board';
  const showProfileButton = variant === 'feed';
  const showMetadata = variant === 'feed';

  // Grid column configuration
  const gridColumns = clsx(
    "gap-2",

    // default feed layout
    variant === "feed" && "columns-2 md:columns-3 lg:columns-4",

    // board layout
    variant === "board" && "columns-2 md:columns-4 lg:columns-5",

    // pin layout (controlled by dropdown)
    variant === "pin" &&
      (layout === "standard"
        ? "columns-1 md:columns-2 lg:columns-3"
        : "columns-2 md:columns-4 lg:columns-5")
  );

  return (
    <div className="w-full pb-14">
      <div className={gridColumns}>
        {items.map((item, index) => (
          <PinCard
            key={`${item.img}-${index}`}
            layout={layout}
            item={item}
            index={index}
            isHovered={hoveredIndex === index}
            onMouseEnter={() => hoveredItem(index)}
            onMouseLeave={() => hoveredItem(null)}
            onClick={() => onItemClick?.(item, index)}
            showSaveButton={showSaveButton}
            showEditButton={showEditButton}
            showProfileButton={showProfileButton}
            showMetadata={showMetadata}
            onProfileClick={(e) => handleClick(e, onProfileClick, item, index)}
            onSave={(e) => handleClick(e, onSave, item, index)}
            onVisitSite={(e) => handleClick(e, onVisitSite, item, index)}
            onShare={(e) => handleClick(e, onShare, item, index)}
            onEdit={(e) => handleClick(e, onEdit, item, index)}
            onMoreOptions={(e) => handleClick(e, onMoreOptions, item, index)}
          />
        ))}
      </div>
    </div>
  );
}
