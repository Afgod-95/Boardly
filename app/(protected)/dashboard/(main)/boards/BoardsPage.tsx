"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { CreateBoardCard } from "@/components/boards/cards"
import { useRouter } from "next/navigation"
import { BoardsCard } from "@/components/boards/cards"
import SuggestedBoards from "@/components/boards/SuggestedBoards"
import { BoardItem } from "@/types/board"
import { setBoards } from "@/redux/boardSlice"

const BoardsPage = () => {
    const { pins } = useSelector((state: RootState) => state.pins)
    const router = useRouter()
    const dispatch = useDispatch()

    // Generate mock boards
    const mockBoards: BoardItem[] = [
        {
            id: "1",
            title: "Travel Inspiration",
            pinIds: pins.slice(0, 7).map(p => p.id).filter((id): id is string | number => id !== undefined),
        },
        {
            id: "2",
            title: "Home Decor Ideas",
            pinIds: pins.slice(0, 3).map(p => p.id).filter((id): id is string | number => id !== undefined),
        },
        {
            id: "3",
            title: "Recipe Collection",
            pinIds: pins.slice(0, 12).map(p => p.id).filter((id): id is string | number => id !== undefined),
        },
        {
            id: "4",
            title: "Fashion",
            pinIds: pins.slice(0, 2).map(p => p.id).filter((id): id is string | number => id !== undefined),
        },
    ]

    // Dispatch boards once when pins are ready
    useEffect(() => {
        if (pins.length > 0) {
            dispatch(setBoards(mockBoards))
        }
    }, [pins, dispatch])

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 border-b pb-8">
                <CreateBoardCard
                    variant="create"
                    onClick={() => console.log('Create board')}
                />
                {mockBoards.map(board => (
                    <BoardsCard
                        key={board.id}
                        board={board}
                        previewPins={pins.filter(pin => board.pinIds.includes(pin.id as string | number))}
                        onBoardClick={() => router.push(`/dashboard/boards/${board.id}`)}
                    />
                ))}
            </div>

            <SuggestedBoards
                suggested={mockBoards.slice(2)}
                unorganizedPins={pins}
                allPins={pins}
            />
        </>
    )
}

export default BoardsPage
