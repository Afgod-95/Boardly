import usePinHook from '@/components/pins/hooks/usePinHook'
import SmartPinsGrid from '@/components/shared/grid/SmartPinsGrid'
import { PinItem } from '@/types/pin'

const MoreIdeasTab = ({ onAddToCanvas }: { onAddToCanvas: (pin: PinItem) => void }) => {
  const { pins } = usePinHook()
  return (
    <SmartPinsGrid 
      items={pins}
      variant='collage'
      showPlusButton={true}
      onAddToCanvasClick={(pin) => onAddToCanvas(pin)}
    />
  )
}

export default MoreIdeasTab