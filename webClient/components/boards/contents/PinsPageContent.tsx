"use client"
import usePinHook from "../../pins/hooks/usePinHook"
import SmartPinsGrid from "@/components/shared/grid/SmartPinsGrid"

const PinsPageContent = () => {
  const {
    pinsLayout,
    filteredPins,
  } = usePinHook()

  return (
    <div className="pb-20">
      <SmartPinsGrid
        key={filteredPins.map(pin => pin.id).join(',')}
        items={filteredPins}
        layout={pinsLayout}
        variant="board"
      />
    </div>
  )
}

export default PinsPageContent