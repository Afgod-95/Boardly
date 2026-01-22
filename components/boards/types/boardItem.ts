import { PinItem } from "@/types/pin";
import { BoardItem } from "@/types/board";

export interface BoardsCardProps {
    board: BoardItem
    previewPins: PinItem[]
    onBoardClick: () => void
}