import React, { useState } from 'react'
import CollageSearchBar from '../card/CollageSearchBar'
import { MoreIdeasTab, YourBoardsTab, DraftsTab, BoardDetailTab  } from '../contents/tab_contents'
import TabNavigation from '@/components/boards/tabs/TabNavigation'
import { ChevronLeft } from 'lucide-react'
import { PinItem } from '@/types/pin'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import  fabric  from 'fabric'
import TextPropertiesPanel from './TextPropertiesPanel'

type PanelView =
  | { type: 'tabs' }
  | { type: 'board-detail'; boardId: string }

interface RightPanelProps {
  onAddToCanvas: (pin: PinItem) => void
  activeObject: fabric.Object | null
  fabricRef: React.RefObject<fabric.Canvas | null>
}

const RightPanel = ({ onAddToCanvas, activeObject, fabricRef }: RightPanelProps) => {
  const [activeTab, setActiveTab] = useState('ideas')
  const [panelView, setPanelView] = useState<PanelView>({ type: 'tabs' })
  const { boards } = useSelector((state: RootState ) => state.boards)

  // Inside RightPanel, above the tabs view return:
  const isText = activeObject?.type === 'textbox' || activeObject?.type === 'text'

  const tabs = [
    { id: 1, name: "More Ideas", active: activeTab === 'ideas', onClick: () => setActiveTab('ideas') },
    { id: 2, name: "Your Boards", active: activeTab === 'boards', onClick: () => setActiveTab('boards') },
    { id: 3, name: "Drafts", active: activeTab === 'drafts', onClick: () => setActiveTab('drafts') },
  ]

  if (panelView.type === 'board-detail') {
    return (
      <div className='h-full p-6 space-y-4'>
        <button
          onClick={() => setPanelView({ type: 'tabs' })}
          className='flex items-center gap-1 text-lg text-gray-500 hover:text-gray-800'
        >
          <ChevronLeft size={28} /> {boards.find((b) => b.id === panelView.boardId)?.title}
        </button>
        <BoardDetailTab boardId={panelView.boardId} onAddToCanvas={onAddToCanvas} />
      </div>
    )
  }

  // In the RightPanel return — show above tabs when text selected:
  return (
    <div className='h-full flex flex-col'>
      {isText && activeObject && (
        <TextPropertiesPanel activeObject={activeObject} fabricRef={fabricRef} />
      )}
      <div className='p-6 space-y-4 flex-1 overflow-hidden flex flex-col'>
        <CollageSearchBar />
        <TabNavigation tabs={tabs} />
        <div className='overflow-y-scroll flex-1 px-1'>
          {activeTab === 'ideas' && <MoreIdeasTab onAddToCanvas={onAddToCanvas} />}
          {activeTab === 'boards' && (
            <YourBoardsTab onBoardClick={(id) => setPanelView({ type: 'board-detail', boardId: id })} />
          )}
          {activeTab === 'drafts' && <DraftsTab />}
        </div>
      </div>
    </div>
  )
}

export default RightPanel