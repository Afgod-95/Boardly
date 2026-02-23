
import { LayoutPanelLeft, Layers, Lightbulb } from "lucide-react"
import { ActionButtons } from "@/components/shared/buttons";
import { Settings2 } from 'lucide-react'
import { PinsPopoverFilter} from "@/components/boards/tabs/tabFilters"


export type PinsLayout = 'standard' | 'compact';

interface Props {
  layoutValue?: PinsLayout
  setLayoutValue?: (newLayout: PinsLayout) => void
  onOrganizeClick?: () => void
  onMoreIdeasClick?: () => void
  onCollageClick?: () => void
}

export default function MoreActions({
  layoutValue = 'standard',
  setLayoutValue,
  onOrganizeClick,
  onMoreIdeasClick,
  onCollageClick

}: Props) {
  const actions = [
    { id: 1, title: "Organize", icon: LayoutPanelLeft, onClick: onOrganizeClick },
    { id: 2, title: "More Ideas", icon: Lightbulb, onClick: onMoreIdeasClick },
    { id: 3, title: "Collage", icon: Layers, onClick: onCollageClick },
  ]


  const handleLayoutChange = (newLayout: PinsLayout) => {
    setLayoutValue?.(newLayout)
  }

  //------------Boards Action Buttons 
  const boardsActionButtons = [
    { id: 1, icon: Settings2, onClick: () => console.log("Settings clicked") },
  ]


  return (
    <div className="items-center flex justify-between" >
      <div className="flex flex-row items-center gap-5">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.id}
              className="flex flex-col items-center gap-2  cursor-pointer"
            >
              <div className="p-5 rounded-4xl bg-accent flex items-center justify-center">
                <Icon size={28} />
              </div>
              <span className="font-semibold text-sm">{action.title}</span>
            </button>
          )
        })}
      </div>
     
        <ActionButtons buttons={boardsActionButtons}>
          <PinsPopoverFilter value={layoutValue} onChange={handleLayoutChange} />
        </ActionButtons>

    </div>

  )
}
