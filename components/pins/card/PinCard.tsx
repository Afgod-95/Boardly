import { PinItem } from "@/types/pin";
import Image from "next/image";
import { Pencil, Ellipsis, ChevronDown, ArrowUpRight, Upload, Star } from "lucide-react";
import PinOverlay from "./PinOverlay";
import { PinsLayout } from "@/components/boards/MoreActions";


interface PinCardProps {
  item: PinItem;
  showStarIcon?: boolean,
 
  profileValue?: string,
  layout?: PinsLayout;
  index: number;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  showSaveButton: boolean;
  showEditButton: boolean;
  showProfileButton: boolean | string;
  showMetadata: string | boolean;
  onProfileClick: (e: React.MouseEvent) => void;
  onSave: (e: React.MouseEvent) => void;
  onVisitSite: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
  onMoreOptions: (e: React.MouseEvent) => void;
  onAddToFavorites?:(e: React.MouseEvent) => void;
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
  return (
    <div
      className="break-inside-avoid mb-2 cursor-pointer"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <div className="relative rounded-2xl overflow-hidden">
        <Image
          src={`${item.img}?w=248&fit=crop&auto=format`}
          alt={item.title}
          width={248}
          height={300}
          loading="lazy"
          className="w-full h-auto object-cover rounded-2xl"
        />

        {isHovered && (
          <PinOverlay
            profileValue={profileValue}
            layout={layout}
            showProfileButton={Boolean(showProfileButton)}
            showSaveButton={showSaveButton}
            showEditButton={showEditButton}
            onProfileClick={onProfileClick}
            onSave={onSave}
            onVisitSite={onVisitSite}
            onShare={onShare}
            onEdit={onEdit}
          />
        )}
      </div>

      {showMetadata && (
        <div className="flex justify-between items-center mt-2 px-1">
          <span className="text-sm font-medium text-gray-900">{item.title}</span>

          {showStarIcon === true ? (
            <button
              className="p-1 hover:bg-gray-100 rounded-sm transition-colors"
              onClick={onAddToFavorites}
              aria-label="More options"
            >
              <Star size={20} />
            </button>
          ) : (
            <button
              className="p-1 hover:bg-gray-100 rounded-sm transition-colors"
              onClick={onMoreOptions}
              aria-label="More options"
            >
              <Ellipsis size={20} color="black" />
            </button>
          )}

        </div>
      )}
    </div>
  );
}


