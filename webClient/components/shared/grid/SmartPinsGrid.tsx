"use client";
import React from 'react';
import PinsGrid, { PinCardVariant } from '../../pins/grid/PinsGrid';
import usePinHook from "@/components/pins/hooks/usePinHook";
import { SaveToBoard, SharePin, EditPin, MoreOptionsContent } from "@/components/pins/popovers";
import { PinItem } from '@/types/pin';

interface SmartPinsGridProps {
    items: PinItem[];
    isLoading?: boolean;
    isFetchingNextPage?: boolean;
    hasNextPage?: boolean;
    onLoadMore?: () => void;
    variant: PinCardVariant;
    layout?: "standard" | "compact";
    profileValue?: string;
    showMetadata?: boolean;
    showStarIcon?: boolean;
    showStarButton?: boolean;
    showPlusButton?: boolean;
    onAddToCanvasClick?: (pin: PinItem) => void;
}

const SmartPinsGrid = ({
    items,
    variant,
    layout,
    profileValue,
    showMetadata,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    onLoadMore,
    ...restOfProps
}: SmartPinsGridProps) => {
    const {
        boards,
        handleSharePin,
        handleSavePinToBoard,
        handleVisitSite,
        handleDeletePin,
        handleSaveChanges,
    } = usePinHook();

    return (
        <PinsGrid
            {...restOfProps}
            items={items}
            variant={variant}
            layout={layout}
            profileValue={profileValue}
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
                    />
                ),
                SavePopoverContent: ({ item }) => (
                    <SaveToBoard
                        pin={item}
                        boards={boards}
                        onSave={(boardId) => handleSavePinToBoard(item, boardId)}
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
                        onChange={() => {}}
                    />
                ),
                VisitPopoverContent: ({ item, onClose }) => {
                    handleVisitSite(item);
                    onClose();
                    return null;
                },
            }}
            popoverComponents={{
                MoreOptionsPopoverContent: ({ item }) => (
                    <MoreOptionsContent pin={item} />
                )
            }}
        />
    );
};

export default SmartPinsGrid;