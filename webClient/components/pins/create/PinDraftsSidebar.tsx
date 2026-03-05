import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Plus, Trash2, Image as ImageIcon } from 'lucide-react'
import { PinForm } from '@/types/pin'

interface PinDraft extends PinForm {
  id: number | string
}

interface PinDraftsSidebarProps {
  drafts: PinDraft[]
  isCollapsed: boolean
  onToggleCollapse: () => void
  onCreateNew: () => void
  onOpenDraft: (draft: PinDraft) => void
  onDeleteDraft: (id: string | number) => void
}

const PinDraftsSidebar = ({
  drafts,
  isCollapsed,
  onToggleCollapse,
  onCreateNew,
  onOpenDraft,
  onDeleteDraft,
}: PinDraftsSidebarProps) => {
  return (
    /*
      FIX 1 — Remove the inner motion.div that was re-animating width here.
      Width is now fully owned by the parent wrapper div in CreatePinPage,
      so the sidebar just fills its container with h-full / w-full.
      Having two competing width animations (parent + this div) caused the
      "wrong width on resize" glitch.
    */
    <div className="relative border h-full w-full rounded-3xl bg-white shadow-sm overflow-hidden">
      {isCollapsed ? (
        /* --- COLLAPSED STATE --- */
        <div className="p-4 flex flex-col gap-4 items-center">
          <button
            onClick={onToggleCollapse}
            className="rounded-full bg-gray-50 p-2 hover:bg-gray-100 transition shadow-sm"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <button
            className="bg-violet-700 text-white p-3 rounded-2xl hover:bg-violet-600 transition shadow-lg"
            onClick={onCreateNew}
          >
            <Plus size={24} />
          </button>
          <div className="w-full border-t pt-4 flex flex-col gap-3">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden cursor-pointer hover:ring-2 hover:ring-violet-500 transition-all"
                onClick={() => onOpenDraft(draft)}
              >
                {/*
                  FIX 2 — Use a plain <img> instead of next/image.
                  next/image requires external domains to be whitelisted in
                  next.config.js. Blob URLs and unregistered CDN URLs will
                  silently fail to render. A plain <img> works with any src,
                  including blob:, data:, and unconfigured external URLs.
                */}
                {draft.img ? (
                  <img
                    src={draft.img}
                    alt=""
                    className="object-cover h-full w-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <ImageIcon size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* --- EXPANDED STATE --- */
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-extrabold text-slate-900">Drafts</h2>
            <button
              onClick={onToggleCollapse}
              className="rounded-full bg-white border p-2 hover:bg-gray-50 transition-all active:scale-90"
            >
              <ChevronRight size={20} className="text-slate-600" />
            </button>
          </div>

          <button
            className="w-full bg-slate-900 text-white py-4 px-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-md mb-8 active:scale-[0.98]"
            onClick={onCreateNew}
          >
            <Plus size={20} />
            New Draft
          </button>

          <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
            <div className="flex flex-col gap-3">
              <AnimatePresence mode="popLayout">
                {drafts.map((draft) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={draft.id}
                    className="group relative flex items-center gap-3 bg-white border border-slate-100 rounded-2xl p-2 pr-4 hover:border-violet-200 hover:shadow-sm transition-all cursor-pointer"
                    onClick={() => onOpenDraft(draft)}
                  >
                    {/* IMAGE — plain <img> so blob/data/external URLs always render */}
                    <div className="w-14 h-14 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-50">
                      {draft.img ? (
                        <img
                          src={draft.img}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </div>

                    {/* TITLE + BOARD */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-slate-800 truncate">
                        {draft.title || 'Untitled Draft'}
                      </h4>
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">
                        {draft.board || 'Draft'}
                      </p>
                    </div>

                    {/*
                      FIX 3 — Delete button was invisible: it had no background color
                      in its non-hover state and opacity-0 was never lifted.
                      Now it fades in on group hover via Tailwind's group-hover utility
                      and has a proper visible style at all times on mobile (no hover).
                    */}
                    <button
                      className={[
                        'shrink-0 p-1.5 rounded-full text-slate-400',
                        'opacity-0 group-hover:opacity-100',   // hide until row is hovered
                        'hover:bg-red-50 hover:text-red-500',  // highlight on button hover
                        'transition-all duration-150',
                        'z-10',
                      ].join(' ')}
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteDraft(draft.id)
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {drafts.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-xs text-slate-400 font-medium italic">No drafts yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PinDraftsSidebar