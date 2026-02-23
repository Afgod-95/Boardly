"use client"

import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { CreateBoardCard, BoardsCard } from "@/components/boards/cards"
import { useRouter } from "next/navigation"
import SuggestedBoards from "@/components/boards/SuggestedBoards"
import { BoardItem } from "@/types/board"
import { setBoards } from "@/redux/boardSlice"
import EditBoardModal from "@/components/boards/popovers/EditBoardModal"
import CreateBoardModal from "../popovers/CreateBoardModal"
import SmartPinsGrid from "@/components/shared/grid/SmartPinsGrid"

const BoardsPageContent = () => {
    const { pins } = useSelector((state: RootState) => state.pins)

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

    // Generate mock boards
    const mockBoards: BoardItem[] = useMemo(
        () => [
            {
                id: "1",
                title: "Travel Inspiration",
                pinIds: pins
                    .slice(0, 7)
                    .map((p) => p.id)
                    .filter((id): id is string | number => id !== undefined),
                createdByUser: true,
            },
            {
                id: "2",
                title: "Home Decor Ideas",
                pinIds: pins
                    .slice(0, 3)
                    .map((p) => p.id)
                    .filter((id): id is string | number => id !== undefined),
                createdByUser: false,
            },
            {
                id: "3",
                title: "Recipe Collection",
                pinIds: pins
                    .slice(0, 12)
                    .map((p) => p.id)
                    .filter((id): id is string | number => id !== undefined),
                createdByUser: true,
            },
            {
                id: "4",
                title: "Fashion",
                pinIds: pins
                    .slice(0, 2)
                    .map((p) => p.id)
                    .filter((id): id is string | number => id !== undefined),
                createdByUser: false,
            },
        ],
        [pins]
    )

    /**
     * FILTER + SORT PIPELINE
     */
    const processedBoards = useMemo(() => {
        let boards = [...mockBoards]

        // 1. Filter
        if (activeFilter === "all") {
            boards = boards.filter((board) => board.createdByUser === true)
        }

        if (activeFilter === "group") {
            boards = boards.filter((board) => board.createdByUser === false)
        }

        // 2. Sort
        if (sortBy === "A-Z") {
            boards.sort((a, b) => a.title.localeCompare(b.title))
        }

        if (sortBy === "LAST_ADDED") {
            // Since mock data has no createdAt,
            // simulate newest by ID descending
            boards.sort((a, b) => Number(b.id) - Number(a.id))
        }

        // CUSTOM keeps original order 
        return boards
    }, [mockBoards, activeFilter, sortBy])

    // Handle edit board
    const handleEditBoardItem = (item: BoardItem) => {
        setEditingBoard(item)
        setOpenBoardModal(true)
    }

    const handleCloseEditBoard = () => {
        setEditingBoard(null)
        setOpenBoardModal(false)
    }

    // Dispatch boards once when pins are ready
    useEffect(() => {
        if (pins.length > 0) {
            dispatch(setBoards(mockBoards))
        }
    }, [pins, dispatch, mockBoards])

    return (
        <div className="pb-8 md:pb-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 border-b pb-8">
                {processedBoards.length > 0 ? (
                    processedBoards.map((board) => (
                        <BoardsCard
                            key={board.id}
                            board={board}
                            previewPins={pins.filter((pin) =>
                                board.pinIds.includes(pin.id as string | number)
                            )}
                            onBoardClick={() =>
                                router.push(`/dashboard/boards/${board.id}`)
                            }
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
                            {activeFilter === "all" &&
                                "Start creating your own boards!"}
                            {activeFilter === "group" &&
                                "Start saving boards to see them here"}
                        </p>
                    </div>
                )}

                {!activeFilter && (
                    <div className="hidden md:block">
                        <CreateBoardCard variant="create">
                            <CreateBoardModal />
                        </CreateBoardCard>
                    </div>
                )}
            </div>

            {!activeFilter && (
                <div className="space-y-4 mt-6">
                    {/* unorganized pins */}
                    <div className='flex items-center justify-between'>
                        <h2 className='font-bold text-xl'>Unorganized Pins</h2>
                        <button className='px-5 py-2 text-sm md:text-lg font-medium bg-accent rounded-full transition-colors cursor-pointer text-foreground hover:bg-muted'>
                            Organize
                        </button>
                    </div>

                    <SmartPinsGrid variant="board"
                        items={pins}
                        showMetadata={false}
                    />

                </div>
            )}

            {editingBoard && (
                <EditBoardModal
                    isOpen={openBoardModal}
                    board={editingBoard}
                    onClose={handleCloseEditBoard}
                />
            )}
        </div>
    )
}

export default BoardsPageContent
