import { BoardsCard } from "@/components/boards/cards"
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"

const YourBoardsTab = ({ onBoardClick }: { onBoardClick: (id: string) => void }) => {
    // fetch boards...
    const { boards } = useSelector((state: RootState) => state.boards)
    const { pins } = useSelector((state: RootState) => state.pins)
    return (
        <div className="flex flex-wrap gap-3">
            {boards.map(board => (
                <div key={board.id} className="w-[calc(50%-6px)]">
                    <BoardsCard
                        variant="collage"
                        board={board}
                        previewPins={pins.filter((pin) =>
                            board.pinIds.includes(pin.id as string | number)
                        )}
                        onBoardClick={() => onBoardClick(board.id)}
                    />
                </div>
            ))}
        </div>
    )
}

export default YourBoardsTab