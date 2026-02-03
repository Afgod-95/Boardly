"use client"

import PinsGrid from "@/components/pins/grid/PinsGrid"
import { setSelectedPin } from "@/redux/pinSlice"
import usePinHook from "../../pins/hooks/usePinHook"
import { SaveToBoard, SharePin, EditPin } from "@/components/pins/popovers"
import { PinItem } from "@/types/pin"

const PinsPageContent = () => {
  const {
    editPopover,
    sharePopover,
    savePopover,

    router,
    pinsLayout,
    activeFilter,

    filteredPins,
    selectedPin,
    boards,
    dispatch,

    handleOpenEditPopover,
    handleCloseEditPopover,
    handleOpenSharePopover,
    handleCloseSharePopover,
    handleOpenSavePopover,
    handleCloseSavePopover,

    handleSharePin,
    handleSavePinToBoard,
    handleVisitSite,
    handleDeletePin,
    handlePinUpdate,
    handleSaveChanges,
    handleToggleFavorite,
  } = usePinHook()

  return (
    <div className="pb-20">
      <PinsGrid
        items={filteredPins}
        layout={pinsLayout}
        variant="board"
       dialogComponents={{
          EditDialogContent: ({ item }) => (
            <EditPin
              pin={item}
              onChange={handlePinUpdate}
              onSave={handleSaveChanges}
              onDelete={() => handleDeletePin(item)}
              onClose={handleCloseEditPopover}
            />
          ),

          ShareDialogContent: ({ item }) => (
            <SharePin
              pin={item}
              onShare={(method) => handleSharePin(item, method)}
              onClose={handleCloseSharePopover}
            />
          ),

          SaveDialogContent: ({ item }) => (
            <SaveToBoard
              pin={item}
              boards={boards}
              onSave={(boardId) => handleSavePinToBoard(item, boardId)}
              onClose={handleCloseSavePopover}
            />
          ),
        }}
      />
    </div>
  )
}

export default PinsPageContent
