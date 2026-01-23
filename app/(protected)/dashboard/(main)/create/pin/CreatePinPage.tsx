'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Header from '@/components/headers/Header'
import PageWrapper from '@/components/wrapper/PageWrapper'
import { PinMediaUpload, PinFormFields, PinDraftsSidebar } from '@/components/pins/create'
import { PinForm } from '@/types/pin'
import clsx from 'clsx'

interface PinDraft extends PinForm {
  id: number | string
}

const CreatePinPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const [drafts, setDrafts] = useState<PinDraft[]>([
    {
      id: 1,
      title: 'Summer Travel Inspiration',
      img: '',
      board: 'Travel',
      description: '',
      link: '',
      saved: false,
      saveCount: 0,
      author: { name: 'John Doe' },
    },
    {
      id: 2,
      title: 'Recipe Ideas',
      img: '',
      board: 'Food',
      description: '',
      link: '',
      saved: false,
      saveCount: 0,
      author: { name: 'Jane Doe' },
    },
  ])

  const [currentPin, setCurrentPin] = useState<PinForm>({
    title: '',
    img: '',
    board: '',
    description: '',
    link: '',
    saved: false,
    saveCount: 0,
    author: { name: 'Current User' },
  })

  const handleOpenDraft = (draft: PinDraft) => {
    setCurrentPin({ ...draft })
    setIsCollapsed(false)
  }

  const handleCreateNew = () => {
    setCurrentPin({
      title: '',
      img: '',
      video: '',
      board: '',
      description: '',
      link: '',
      saved: false,
      saveCount: 0,
      author: { name: 'Current User' },
    })
  }

  const handleSaveDraft = () => {
    if (!currentPin.title) return alert('Enter a title')
    const newDraft: PinDraft = {
      id: drafts.length + 1,
      ...currentPin,
    }
    setDrafts([...drafts, newDraft])
    handleCreateNew()
  }

  const handlePinChange = (updates: Partial<PinForm>) => {
    setCurrentPin({ ...currentPin, ...updates })
  }

  const handleRemoveMedia = () => {
    setCurrentPin({ ...currentPin, img: '', video: '' })
  }

  return (
    <PageWrapper>
      <Header />

      <motion.div
        className="flex flex-col lg:grid gap-8"
        // Animate only on Large screens where grid is active
        animate={{
          gridTemplateColumns: typeof window !== 'undefined' && window.innerWidth >= 1024 
            ? (isCollapsed ? '1fr 60px' : '1fr 320px') 
            : '1fr',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* LEFT PANEL: Pin Form */}
        <div className="space-y-6 lg:space-y-8 px-4 sm:px-6 lg:px-0">
          
          {/* Sticky Header with improved padding for mobile */}
          <div className="flex items-center justify-between sticky top-[72px] lg:top-22 bg-white/90 backdrop-blur-md z-10 py-4 border-b lg:border-none">
            <h2 className="text-lg lg:text-xl font-bold">Create Pin</h2>
            <button className="px-6 lg:px-8 py-2.5 lg:py-3 shadow-sm text-white bg-violet-700 hover:bg-violet-600 rounded-full font-semibold transition text-sm lg:text-base">
              Publish
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-center">
            {/* Media Upload (Full width on mobile, auto on desktop) */}
            <div className="w-full lg:w-auto flex justify-center">
              <PinMediaUpload
                imageValue={currentPin.img}
                videoValue={currentPin.video}
                onImageChange={(url) => handlePinChange({ img: url, video: '' })}
                onVideoChange={(url) => handlePinChange({ video: url, img: '' })}
                onRemove={handleRemoveMedia}
              />
            </div>

            {/* Form Fields - Responsive width handling */}
            <div className={clsx(
                'w-full flex flex-col gap-4', 
                !isCollapsed ? 'max-w-full' : 'max-w-2xl'
              )}
            >
              <PinFormFields
                pin={currentPin}
                onChange={handlePinChange}
                onSaveDraft={handleSaveDraft}
              />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Drafts - Hidden on mobile, toggleable on LG */}
        <div className="hidden lg:block h-[calc(100vh-120px)] sticky top-24">
          <PinDraftsSidebar
            drafts={drafts}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            onCreateNew={handleCreateNew}
            onOpenDraft={handleOpenDraft}
          />
        </div>

        {/* MOBILE DRAFTS (Optional: Bottom Drawer or simple list if needed) */}
        {drafts.length > 0 && (
            <div className="block lg:hidden px-4 pb-10">
                <h3 className="font-bold mb-4">Your Drafts ({drafts.length})</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {drafts.map((draft) => (
                        <button 
                            key={draft.id}
                            onClick={() => handleOpenDraft(draft)}
                            className="flex-shrink-0 w-32 aspect-square bg-gray-100 rounded-xl overflow-hidden border"
                        >
                            {draft.img ? (
                                <img src={draft.img} className="w-full h-full object-cover" alt="" />
                            ) : (
                                <div className="p-2 text-xs text-left truncate">{draft.title}</div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        )}
      </motion.div>
    </PageWrapper>
  )
}

export default CreatePinPage