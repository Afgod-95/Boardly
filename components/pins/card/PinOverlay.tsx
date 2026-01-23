import { PinsLayout } from "@/components/boards/MoreActions";
import { Pencil, ChevronDown, ArrowUpRight, Upload } from "lucide-react";

//pin overlay
interface PinOverlayProps {
  showProfileButton: boolean;
  showSaveButton: boolean;
  showEditButton: boolean;
  profileValue?: string;
  layout?: PinsLayout,
  onProfileClick: (e: React.MouseEvent) => void;
  onSave: (e: React.MouseEvent) => void;
  onVisitSite: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
}

export default function PinOverlay({
  layout,
  profileValue,
  showProfileButton,
  showSaveButton,
  showEditButton,
  onProfileClick,
  onSave,
  onVisitSite,
  onShare,
  onEdit
}: PinOverlayProps) {
  return (
    <div className="absolute bg-black/40 inset-0 transition-opacity duration-300 rounded-2xl">
      {/* Top actions */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
        {showProfileButton ? (
          <button
            className="bg-transparent flex items-center gap-1 px-3 py-2 rounded-full transition-colors hover:bg-white/10"
            onClick={onProfileClick}
            aria-label="View profile"
          >
            <span className="text-lg font-semibold text-white">{profileValue}</span>
            <ChevronDown color="white" size={18} />
          </button>
        ) : (
          <div />
        )}

        {showSaveButton && (
          <button
            className="bg-violet-700 hover:bg-violet-800 text-white px-5 py-3 text-sm font-semibold rounded-full transition-colors"
            onClick={onSave}
            aria-label="Save pin"
          >
            Save
          </button>
        )}
      </div>

      {/* Bottom actions */}
      <div className="absolute bottom-3 left-3">
        <button
          className="bg-white/90 hover:bg-white p-2.5 rounded-xl flex items-center gap-2 transition-colors"
          onClick={onVisitSite}
          aria-label="Visit site"
        >
          <ArrowUpRight size={20} color="black" />
          {layout === 'standard' && (
            <>
              {!showEditButton ?
                (<span className="text-sm font-medium">Visit Site</span>) :
                (<span className="text-sm font-medium">Visit Site</span>)
              }
            </>

          )}

        </button>
      </div>

      <div className="absolute flex items-center gap-2 bottom-3 right-3">

        {showEditButton && (
          <button
            className="bg-white/90 hover:bg-white p-2.5 rounded-xl transition-colors"
            onClick={onShare}
            aria-label="Share pin"
          >
            <Pencil size={20} color="black" />
          </button>
        )}
        <button
          className="bg-white/90 hover:bg-white p-2.5 rounded-xl transition-colors"
          onClick={onEdit}
          aria-label="Edit pin"
        >
          <Upload size={20} color="black" />
        </button>
      </div>

      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/25 rounded-2xl -z-10" />
    </div>
  );
}