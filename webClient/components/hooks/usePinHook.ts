import React, { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PinItem } from '@/types/pin'
import { setSelectedPin, removePin, updatePin } from '@/redux/pinSlice'
import { addPinToBoard, removePinFromBoard, createBoard } from '@/redux/boardSlice'
import { BoardItem } from '@/types/board'
import { AppDispatch, RootState } from '@/redux/store'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { usePinToast } from './usePinToast'



const usePinHook = () => {
  const showPinToast = usePinToast((show) => show.show)
  const dispatch = useDispatch<AppDispatch>()

  const [editPopover, setEditPopover] = useState<boolean>(false)
  const [sharePopover, setSharePopover] = useState<boolean>(false)
  const [savePopover, setSavePopover] = useState<boolean>(false)

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const hoveredItem = (index: null | number) => {
    setHoveredIndex(index)
  }

  const handleClick = (
    e: React.MouseEvent,
    handler: ((item: PinItem, index: number) => void) | undefined,
    item: PinItem,
    index: number
  ) => {
    e.stopPropagation();
    handler?.(item, index);
  };

  const { pins } = useSelector((state: RootState) => state.pins)
  const selectedPin = useSelector((state: RootState) => state.pins.selectedPin)
  const boards = useSelector((state: RootState) => state.boards.boards)
  const { activeFilter } = useSelector((state: RootState) => state.boardFilter.pins)
  const router = useRouter()
  const searchParams = useSearchParams()
  const layoutParam = searchParams.get("layout") as "compact" | "standard" | null
  const pinsLayout = layoutParam ?? "compact"

  const savedPins = pins.filter(pin => pin.isSaved)

  const filteredPins = useMemo(() => {
    if (!activeFilter) return savedPins
    if (activeFilter === 'favorites') return savedPins.filter(pin => pin.isFavourite)
    if (activeFilter === 'created') return savedPins.filter(pin => pin.createdByUser)
    return savedPins
  }, [savedPins, activeFilter])

  // ---------------------------
  // EDIT POPOVER
  // ---------------------------
  const handleOpenEditPopover = (pin: PinItem) => {
    dispatch(setSelectedPin(pin))
    setEditPopover(true)
  }

  const handleCloseEditPopover = () => {
    setEditPopover(false)
    dispatch(setSelectedPin(null))
  }

  // ---------------------------
  // SHARE POPOVER
  // ---------------------------
  const handleOpenSharePopover = (pin: PinItem) => {
    dispatch(setSelectedPin(pin))
    setSharePopover(true)
  }

  const handleCloseSharePopover = () => {
    setSharePopover(false)
  }

  const handleSharePin = async (pin: PinItem, method: 'link' | 'facebook' | 'twitter' | 'whatsapp' | 'email') => {
    const pinUrl = `${window.location.origin}/dashboard/pins/${pin.id}`
    const shareText = `Check out this pin: ${pin.title || 'Amazing Pin'}`

    try {
      switch (method) {
        case 'link':
          await navigator.clipboard.writeText(pinUrl)
          toast.success('Link copied to clipboard!')
          break
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pinUrl)}`, '_blank', 'width=600,height=400')
          break
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(pinUrl)}&text=${encodeURIComponent(shareText)}`, '_blank', 'width=600,height=400')
          break
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${pinUrl}`)}`, '_blank')
          break
        case 'email':
          window.location.href = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(pinUrl)}`
          break
      }
    } catch (error) {
      toast.error('Failed to share pin')
      console.error('Share error:', error)
    }
  }

  // ---------------------------
  // SAVE POPOVER
  // ---------------------------
  const handleOpenSavePopover = (pin: PinItem) => {
    dispatch(setSelectedPin(pin))
    setSavePopover(true)
  }

  const handleCloseSavePopover = () => {
    setSavePopover(false)
  }

  /**
   * FIX: When saving a pin to a board, we must update BOTH slices:
   *  1. boardSlice  → add pinId to board.pinIds
   *  2. pinSlice    → set pin.boardId so the pin knows which board it belongs to
   *
   * Previously only boardSlice was updated, so pin.boardId stayed undefined
   * and the pin kept appearing as "unorganized".
   */
  // Replace handleSavePinToBoard with:
const handleSavePinToBoard = (pin: PinItem, boardId: string | number) => {
  const boardIdStr = String(boardId)
  const pinIdStr   = String(pin.id)

  try {
    if (pin.boardId !== undefined && pin.boardId !== null) {
      dispatch(removePinFromBoard({ boardId: String(pin.boardId), pinId: pinIdStr }))
    }

    if (boardIdStr !== 'profile') {
      dispatch(addPinToBoard({ boardId: boardIdStr, pinId: pinIdStr }))
      dispatch(updatePin({ ...pin, boardId: boardIdStr }))

      const boardName = boards.find(b => String(b.id) === boardIdStr)?.title ?? "board"
      showPinToast({ pinId: pin.id, pinImg: pin.img, pinTitle: pin.title, boardName })
    } else {
      dispatch(updatePin({ ...pin, boardId: undefined }))
      showPinToast({ pinId: pin.id, pinImg: pin.img, pinTitle: pin.title, boardName: "your profile" })
    }

    handleCloseSavePopover()
  } catch (error) {
    toast.error('Failed to save pin')
    console.error('Save error:', error)
  }
}

  // ---------------------------
  // VISIT SITE
  // ---------------------------
  const handleVisitSite = (pin: PinItem) => {
    if (pin.link) {
      window.open(pin.link, '_blank')
    } else {
      toast.error('No link available for this pin')
    }
  }

  // ---------------------------
  // DELETE PIN
  // ---------------------------
  const handleDeletePin = (pin: PinItem) => {
    try {
      if (pin.boardId) {
        dispatch(removePinFromBoard({ boardId: pin.boardId as string, pinId: pin.id! as string }))
      }

      dispatch(removePin(pin.id!))
      toast.success('Pin deleted successfully')
      handleCloseEditPopover()

      if (window.location.pathname.includes(`/pins/${pin.id}`)) {
        router.push('/dashboard')
      }
    } catch (error) {
      toast.error('Failed to delete pin')
      console.error('Delete error:', error)
    }
  }

  // ---------------------------
  // UPDATE PIN
  // ---------------------------
  const handlePinUpdate = (pin: Partial<PinItem> & { id?: string | number }) => {
    if (!pin.id) return

    const existingPin = pins.find(p => p.id === pin.id)
    if (!existingPin) return

    try {
      if (pin.boardId !== undefined && pin.boardId !== existingPin.boardId) {
        if (existingPin.boardId) {
          dispatch(removePinFromBoard({ boardId: existingPin.boardId as string, pinId: existingPin.id! as string }))
        }
        if (pin.boardId && pin.boardId !== 'profile') {
          dispatch(addPinToBoard({ boardId: pin.boardId as string, pinId: existingPin.id! as string | number }))
        }
      }

      dispatch(updatePin({ ...existingPin, ...pin, id: existingPin.id as string }))
      toast.success('Pin updated successfully')
    } catch (error) {
      toast.error('Failed to update pin')
      console.error('Update error:', error)
    }
  }

  // ---------------------------
  // PROFILE VALUE
  // FIX: was mapping all pins into an array of board titles (mostly undefined).
  // Now returns a lookup fn: getProfileValue(pin) → board title or undefined
  // ---------------------------
  const getBoardTitleForPin = (pin: PinItem): string | undefined => {
    if (!pin.boardId) return undefined
    return boards.find((b) => b.id === pin.boardId)?.title
  }

  // ---------------------------
  // CREATE BOARD
  // ---------------------------
  const handleCreateBoard = (title: string) => {
    const newBoard: BoardItem = {
      id: Date.now().toString(),
      title,
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
      pinIds: [],
    }
    dispatch(createBoard(newBoard))
    toast.success(`Board "${title}" created!`)
  }

  // ---------------------------
  // SAVE CHANGES
  // ---------------------------
  const handleSaveChanges = () => {
    if (!selectedPin) return
    toast.success('Changes saved!')
    handleCloseEditPopover()
  }

  // ---------------------------
  // TOGGLE FAVORITE
  // ---------------------------
  const handleToggleFavorite = (pin: PinItem) => {
    dispatch(updatePin({ ...pin, isFavourite: !pin.isFavourite }))
    toast.success(pin.isFavourite ? 'Removed from favorites' : 'Added to favorites')
  }

  return {
    // states
    editPopover,
    sharePopover,
    savePopover,

    // FIX: replaced profileValue array with a per-pin lookup function
    getBoardTitleForPin,

    hoveredIndex,
    hoveredItem,

    router,
    searchParams,
    pinsLayout,

    activeFilter,

    filteredPins,
    selectedPin,
    pins,
    boards,
    dispatch,

    handleClick,

    handleOpenEditPopover,
    handleCloseEditPopover,
    handleOpenSharePopover,
    handleCloseSharePopover,
    handleOpenSavePopover,
    handleCloseSavePopover,

    handleSharePin,
    handleSavePinToBoard,
    handleVisitSite,
    handleDeletePin,
    handlePinUpdate,
    handleSaveChanges,
    handleToggleFavorite,
    handleCreateBoard,
  }
}

export default usePinHook