import { useRouter } from 'next/navigation'
import { BoardItem } from '@/types/board'
import { PinItem } from '@/types/pin'
import { SuggestedBoardCard } from './cards'
import PinsGrid from '../pins/grid/PinsGrid'

interface BoardSuggestionsProps {
  suggested: BoardItem[],
  allPins: PinItem[],
  unorganizedPins?: PinItem[]
}

const SuggestedBoards = ({ suggested = [], unorganizedPins, allPins }: BoardSuggestionsProps) => {
  const router = useRouter()
  return (
    <div className='space-y-6 pb-14'>
      <h2 className='font-bold text-xl pt-4'>Suggested Boards</h2>
      <div className="grid grid-cols-2  sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {suggested?.map((board, index) => {
          return (
            <SuggestedBoardCard key={index}
              board={board}
              allPins={allPins}
              onBoardClick={() => router.push(`/dashboard/boards/${board.id}`)}
            />
          )
        })}
      </div>


      {/* unorganized pins */}
      <div className='flex items-center justify-between'>
        <h2 className='font-bold text-xl'>Unorganized Pins</h2>
        <button className='px-5 py-2 text-sm md:text-lg font-medium bg-accent rounded-full transition-colors cursor-pointer text-foreground hover:bg-muted'>
          Organize
        </button>
      </div>


      <PinsGrid items={unorganizedPins} variant='board'
        actions={{
        }}
      />




    </div>
  )
}

export default SuggestedBoards