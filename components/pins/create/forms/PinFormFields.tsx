import { PinForm } from '@/types/pin'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface PinFormFieldsProps {
  pin: PinForm
  onChange: (updates: Partial<PinForm>) => void
  onSaveDraft: () => void
  boards?: string[]
}

const PinFormFields = ({ 
  pin, 
  onChange, 
  onSaveDraft,
  boards = ['Travel', 'Food', 'Design', 'Fashion', 'Technology']
}: PinFormFieldsProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2">
          Title
        </label>
        <input
          type="text"
          placeholder="Like Advertising Ad"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={pin.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2">
          Description
        </label>
        <textarea
          placeholder="Tell everyone what your Pin is about"
          className="w-full border border-gray-300 rounded-xl p-3 min-h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={pin.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2">
          Board
        </label>
        <Select 
          value={pin.board || ''} 
          onValueChange={(value) => onChange({ board: value })}
        >
          <SelectTrigger className="w-full rounded-xl px-4 py-3 h-auto">
            <SelectValue placeholder="Choose a board" />
          </SelectTrigger>
          <SelectContent>
            {boards.map((board) => (
              <SelectItem key={board} value={board}>
                {board}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2">
          Destination link
        </label>
        <input
          type="text"
          placeholder="Add a destination link"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={pin.link || ''}
          onChange={(e) => onChange({ link: e.target.value })}
        />
      </div>

      <button
        className="mt-4 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition"
        onClick={onSaveDraft}
      >
        Save as Draft
      </button>
    </div>
  )
}

export default PinFormFields