// components/shared/PinSavedToast.tsx
"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCheck, X } from "lucide-react"
import Image from "next/image"
import { usePinToast } from "@/components/hooks/usePinToast"

export function PinSavedToast() {
  const { toast, hide } = usePinToast()

  // Auto-dismiss
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(hide, 3500)
    return () => clearTimeout(t)
  }, [toast, hide])

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-9999 pointer-events-none">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.pinId}
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="pointer-events-auto flex items-center gap-3 pl-2 pr-4 py-2 rounded-2xl bg-white shadow-xl border border-black/5 min-w-[260px] max-w-[340px]"
          >
            {/* Pin thumbnail */}
            <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
              {toast.pinImg ? (
                <Image
                  src={toast.pinImg}
                  alt={toast.pinTitle ?? "Pin"}
                  fill
                  className="object-cover"
                  sizes="44px"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-violet-100 to-violet-200" />
              )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <CheckCheck size={13} className="text-violet-500 shrink-0" strokeWidth={2.5} />
                <span className="text-xs font-semibold text-violet-600">Saved</span>
              </div>
              <p className="text-[13px] font-semibold text-gray-900 truncate leading-tight">
                {toast.pinTitle ?? "Pin"}
              </p>
              <p className="text-[11px] text-gray-400 truncate">
                {toast.boardName === "your profile"
                  ? "Saved to profile"
                  : <>to <span className="text-gray-600 font-medium">{toast.boardName}</span></>
                }
              </p>
            </div>

            {/* Dismiss */}
            <button
              onClick={hide}
              className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <X size={12} className="text-gray-400" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}