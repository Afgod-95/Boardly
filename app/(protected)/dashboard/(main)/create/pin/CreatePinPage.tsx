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
    <div className="min-h-screen bg-white">
      <Header />

      <PageWrapper>
        <motion.div
          className="grid gap-8"
          animate={{
            gridTemplateColumns: isCollapsed ? '1fr 60px' : '1fr 320px',
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {/* LEFT PANEL: Pin Form */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Create Pin</h2>
              <button className="bg-purple-700 text-white px-6 py-2 rounded-full font-semibold hover:bg-purple-800 transition">
                Publish
              </button>
            </div>

            <div className="flex flex-wrap gap-8 items-center justify-center">
              <PinMediaUpload
                imageValue={currentPin.img}
                videoValue={currentPin.video}
                onImageChange={(url) => handlePinChange({ img: url, video: '' })}
                onVideoChange={(url) => handlePinChange({ video: url, img: '' })}
                onRemove={handleRemoveMedia}
              />

              <div className={clsx('flex flex-col gap-4', !isCollapsed ? 'w-full' : 'w-xl')}>
                <PinFormFields
                  pin={currentPin}
                  onChange={handlePinChange}
                  onSaveDraft={handleSaveDraft}
                />
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Drafts */}
          <PinDraftsSidebar
            drafts={drafts}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            onCreateNew={handleCreateNew}
            onOpenDraft={handleOpenDraft}
          />
        </motion.div>
      </PageWrapper>
    </div>
  )
}

export default CreatePinPage