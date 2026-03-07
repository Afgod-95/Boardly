"use client"

import { create } from "zustand"

interface PinToastState {
  pinId?: string | number
  pinImg?: string
  pinTitle?: string
  boardName?: string
}

interface PinToastStore {
  toast: PinToastState | null
  show: (data: PinToastState) => void
  hide: () => void
}

// Global singleton store — call show() from anywhere, renders once in layout
export const usePinToast = create<PinToastStore>((set) => ({
  toast: null,
  show: (data) => set({ toast: data }),
  hide: () => set({ toast: null }),
}))
