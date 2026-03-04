"use client"
import usePinHook from "../../pins/hooks/usePinHook"
import SmartPinsGrid from "@/components/shared/grid/SmartPinsGrid"

const PinsPage = () => {
  const {
    pinsLayout,
    filteredPins,
  } = usePinHook()

  return (
    <div className="pb-20 px-3 md:px-5">
      <SmartPinsGrid
        key={filteredPins.map(pin => pin.id).join(',')}
        items={filteredPins}
        layout={pinsLayout}
        variant="board"
      />
    </div>
  )
}

export default PinsPage