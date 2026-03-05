'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/shared/headers/Header'
import { PinMediaUpload, PinFormFields, PinDraftsSidebar } from '@/components/pins/create'
import { PinForm } from '@/types/pin'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { saveDraft, deleteDraft, PinDraft } from '@/redux/pinSlice'
import { cn } from '@/lib/utils'
import CustomButton from '@/components/shared/buttons/CustomButton'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMediaQuery } from 'react-responsive'

const CreatePinPage = () => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { pinDrafts } = useSelector((state: RootState) => state.pins)

  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeDraftId, setActiveDraftId] = useState<string | number | null>(null)

  const isMobile = useMediaQuery({ maxWidth: '767px' })

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

  const performSave = useCallback(() => {
    if (!currentPin.title && !currentPin.img && !currentPin.description) return

    setIsSaving(true)
    const draftId = activeDraftId || Date.now()
    const draftToSave: PinDraft = { ...currentPin, id: draftId }

    setTimeout(() => {
      dispatch(saveDraft(draftToSave))
      if (!activeDraftId) setActiveDraftId(draftId)
      setIsSaving(false)
    }, 600)
  }, [currentPin, activeDraftId, dispatch])

  useEffect(() => {
    const timer = setTimeout(performSave, 1200)
    return () => clearTimeout(timer)
  }, [currentPin, performSave])

  const handleOpenDraft = (draft: PinDraft) => {
    setActiveDraftId(draft.id)
    setCurrentPin({ ...draft })
    setIsCollapsed(false)
  }

  const handleCreateNew = () => {
    setActiveDraftId(null)
    setCurrentPin({
      title: '',
      img: '',
      board: '',
      description: '',
      link: '',
      saved: false,
      saveCount: 0,
      author: { name: 'Current User' },
    })
  }

  const handleDeleteDraft = (id: string | number) => {
    dispatch(deleteDraft(id))
    if (activeDraftId === id) handleCreateNew()
  }

  const handlePinChange = (updates: Partial<PinForm>) => {
    setCurrentPin(prev => ({ ...prev, ...updates }))
  }

  return (
    <>
      {!isMobile && <Header />}

      {/*
        FIX 1 — Use a plain flex/div layout instead of animating gridTemplateColumns.
        Framer Motion doesn't reliably tween grid column sizes, and the old
        window.innerWidth check was evaluated once at render time and never updated
        on resize. Now the sidebar simply has a fixed width controlled by a
        transition-[width] Tailwind class, which the browser handles natively.
      */}
      <div className="flex gap-8 px-3 md:px-5">

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 min-w-0 space-y-6 lg:space-y-8 relative">

          {/* Saving overlay */}
          <AnimatePresence>
            {isSaving && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/40 z-50 pointer-events-none flex items-start justify-center pt-10"
              >
                <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-2xl border border-slate-100 animate-pulse">
                  <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" />
                  <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">
                    Auto-Saving
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Page header */}
          <div className="flex items-center justify-between sticky top-0 lg:top-22 bg-white/90 backdrop-blur-md z-10 py-4">
            <div className="flex items-center gap-4">
              <div className="md:hidden block">
                <CustomButton
                  icon={<ChevronLeft />}
                  onClick={() => router.back()}
                />
              </div>
              <h2 className="text-md lg:text-2xl font-black tracking-tighter text-slate-900 italic">
                {activeDraftId ? 'Refining Draft' : 'New Inspiration'}
              </h2>
            </div>

            <motion.button
              whileTap={{ scale: 0.92 }}
              className={cn(
                'px-5 md:px-10 py-4 shadow-xl rounded-full text-white bg-violet-700',
                'hover:bg-violet-600 font-medium transition-all active:scale-95 text-sm md:text-lg',
              )}
            >
              Publish
            </motion.button>
          </div>

          {/* Form */}
          <div className="flex px-4 flex-row flex-wrap gap-10 items-start justify-center pt-8">
            <div className="w-full lg:w-auto lg:sticky lg:top-48">
              <PinMediaUpload
                imageValue={currentPin.img}
                videoValue={currentPin.video}
                onImageChange={(url) => handlePinChange({ img: url, video: '' })}
                onVideoChange={(url) => handlePinChange({ video: url, img: '' })}
                onRemove={() => handlePinChange({ img: '', video: '' })}
              />
            </div>

            <div className="w-full flex flex-col gap-4 transition-all duration-500 max-w-2xl">
              <PinFormFields pin={currentPin} onChange={handlePinChange} />
            </div>
          </div>
        </div>

        {/* ── SIDEBAR ──
            FIX: width is driven by a CSS transition on a plain div.
            This works correctly on every resize because it reacts to state,
            not to a stale window.innerWidth snapshot.
        */}
        <div
          className={cn(
            'hidden lg:block shrink-0 h-[calc(100vh-120px)] sticky top-24',
            'transition-[width] duration-400m ease-[cubic-bezier(0.23,1,0.32,1)]',
            isCollapsed ? 'w-18' : 'w-85',
          )}
        >
          <PinDraftsSidebar
            drafts={pinDrafts}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(prev => !prev)}
            onCreateNew={handleCreateNew}
            onOpenDraft={handleOpenDraft}
            onDeleteDraft={handleDeleteDraft}
          />
        </div>
      </div>
    </>
  )
}

export default CreatePinPage