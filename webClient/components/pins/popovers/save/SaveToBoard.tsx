// components/pins/popovers/save/SaveToBoard.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PinItem } from "@/types/pin";
import { BoardItem } from "@/types/board";
import { X } from "lucide-react";

interface SaveToBoardProps {
  pin: PinItem;
  boards: BoardItem[];
  onSave: (boardId: string) => void;
  onClose: () => void;
}

const SaveToBoard = ({ pin, boards, onSave, onClose }: SaveToBoardProps) => {
  const boardExists = boards.some((b) => b.id === pin.boardId);
  const selectedBoard =
    pin.boardId && boardExists ? String(pin.boardId) : "profile";

  const handleSave = () => {
    onSave(selectedBoard);
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Save to Board</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">
            Choose a board
          </label>

          <Select defaultValue={selectedBoard}>
            <SelectTrigger className="w-full rounded-xl px-4 py-3 h-auto text-sm sm:text-base">
              <SelectValue placeholder="Select a board" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="profile">Profile</SelectItem>
              {boards.map((board) => (
                <SelectItem key={board.id} value={board.id}>
                  {board.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSave}
          className="w-full rounded-full py-6 font-semibold bg-[#E60023] hover:bg-[#AD081B]"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default SaveToBoard;