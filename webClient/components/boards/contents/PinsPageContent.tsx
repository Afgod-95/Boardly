"use client"
import PinsGrid from "@/components/pins/grid/PinsGrid"
import { setSelectedPin } from "@/redux/pinSlice"
import usePinHook from "../../pins/hooks/usePinHook"
import { SaveToBoard, SharePin, EditPin } from "@/components/pins/popovers"
import { PinItem } from "@/types/pin"

const PinsPageContent = () => {
  const {
    pinsLayout,
    filteredPins,
    boards,
    handleSharePin,
    handleSavePinToBoard,
    handleVisitSite,
    handleDeletePin,
    handleSaveChanges,
  } = usePinHook()

  return (
    <div className="pb-20">
      <PinsGrid
        key={filteredPins.map(pin => pin.id).join(',')}
        items={filteredPins}
        layout={pinsLayout}
        variant="board"

        dialogComponents={{
          ProfileDialogContent: ({ item, onClose }) => (
            <SaveToBoard 
              pin={item}
              boards={boards}
              onSave={(boardId) => handleSavePinToBoard(item, boardId)}
              onClose={onClose}
            />
          ),
          SaveDialogContent: ({ item, onClose }) => (
            <SaveToBoard
              pin={item}
              boards={boards}
              onSave={(boardId) => handleSavePinToBoard(item, boardId)}
              onClose={onClose}
            />
          ),
          ShareDialogContent: ({ item, onClose }) => (
            <SharePin
              pin={item}
              onShare={(method) => handleSharePin(item, method)}
              onClose={onClose}
            />
          ),
          EditDialogContent: ({ item, onClose }) => (
            <EditPin
              pin={item}
              onDelete={() => handleDeletePin(item)}
              onSave={handleSaveChanges}
              onChange= {() => console.log('Pin Change')}
              onClose={onClose}
            />
          ),
          VisitDialogContent: ({ item, onClose }) => {
            handleVisitSite(item);
            onClose();
            return null;
          },
        }}
      />
    </div>
  )
}

export default PinsPageContent