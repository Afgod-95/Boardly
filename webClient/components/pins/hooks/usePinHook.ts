import React, { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PinItem } from '@/types/pin'
import { setSelectedPin, removePin, updatePin } from '@/redux/pinSlice'
import { addPinToBoard, removePinFromBoard } from '@/redux/boardSlice'
import { AppDispatch, RootState } from '@/redux/store'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

const usePinHook = () => {
  const dispatch = useDispatch<AppDispatch>()

  const [editPopover, setEditPopover] = useState<boolean>(false)
  const [sharePopover, setSharePopover] = useState<boolean>(false)
  const [savePopover, setSavePopover] = useState<boolean>(false)

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const hoveredItem = (index: null | number) => {
    setHoveredIndex(index)
  }


  // Event handlers
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

  //show only saved pins to user 
  const savedPins = pins.filter(pin => pin.isSaved)

  // Filter pins based on active filter
  const filteredPins = useMemo(() => {
    if(!activeFilter) {
      return savedPins
    }
    if (activeFilter === 'favorites') {
      console.log(pins.length, pins.filter(pin => pin.isFavourite).length)
      return savedPins.filter(pin => pin.isFavourite)
    }
    if (activeFilter === 'created') {
      console.log(pins.length, pins.filter(pin => pin.createdByUser).length)
      return savedPins.filter(pin => pin.createdByUser)
    }

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
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pinUrl)}`,
            '_blank',
            'width=600,height=400'
          )
          break

        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(pinUrl)}&text=${encodeURIComponent(shareText)}`,
            '_blank',
            'width=600,height=400'
          )
          break

        case 'whatsapp':
          window.open(
            `https://wa.me/?text=${encodeURIComponent(`${shareText} ${pinUrl}`)}`,
            '_blank'
          )
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

  const handleSavePinToBoard = (pin: PinItem, boardId: string) => {
    try {
      // Remove from old board if exists
      if (pin.boardId) {
        dispatch(removePinFromBoard({ boardId: pin?.boardId as string, pinId: pin.id as string }))
      }

      // Add to new board (unless it's "profile" which means no board)
      if (boardId !== 'profile') {
        dispatch(addPinToBoard({ boardId: boardId as string | number, pinId: pin.id! as string | number }))
        toast.success('Pin saved to board!')
      } else {
        // Save to profile (no board)
        dispatch(updatePin(pin))
        toast.success('Pin saved to profile!')
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
      // Remove from board if exists
      if (pin.boardId) {
        dispatch(removePinFromBoard({ boardId: pin.boardId as string, pinId: pin.id! as string }))
      }

      // Delete the pin
      dispatch(removePin(pin.id!))

      toast.success('Pin deleted successfully')
      handleCloseEditPopover()

      // Navigate away if on pin detail page
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
      // Handle board change
      if (pin.boardId !== undefined && pin.boardId !== existingPin.boardId) {
        // Remove from old board
        if (existingPin.boardId) {
          dispatch(removePinFromBoard({
            boardId: existingPin.boardId as string,
            pinId: existingPin.id! as string
          }))
        }

        // Add to new board (unless it's "profile")
        if (pin.boardId && pin.boardId !== 'profile') {
          dispatch(addPinToBoard({
            boardId: pin.boardId as string,
            pinId: existingPin.id! as string
          }))
        }
      }

      // Update the pin
      dispatch(updatePin({ ...existingPin, ...pin, id: existingPin.id as string }))

      toast.success('Pin updated successfully')
    } catch (error) {
      toast.error('Failed to update pin')
      console.error('Update error:', error)
    }
  }

  // ---------------------------
  // SAVE PIN (when changes are made)
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


    //hovering state
    hoveredIndex,
    hoveredItem,

    // navigation & layout
    router,
    searchParams,
    pinsLayout,

    // filter
    activeFilter,

    // redux states
    filteredPins,
    selectedPin,
    pins,
    boards,
    dispatch,

    // event handlers
    handleClick,

    // popover actions
    handleOpenEditPopover,
    handleCloseEditPopover,
    handleOpenSharePopover,
    handleCloseSharePopover,
    handleOpenSavePopover,
    handleCloseSavePopover,

    // pin actions
    handleSharePin,
    handleSavePinToBoard,
    handleVisitSite,
    handleDeletePin,
    handlePinUpdate,
    handleSaveChanges,
    handleToggleFavorite,
  }
}

export default usePinHook