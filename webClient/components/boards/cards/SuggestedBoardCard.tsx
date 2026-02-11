import CreateBoardCard from './CreateBoardCard'
import { PinItem } from "@/types/pin"
import { BoardItem } from '@/types/board'

interface SuggestedBoardCardProps {
    board: BoardItem,
    allPins: PinItem[] // pass all pins so we can map pinIds -> PinItem
    onBoardClick: () => void
}


const SuggestedBoardCard = ({ board, allPins, onBoardClick }: SuggestedBoardCardProps) => {

    // Get preview pins for UI 
    const previewPins = (allPins.filter(pin => pin.id !== undefined
        && board.pinIds.includes(pin.id)).slice(0, 5)
    )
    const pinCount = board.pinIds.length
    return (
        <div onClick={onBoardClick}>
            <CreateBoardCard
                pin={previewPins}
                variant="suggestion"
            />
            {/* Board suggestion info */}
            <div className="mt-3 px-1">
                <h3 className="font-semibold text-base line-clamp-1">
                    {board.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                    {pinCount} {'pins'}
                </p>
            </div>
        </div>

    )
}

export default SuggestedBoardCard