import { PinItem } from "@/webClient/types/pin";
import { BoardItem } from "@/webClient/types/board";

export interface BoardsCardProps {
    board: BoardItem
    previewPins: PinItem[]
    onBoardClick: () => void
}