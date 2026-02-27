
import { PinItem } from "@/types/pin";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import SmartPinsGrid from "@/components/shared/grid/SmartPinsGrid";

interface BoardDetailTabProps {
    boardId: string
    onAddToCanvas?: (pin: PinItem) => void;
}

const BoardDetailTab = ({ boardId, onAddToCanvas }: BoardDetailTabProps) => {

    const { boards } = useSelector((state: RootState) => state.boards)
    const pins = useSelector((state: RootState) => state.pins.pins)

    const board = boards.find((b) => b.id === boardId)

    if (!board) return <p className="text-center mt-20 text-gray-500">Board not found</p>

    const boardPins = board.pinIds
        .map((pinId) => pins.find((p) => p.id === pinId))
        .filter((p): p is typeof pins[number] => !!p)
   
    return (
        <div className="space-y-4">
            <SmartPinsGrid 
                items={boardPins}
                variant="collage"
                showPlusButton = {true}
                onAddToCanvasClick={(boardPin) => onAddToCanvas?.(boardPin)}
            />
        </div>
    )
}

export default BoardDetailTab