"use client"

import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { CreateBoardCard } from "@/components/boards/cards"
import { useRouter } from "next/navigation"
import { BoardsCard } from "@/components/boards/cards"
import SuggestedBoards from "@/components/boards/SuggestedBoards"
import { BoardItem } from "@/types/board"
import { setBoards } from "@/redux/boardSlice"
import EditBoardModal from "@/components/modals/boards/EditBoardModal"


const BoardsPageContent = () => {
    const { pins } = useSelector((state: RootState) => state.pins)
    const activeFilter = useSelector((state: RootState) => state?.boardFilter?.boards?.activeFilter)
    const router = useRouter()
    const dispatch = useDispatch()

    const [editingBoard, setEditingBoard] = useState<BoardItem | null>(null)
    const [openBoardModal, setOpenBoardModal] = useState<boolean>(false)


    // Generate mock boards
    const mockBoards: BoardItem[] = useMemo(() => [
        {
            id: "1",
            title: "Travel Inspiration",
            pinIds: pins.slice(0, 7).map(p => p.id).filter((id): id is string | number => id !== undefined),
            createdByUser: true, // Add this property
        },
        {
            id: "2",
            title: "Home Decor Ideas",
            pinIds: pins.slice(0, 3).map(p => p.id).filter((id): id is string | number => id !== undefined),
            createdByUser: false, // Saved board
        },
        {
            id: "3",
            title: "Recipe Collection",
            pinIds: pins.slice(0, 12).map(p => p.id).filter((id): id is string | number => id !== undefined),
            createdByUser: true,
        },
        {
            id: "4",
            title: "Fashion",
            pinIds: pins.slice(0, 2).map(p => p.id).filter((id): id is string | number => id !== undefined),
            createdByUser: false,
        },
    ], [pins])

    // Filter boards based on active filter
    const filteredBoards = useMemo(() => {
        if (!activeFilter) return mockBoards // Show all boards if no filter

        if (activeFilter === 'all') {
            return mockBoards.filter(board => board.createdByUser === true)
        }

        if (activeFilter === 'group') {
            return mockBoards.filter(board => board.createdByUser === false)
        }

        return mockBoards
    }, [mockBoards, activeFilter])


    //handle edit board 
    const handleEditBoardItem = (item: BoardItem) => {
        setEditingBoard(item)
        setOpenBoardModal(true)
    }

    //handle close edit board
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

    // Boards grid (used by both mobile and desktop)
    const renderBoardsGrid = () => (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 border-b pb-8">
                {/* Filtered Boards */}
                {filteredBoards.length > 0 ? (
                    filteredBoards.map(board => (
                        <BoardsCard
                            key={board.id}
                            board={board}
                            previewPins={pins.filter(pin =>
                                board.pinIds.includes(pin.id as string | number)
                            )}
                            onBoardClick={() => router.push(`/dashboard/boards/${board.id}`)}
                            onEdit={(item) => handleEditBoardItem(item)}
                        />

                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        <p className="text-lg mb-2">
                            {activeFilter === 'all' && "No boards created yet"}
                            {activeFilter === 'group' && "No saved boards yet"}
                        </p>
                        <p className="text-sm">
                            {activeFilter === 'all' && "Start creating your own boards!"}
                            {activeFilter === 'group' && "Start saving boards to see them here"}
                        </p>
                    </div>
                )}

                {/* Create Board Card: Only on Desktop when no filter */}
                {!activeFilter && (
                    <div className="hidden md:block">
                        <CreateBoardCard
                            variant="create"
                            onClick={() => console.log('Create board')}
                        />
                    </div>
                )}

            </div>



            {/* Suggested Boards - Only on Desktop when no filter */}
            {!activeFilter && (
                <SuggestedBoards
                    suggested={mockBoards.slice(2)}
                    unorganizedPins={pins}
                    allPins={pins}
                />

            )}


            {editingBoard && (
                <EditBoardModal
                    isOpen={openBoardModal}
                    board={editingBoard}
                    onClose={handleCloseEditBoard}
                />
            )}

        </>
    )

    return (
        <div className="pb-8 md:pb-8">
            {renderBoardsGrid()}
        </div>
    )
}

export default BoardsPageContent