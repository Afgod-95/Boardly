import { PinItem } from "@/types/pin";
import { BoardItem } from "@/types/board";

export interface BoardsCardProps {
    variant?: 'collage' | 'board'
    board: BoardItem
    previewPins: PinItem[]
    onEdit?: (item: BoardItem) => void
    onBoardClick: () => void
}