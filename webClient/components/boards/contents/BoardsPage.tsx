"use client"

import { useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { CreateBoardCard, BoardsCard } from "@/components/boards/cards"
import { useRouter } from "next/navigation"
import { BoardItem } from "@/types/board"
import EditBoardModal from "@/components/boards/popovers/EditBoardModal"
import CreateBoardModal from "../popovers/CreateBoardModal"
import SmartPinsGrid from "@/components/shared/grid/SmartPinsGrid"
import CustomButton from "@/components/shared/buttons/CustomButton"
import UnorganizedPins from "../../pins/unorganized_pin_dialog/UnorganizedPins"
import { motion } from "framer-motion"
import { Bookmark, Sparkles } from "lucide-react"

const BoardsPage = () => {
    const { pins } = useSelector((state: RootState) => state.pins)
    const { boards } = useSelector((state: RootState) => state.boards)
    const [openDialog, setOpenDialog] = useState(false)

    const activeFilter = useSelector(
        (state: RootState) => state?.boardFilter?.boards?.activeFilter
    )
    const sortBy = useSelector(
        (state: RootState) => state?.boardFilter?.boards?.sortBy
    )

    const router = useRouter()
    const dispatch = useDispatch()

    const [editingBoard, setEditingBoard] = useState<BoardItem | null>(null)
    const [openBoardModal, setOpenBoardModal] = useState<boolean>(false)

    /**
     * FILTER + SORT PIPELINE
     * Bug fix: was calling .filter()/.sort() without returning the result
     */
    const processedBoards = useMemo(() => {
        let result = [...boards] // copy to avoid mutating Redux state

        // 1. Filter
        if (activeFilter === "all") {
            result = result.filter((board) => board.createdByUser === true)
        } else if (activeFilter === "group") {
            result = result.filter((board) => board.createdByUser === false)
        }

        // 2. Sort
        if (sortBy === "A-Z") {
            result = result.sort((a, b) => a.title.localeCompare(b.title))
        } else if (sortBy === "LAST_ADDED") {
            result = result.sort((a, b) => Number(b.id) - Number(a.id))
        }

        return result
    }, [boards, activeFilter, sortBy])

    // Pins saved by user but not yet assigned to any board
    const savedPins = useMemo(
        () => pins.filter((pin) => !pin.boardId),
        [pins]
    )

    console.log(JSON.stringify(pins.filter((pin) => !pin.boardId)))

    const handleEditBoardItem = (item: BoardItem) => {
        setEditingBoard(item)
        setOpenBoardModal(true)
    }

    const handleCloseEditBoard = () => {
        setEditingBoard(null)
        setOpenBoardModal(false)
    }

    return (
        <div className="max-w-screen-7xl mx-auto py-5 px-3 sm:px-5">
            <div className="pb-8 md:pb-8">

                {/* ── Boards grid ── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 border-b pb-8">
                    {processedBoards.length > 0 ? (
                        processedBoards.map((board) => (
                            <BoardsCard
                                key={board.id}
                                board={board}
                                previewPins={pins.filter((pin) =>
                                    board.pinIds.includes(pin.id as string | number)
                                )}
                                onBoardClick={() => router.push(`/dashboard/boards/${board.id}`)}
                                onEdit={(item) => handleEditBoardItem(item)}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            <p className="text-lg mb-2">
                                {activeFilter === "all" && "No boards created yet"}
                                {activeFilter === "group" && "No saved boards yet"}
                            </p>
                            <p className="text-sm">
                                {activeFilter === "all" && "Start creating your own boards!"}
                                {activeFilter === "group" && "Start saving boards to see them here"}
                            </p>
                        </div>
                    )}

                    {!activeFilter && (
                        <div className="hidden md:block">
                            <CreateBoardCard variant="create">
                                <CreateBoardModal onClose={() => setOpenBoardModal(false)} />
                            </CreateBoardCard>
                        </div>
                    )}
                </div>

                {/* ── Unorganized pins section ── */}
                {savedPins.length > 0 ? (
                    <div className="space-y-4 mt-6 w-full">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold text-xl">Unorganized Pins</h2>
                            <CustomButton
                                onClick={() => setOpenDialog(true)}
                                text="Organize"
                                className="px-5 py-2 text-sm md:text-base font-medium bg-accent rounded-full transition-colors cursor-pointer text-foreground hover:bg-muted"
                            />
                        </div>
                        <div className="px-0">
                            <SmartPinsGrid
                                variant="board"
                                isOrganized={false}
                                items={savedPins}
                                showMetadata={false}
                            />
                        </div>
                    </div>
                ) : (
                    /* ── Empty state: no saved pins ── */
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="mt-12 flex flex-col items-center justify-center text-center px-6 py-16 rounded-3xl bg-gradient-to-b from-muted/40 to-transparent"
                    >
                        {/* Icon cluster */}
                        <div className="relative mb-6">
                            <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center shadow-inner">
                                <Bookmark size={32} className="text-muted-foreground/50" strokeWidth={1.5} />
                            </div>
                            <motion.div
                                animate={{ y: [0, -4, 0] }}
                                transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                                className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-background shadow-md flex items-center justify-center border border-border"
                            >
                                <Sparkles size={14} className="text-amber-400" />
                            </motion.div>
                        </div>

                        <h3 className="text-xl font-bold text-foreground mb-2">
                            Start saving pins
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                            When you save pins, they'll appear here. Organize them into boards to keep your ideas tidy.
                        </p>

                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => router.push("/dashboard")}
                            className="mt-6 px-6 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-80 transition-opacity"
                        >
                            Explore pins
                        </motion.button>
                    </motion.div>
                )}

                <UnorganizedPins isOpen={openDialog} setIsOpen={() => setOpenDialog(false)} />

                {editingBoard && (
                    <EditBoardModal
                        isOpen={openBoardModal}
                        board={editingBoard}
                        onClose={handleCloseEditBoard}
                    />
                )}
            </div>
        </div>
    )
}

export default BoardsPage