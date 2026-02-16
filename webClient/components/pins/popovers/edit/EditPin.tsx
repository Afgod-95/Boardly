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
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface PinEditFieldsProps {
    pin: PinItem;
    onChange: (updates: Partial<PinItem> & { id?: string | number }) => void;
    onSave: () => void;
    onDelete: () => void;
}

const EditPin = ({ pin, onChange, onSave, onDelete }: PinEditFieldsProps) => {
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

    return (
        <div className="w-full max-w-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">Edit Pin</h2>
            </div>

            {/* Scrollable Container */}
            <div className="no-scrollbar max-h-[60vh] overflow-y-auto px-1">
                <div className="flex flex-col sm:flex-row gap-5 items-start">

                    {/* Small Image Preview - Fixed size for consistency */}
                    <div className="w-24 sm:w-32 shrink-0 mx-auto sm:mx-0">
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-muted shadow-sm border">
                            <Image
                                src={pin.img}
                                alt={pin.title || "Pin"}
                                fill
                                sizes="(max-width: 640px) 96px, 128px"
                                className="object-cover"
                                priority
                            />
                        </div>
                        {pin.title && (
                            <p className="mt-2 text-[10px] font-medium text-center truncate text-muted-foreground">
                                {pin.title}
                            </p>
                        )}
                    </div>

                    {/* Board selection - Expands to fill space */}
                    <div className="flex-1 w-full min-w-0">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-foreground ml-1">
                                Board
                            </label>
                            <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                <Select
                                    value={selectedBoardId as string}
                                    onValueChange={handleBoardChange}
                                >
                                    <SelectTrigger className="h-11 w-full rounded-xl bg-background border transition-all">
                                        <SelectValue placeholder="Select a board" />
                                    </SelectTrigger>

                                    <SelectContent className="rounded-xl max-h-48">
                                        <SelectItem value="profile">Profile</SelectItem>
                                        {boards.map((board) => (
                                            <SelectItem key={board.id} value={board.id}>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                                                        {board.coverPinId ? (
                                                            <Image
                                                                src={board.coverPinId}
                                                                alt={board.title}
                                                                width={24}
                                                                height={24}
                                                                className="object-cover h-full w-full"
                                                            />
                                                        ) : (
                                                            <span className="text-[10px] font-bold">
                                                                {board.title.charAt(0).toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-sm truncate">
                                                        {board.title}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t">
                <motion.div whileTap={{ scale: 0.96 }}>
                    <Button
                        variant="ghost"
                        onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        className="rounded-full border h-10 px-4 text-xs font-bold text-muted-foreground hover:text-destructive transition-colors"
                    >
                        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                        Delete
                    </Button>
                </motion.div>

                <motion.div whileTap={{ scale: 0.96 }}>
                    <Button
                        onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            onSave();
                        }}
                        className="rounded-full h-10 px-8 text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white"
                    >
                        Save
                    </Button>
                </motion.div>
            </div>
        </div>
    );
};

export default EditPin;