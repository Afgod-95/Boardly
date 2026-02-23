'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/shared/headers/Header'
import PageWrapper from '@/components/shared/wrapper/PageWrapper'
import { PinMediaUpload, PinFormFields, PinDraftsSidebar } from '@/components/pins/create'
import { PinForm } from '@/types/pin'
import clsx from 'clsx'
import BackButton from '@/components/shared/buttons/CustomButton'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { saveDraft, deleteDraft, PinDraft } from '@/redux/pinSlice'
import { cn } from '@/lib/utils'
import CustomButton from '@/components/shared/buttons/CustomButton'
import { ChevronLeft } from 'lucide-react'

const CreatePinPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { pinDrafts } = useSelector((state: RootState) => state.pins)

  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeDraftId, setActiveDraftId] = useState<string | number | null>(null)

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

  // 1. Unified Save Logic
  const performSave = useCallback(() => {
    // Only save if there's significant content
    if (!currentPin.title && !currentPin.img && !currentPin.description) return;

    setIsSaving(true);

    // Create the draft object
    const draftId = activeDraftId || Date.now();
    const draftToSave: PinDraft = {
      ...currentPin,
      id: draftId
    };

    // Simulate small delay for the "Saving..." UI feel
    setTimeout(() => {
      dispatch(saveDraft(draftToSave));
      if (!activeDraftId) setActiveDraftId(draftId);
      setIsSaving(false);
    }, 600);
  }, [currentPin, activeDraftId, dispatch]);

  // 2. Debounce
  useEffect(() => {
    const timer = setTimeout(performSave, 1200);
    return () => clearTimeout(timer);
  }, [currentPin, performSave]);

  const handleOpenDraft = (draft: PinDraft) => {
    setActiveDraftId(draft.id);
    setCurrentPin({ ...draft });
    setIsCollapsed(false);
  };

  const handleCreateNew = () => {
    setActiveDraftId(null);
    setCurrentPin({
      title: '',
      img: '',
      board: '',
      description: '',
      link: '',
      saved: false,
      saveCount: 0,
      author: { name: 'Current User' },
    });
  };

  const handleDeleteDraft = (id: string | number) => {
    dispatch(deleteDraft(id));
    if (activeDraftId === id) handleCreateNew();
  };

  const handlePinChange = (updates: Partial<PinForm>) => {
    setCurrentPin(prev => ({ ...prev, ...updates }));
  };

  return (
    <PageWrapper>
      <Header />
      <motion.div
        className="flex flex-col lg:grid gap-8"
        animate={{
          gridTemplateColumns: typeof window !== 'undefined' && window.innerWidth >= 1024
            ? (isCollapsed ? '1fr 72px' : '1fr 340px')
            : '1fr',
        }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="space-y-6 lg:space-y-8 px-4 sm:px-6 lg:px-0 relative">

          {/* SKELETON SAVING OVERLAY */}
          <AnimatePresence>
            {isSaving && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/40 z-50 pointer-events-none flex items-start justify-center pt-24"
              >
                <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-2xl border border-slate-100 animate-pulse">
                  <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" />
                  <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Auto-Saving</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div className="flex items-center justify-between sticky top-18 lg:top-22 bg-white/90 backdrop-blur-md z-10 py-4">
            <div className='flex items-center gap-4'>
              <div className='md:hidden block'><CustomButton icon = {<ChevronLeft />} onClick={() => setIsCollapsed(!isCollapsed)} /></div>
              <h2 className="text-xl lg:text-3xl font-black tracking-tighter text-slate-900 italic">
                {activeDraftId ? 'Refining Draft' : 'New Inspiration'}
              </h2>
            </div>

            <motion.button
              whileTap={{ scale: 0.92 }}
              className={cn(
                "px-10 py-4 shadow-xl rounded-full text-white bg-violet-700",
                "hover:bg-violet-600 font-black transition-all active:scale-95 text-sm"
              )}
            >
              Publish
            </motion.button>
          </div>

          {/* Form Area */}
          <div className="flex flex-col lg:flex-row gap-16 items-start justify-center pt-8">
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

        {/* SIDEBAR */}
        <div className="hidden lg:block h-[calc(100vh-120px)] sticky top-24">
          <PinDraftsSidebar
            drafts={pinDrafts}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            onCreateNew={handleCreateNew}
            onOpenDraft={handleOpenDraft}
            onDeleteDraft={handleDeleteDraft}
          />
        </div>
      </motion.div>
    </PageWrapper>
  )
}

export default CreatePinPage