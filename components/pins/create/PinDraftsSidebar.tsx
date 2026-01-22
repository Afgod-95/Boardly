import { motion } from 'framer-motion'
import { ChevronRight, ChevronLeft, Plus } from 'lucide-react'
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
}
const PinDraftsSidebar = ({
  drafts,
  isCollapsed,
  onToggleCollapse,
  onCreateNew,
  onOpenDraft,
}: PinDraftsSidebarProps) => {
  return (
    <div className="relative border h-screen rounded-2xl">
      <motion.div
        className="overflow-hidden h-fit sticky top-8"
        animate={{
          width: isCollapsed ? '60px' : '320px',
        }}
        transition={{ duration: 0.3 }}
      >
        {isCollapsed ? (
          <div className="p-3 flex flex-col gap-3 items-center border-b">
            <button
              onClick={onToggleCollapse}
              className="rounded-full bg-white border p-2 hover:bg-gray-50 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="bg-foreground text-white p-3 rounded-full hover:bg-foreground/20 transition"
              onClick={onCreateNew}
            >
              <Plus size={20} />
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Pin Drafts</h2>
              <button
                onClick={onToggleCollapse}
                className="rounded-full bg-white border shadow-md p-2 hover:bg-gray-50 transition"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <button
              className="w-full bg-foreground text-white py-3 px-4 rounded-full font-semibold hover:bg-foreground/20 transition flex items-center justify-center gap-2 mb-4"
              onClick={onCreateNew}
            >
              <Plus size={20} />
              Create New Pin
            </button>

            <div className="pt-8">
              <div className="flex flex-col gap-3">
                {drafts.map((draft) => (
                  <button
                    key={draft.id}
                    className="border border-gray-200 rounded-xl p-3 text-left hover:bg-gray-50 transition"
                    onClick={() => onOpenDraft(draft)}
                  >
                    <div className="font-semibold text-sm mb-1 line-clamp-2">
                      {draft.title}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded-full">
                        {draft.board || 'No board'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default PinDraftsSidebar