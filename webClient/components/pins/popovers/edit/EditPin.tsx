import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RootState } from "@/redux/store";
import { PinItem } from "@/types/pin";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { X, Trash2, ChevronDown } from "lucide-react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PinEditFieldsProps {
    pin: PinItem;
    onChange: (updates: Partial<PinItem> & { id?: string | number }) => void;
    onSave: () => void;
    onDelete: () => void;
    onClose: () => void;
}

const EditPin = ({ pin, onChange, onSave, onDelete, onClose }: PinEditFieldsProps) => {
    const boards = useSelector((state: RootState) => state.boards.boards);
    const [selectedBoardId, setSelectedBoardId] = useState(
        pin.boardId || "profile"
    );

    if (!pin) return null;

    const handleBoardChange = (boardId: string) => {
        setSelectedBoardId(boardId);
        onChange({
            id: pin.id,
            boardId: boardId === "profile" ? undefined : boardId,
        });
    };


    const selectedBoardData = boards.find((b) => b.id === selectedBoardId);

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Edit this Pin</h2>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Left side - Board selection */}
                <div className="flex-1 flex flex-col">
                    <div className="mb-6">
                        <label className="text-sm font-semibold mb-3 block">
                            Board
                        </label>

                        <Select
                            value={selectedBoardId as string}
                            onValueChange={handleBoardChange}
                        >
                            <SelectTrigger className="h-12 rounded-xl">
                                <SelectValue placeholder="Select a board" />
                            </SelectTrigger>

                            <SelectContent className="rounded-xl">
                                {/* Profile option */}
                                <SelectItem value="profile">
                                    Profile
                                </SelectItem>

                                {/* Boards */}
                                {boards.map((board) => (
                                    <SelectItem key={board.id} value={board.id}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
                                                {board.coverPinId ? (
                                                    <Image
                                                        src={board.coverPinId}
                                                        alt={board.title}
                                                        width={24}
                                                        height={24}
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-xs font-semibold">
                                                        {board.title.charAt(0).toUpperCase()}
                                                    </span>
                                                )}
                                            </div>

                                            <span className="text-sm font-medium">
                                                {board.title}
                                            </span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                </div>

                {/* Right side - Pin preview */}
                <div className="w-full md:w-[280px] flex-shrink-0">
                    <div className="sticky top-0">
                        <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
                            <Image
                                src={pin.img}
                                alt={pin.title || "Pin"}
                                fill
                                sizes="280px"
                                className="object-cover"
                            />
                        </div>
                        {pin.title && (
                            <p className="mt-3 text-sm font-semibold text-center truncate">
                                {pin.title}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t">
                {/* Delete Button */}
                <Button
                    variant="outline"
                    onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        onDelete();
                    }}
                    className="rounded-full px-6 py-5 font-semibold border-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                </Button>

                <div className="flex gap-3">
                    {/* Cancel Button */}
                    <Button
                        variant="outline"
                        onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                            onClose();
                        }}
                        className="rounded-full px-6 py-5 font-semibold"
                    >
                        Cancel
                    </Button>
                    {/* Save Button */}
                    <Button
                        onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                            onSave();
                        }}
                        className="rounded-full px-8 py-5 font-semibold bg-[#E60023] hover:bg-[#AD081B]"
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EditPin;