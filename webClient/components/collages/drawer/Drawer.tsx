import { AnimatePresence, motion } from "framer-motion"
import clsx from "clsx"
import { X } from "lucide-react"

// ─────────────────────────────────────────────────────────────────────────────
// Drawer
// ─────────────────────────────────────────────────────────────────────────────
interface DrawerProps {
    open: boolean
    onClose: () => void
    side: 'left' | 'right'
    children: React.ReactNode
}

const Drawer: React.FC<DrawerProps> = ({ open, onClose, side, children }) => (
    <AnimatePresence>
        {open && (
            <>
                <motion.div
                    key="backdrop"
                    className="fixed inset-0 bg-black/30 z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                />
                <motion.div
                    key="drawer"
                    className={clsx(
                        'fixed top-0 bottom-0 z-50 max-w-lg shadow-2xl bg-background overflow-y-hidden',
                        side === 'left' ? 'left-0' : 'right-0 w-80'
                    )}
                    initial={{ x: side === 'left' ? '-100%' : '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: side === 'left' ? '-100%' : '100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    <div className="flex items-center justify-between px-4 py-3 border-b bg-background sticky top-0 z-10">
                        <span className="font-semibold text-sm text-gray-700">
                            {side === 'left' ? 'Layers & Background' : 'Properties'}
                        </span>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                    <div className="h-full">{children}</div>
                </motion.div>
            </>
        )}
    </AnimatePresence>
)

export default Drawer