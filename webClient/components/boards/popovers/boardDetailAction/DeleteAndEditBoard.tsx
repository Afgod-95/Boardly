import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { MoreHorizontal, Share2 } from 'lucide-react'
const BoardActions = () => {
  return (
    <>
      {/* ---------------- MORE BUTTON ---------------- */}
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center justify-center md:bg-gray-100 md:hover:bg-gray-200 md:p-4 rounded-3xl transition-all active:scale-95">
            <MoreHorizontal size={24} strokeWidth={2.5} />
          </div>
        </PopoverTrigger>

        <PopoverContent
          side="bottom"
          align="center"
          className="z-50 w-72 p-6 bg-background rounded-3xl shadow-2xl border border-gray-100 mt-2 "
        >
          <span className="block text-gray-500 font-medium  my-4">Board Actions</span>

          <div className="">
            <button className="w-full text-left p-4 hover:bg-gray-100 rounded-xl font-bold text-base">
              Edit board
            </button>
            <button className="w-full text-left p-4 hover:bg-gray-100 rounded-xl font-bold text-base text-red-600">
              Delete board
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}

export default BoardActions