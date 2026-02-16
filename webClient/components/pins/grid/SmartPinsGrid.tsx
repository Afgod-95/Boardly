"use client";
import React from 'react';
import PinsGrid, { PinCardVariant } from './PinsGrid';
import usePinHook from "@/components/pins/hooks/usePinHook"; // Adjust path
import { SaveToBoard, SharePin, EditPin, MoreOptionsContent } from "@/components/pins/popovers";
import { PinItem } from '@/types/pin';

interface SmartPinsGridProps {
    items: PinItem[];
    variant: PinCardVariant;
    layout?: "standard" | "compact";
    profileValue?: string;
    showMetadata?: boolean;
    showStarIcon?: boolean
   
}

const SmartPinsGrid = ({ items, variant, layout, profileValue, showMetadata, ...restOfProps }: SmartPinsGridProps) => {
    // Pull all the logic from your hook once
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

            // Inject all the logic automatically
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
                        onChange={() => { }} // Handle logic inside EditPin
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