import { PinsLayout } from "@/components/boards/MoreActions";
import { Pencil, ChevronDown, ArrowUpRight, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

//pin overlay
interface PinOverlayProps {
  showProfileButton?: boolean;
  showSaveButton?: boolean;
  showEditButton?: boolean;
  profileValue?: string;
  layout?: PinsLayout,
  onProfileClick: (e: React.MouseEvent) => void;
  onSave: (e: React.MouseEvent) => void;
  onVisitSite: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
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
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveClick = (e: React.MouseEvent) => {
    // Set saved state
    setIsSaved(true);
    
    // Create particles
    const newParticles: Particle[] = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: 0,
      y: 0,
    }));
    
    setParticles(newParticles);
    
    // Remove particles after animation
    setTimeout(() => {
      setParticles([]);
    }, 1000);
    
    onSave(e);
  };

  return (
    <div className="absolute bg-black/40 inset-0 transition-opacity duration-300 rounded-2xl">
      {/* Top actions */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
        {showProfileButton ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-transparent flex items-center gap-1 px-3 py-2 rounded-full transition-colors hover:bg-white/10"
            onClick={onProfileClick}
            aria-label="View profile"
          >
            <span className="text-lg font-semibold text-white">{profileValue}</span>
            <ChevronDown color="white" size={18} />
          </motion.button>
        ) : (
          <div />
        )}

        {showSaveButton && (
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${
                isSaved 
                  ? 'bg-black hover:bg-black/90' 
                  : 'bg-violet-700 hover:bg-violet-800'
              } text-white px-5 py-3 text-sm font-semibold rounded-full transition-colors`}
              onClick={handleSaveClick}
              aria-label={isSaved ? "Saved" : "Save pin"}
            >
              {isSaved ? 'Saved' : 'Save'}
            </motion.button>
            
            {/* Animated particles */}
            <AnimatePresence>
              {particles.map((particle, index) => {
                const angle = (index / particles.length) * Math.PI * 2;
                const distance = 60;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                
                return (
                  <motion.div
                    key={particle.id}
                    initial={{ 
                      x: 0, 
                      y: 0, 
                      scale: 0,
                      opacity: 1 
                    }}
                    animate={{ 
                      x, 
                      y, 
                      scale: [0, 1.2, 0],
                      opacity: [1, 1, 0]
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 0.8,
                      ease: "easeOut"
                    }}
                    className="absolute top-1/2 left-1/2 w-3 h-3 bg-violet-400 rounded-full pointer-events-none"
                    style={{ 
                      transformOrigin: 'center',
                    }}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="absolute bottom-3 left-3">
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 1)" }}
          whileTap={{ scale: 0.95 }}
          className="bg-white/90 p-2.5 rounded-xl flex items-center gap-2 transition-colors"
          onClick={onVisitSite}
          aria-label="Visit site"
        >
          <ArrowUpRight size={20} color="black" />
          {layout === 'standard' && (
            <>
              {!showEditButton ?
                (<span className="text-sm font-medium hidden">Visit Site</span>) :
                null
              }
            </>
          )}
        </motion.button>
      </div>

      <div className="absolute flex items-center gap-2 bottom-3 right-3">
        {showEditButton && (
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 1)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/90 p-2.5 rounded-xl transition-colors"
            onClick={onShare}
            aria-label="Share pin"
          >
            <Pencil size={20} color="black" />
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 1)" }}
          whileTap={{ scale: 0.95 }}
          className="bg-white/90 p-2.5 rounded-xl transition-colors"
          onClick={onEdit}
          aria-label="Edit pin"
        >
          <Upload size={20} color="black" />
        </motion.button>
      </div>

      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/25 rounded-2xl -z-10" />
    </div>
  );
}