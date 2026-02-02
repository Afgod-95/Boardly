"use client";

import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useEffect, ReactNode } from 'react';
import clsx from 'clsx';
import { BottomSheetProps } from '@/types/bottomSheet';


const BottomSheet = ({
  isOpen,
  onClose,
  children,
  maxHeight = '50vh',
  showHandle = true,
  closeOnBackdropClick = true,
  dragToClose = true,
  dragThreshold = 100,
  velocityThreshold = 500,
}: BottomSheetProps) => {
  
  // Lock body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!dragToClose) return;
    
    const { offset, velocity } = info;
    if (offset.y > dragThreshold || velocity.y > velocityThreshold) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeOnBackdropClick ? onClose : undefined}
            className="block md:hidden fixed inset-0 bg-black/50 z-60"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ 
              type: 'spring', 
              damping: 30, 
              stiffness: 300 
            }}
            drag={dragToClose ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
            className="block md:hidden fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl shadow-2xl z-[70]"
            style={{ maxHeight }}
          >
            {/* Drag Handle */}
            {showHandle && (
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>
            )}

            {/* Content */}
            <div className="overflow-y-auto" style={{ maxHeight: `calc(${maxHeight} - 2rem)` }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;