import { PinForm } from '@/types/pin'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { motion } from 'framer-motion'
import { Link as LinkIcon, Info, LayoutGrid } from 'lucide-react'

interface PinFormFieldsProps {
  pin: PinForm
  onChange: (updates: Partial<PinForm>) => void
  onSaveDraft?: () => void 
  boards?: string[]
}

const PinFormFields = ({
  pin,
  onChange,
  onSaveDraft,
  boards = ['Travel', 'Food', 'Design', 'Fashion', 'Technology']
}: PinFormFieldsProps) => {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-10 max-w-2xl mx-auto w-full"
    >
      {/* --- TITLE: Minimalist Canvas Style --- */}
      <motion.div variants={itemVariants} className="group">
        <input
          type="text"
          placeholder="Add your title"
          className="w-full bg-transparent text-3xl md:text-4xl font-extrabold text-slate-900 outline-none placeholder:text-slate-200 border-b-2 border-slate-100 focus:border-violet-500 transition-all duration-300 pb-4"
          value={pin.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
        <div className="flex justify-end mt-2">
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            {pin.title.length} / 100
          </span>
        </div>
      </motion.div>

      {/* --- DESCRIPTION: Distraction-Free --- */}
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="flex items-center gap-2 text-slate-400">
          <Info size={14} />
          <label className="text-[10px] font-bold uppercase tracking-widest">Description</label>
        </div>
        <textarea
          placeholder="Tell everyone what your Pin is about..."
          className="w-full bg-slate-50/50 rounded-2xl p-5 min-h-35 resize-none outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all duration-300 text-slate-700 placeholder:text-slate-300"
          value={pin.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </motion.div>

      {/* --- TWO COLUMN GRID FOR SETTINGS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* BOARD SELECTION */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="flex items-center gap-2 text-slate-400">
            <LayoutGrid size={14} />
            <label className="text-[10px] font-bold uppercase tracking-widest">Board</label>
          </div>
          <Select
            value={pin.board || ''}
            onValueChange={(value) => onChange({ board: value })}
          >
            <SelectTrigger className="w-full rounded-2xl bg-white border-none ring-1 ring-slate-100 hover:ring-slate-200 px-5 py-6 h-auto transition-all shadow-sm">
              <SelectValue placeholder="Choose a board" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
              {boards.map((board) => (
                <SelectItem key={board} value={board} className="rounded-xl py-3 cursor-pointer">
                  {board}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* DESTINATION LINK */}
        <motion.div variants={itemVariants} className="space-y-3 group">
          <div className="flex items-center gap-2 text-slate-400 group-focus-within:text-violet-500 transition-colors">
            <LinkIcon size={14} />
            <label className="text-[10px] font-bold uppercase tracking-widest">Link</label>
          </div>
          <input
            type="text"
            placeholder="Add a link"
            className="w-full rounded-2xl bg-white ring-1 ring-slate-100 focus:ring-2 focus:ring-violet-500 px-5 py-3 h-auto outline-none transition-all shadow-sm text-slate-600 placeholder:text-slate-300"
            value={pin.link || ''}
            onChange={(e) => onChange({ link: e.target.value })}
          />
        </motion.div>
      </div>

      {/* AUTO-SAVE STATUS INDICATOR */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between pt-6 border-t border-slate-50"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <p className="text-[11px] font-medium text-slate-400 italic">
            All changes are saved to your drafts automatically.
          </p>
        </div>

        {/* Optional Manual Save - Styled as a secondary action */}
        {onSaveDraft && (
          <button
            onClick={onSaveDraft}
            className="text-[11px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
          >
            Save Draft Now
          </button>
        )}
      </motion.div>
    </motion.div>
  )
}

export default PinFormFields