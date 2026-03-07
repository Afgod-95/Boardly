"use client"
import React, { useState } from 'react'
import PinsGrid, { PinCardVariant } from '../../pins/grid/PinsGrid'
import usePinHook from "@/components/hooks/usePinHook"
import { SaveToBoard, SharePin, EditPin, MoreOptionsContent } from "@/components/pins/popovers"
import { CreateBoardDialog } from "@/components/shared/dialogs/CreateBoardDialog"
import { PinItem } from '@/types/pin'

interface SmartPinsGridProps {
    items: PinItem[]
    isLoading?: boolean
    isOrganized?: boolean
    isFetchingNextPage?: boolean
    hasNextPage?: boolean
    onLoadMore?: () => void
    onClick?: (pin: PinItem) => void
    variant: PinCardVariant
    layout?: "standard" | "compact"
    showMetadata?: boolean
    showStarIcon?: boolean
    showStarButton?: boolean
    showPlusButton?: boolean
    onAddToCanvasClick?: (pin: PinItem) => void
}

const SmartPinsGrid = ({
    items,
    variant,
    layout,
    showMetadata,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    onLoadMore,
    onClick = (pin) => { window.location.href = `/dashboard/pins/${pin.id}` },
    ...restOfProps
}: SmartPinsGridProps) => {
    const {
        boards,
        handleSharePin,
        handleSavePinToBoard,
        handleDeletePin,
        handleSaveChanges,
        getBoardTitleForPin,
        handleCreateBoard, // add this to usePinHook if not already there
    } = usePinHook()

    // Lifted outside Popover so CreateBoardDialog isn't nested inside it
    const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false)

    return (
        <>
            <PinsGrid
                {...restOfProps}
               
                onClick={onClick}
                items={items}
                variant={variant}
                layout={layout}
                profileValue={getBoardTitleForPin}
                showMetadata={showMetadata}
                isLoading={isLoading}
                isFetchingNextPage={isFetchingNextPage}
                hasNextPage={hasNextPage}
                onLoadMore={onLoadMore}
                PopoverComponents={{
                    ProfilePopoverContent: ({ item }) => (
                        <SaveToBoard
                            pin={item}
                            boards={boards}
                            onSave={(boardId) => handleSavePinToBoard(item, boardId)}
                            isCreateBoardOpen={isCreateBoardOpen}
                            onCreateBoardOpenChange={setIsCreateBoardOpen}
                        />
                    ),
                   
                    SharePopoverContent: ({ item }) => (
                        <SharePin
                            pin={item}
                            onShare={(method) => handleSharePin(item, method)}
                        />
                    ),
                    EditDialogContent: ({ item }) => (
                        <EditPin
                            pin={item}
                            onDelete={() => handleDeletePin(item)}
                            onSave={handleSaveChanges}
                            onChange={() => { }}
                        />
                    ),
                }}
                popoverComponents={{
                    MoreOptionsPopoverContent: ({ item }) => (
                        <MoreOptionsContent pin={item} />
                    ),
                }}
            />

            {/* Rendered outside PinsGrid/Popover so focus is never stolen */}
            <CreateBoardDialog
                open={isCreateBoardOpen}
                onOpenChange={setIsCreateBoardOpen}
                onCreateBoard={(title) => handleCreateBoard?.(title)}
            />
        </>
    )
}

export default SmartPinsGrid