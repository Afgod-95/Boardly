"use client"

import React from "react"
import { useMediaQuery } from "react-responsive"
import { Dialog } from "../../ui/dialog"
import BottomSheet from "../../ui/BottomSheet"
import { DialogScrollableContent } from "../../dialogs/DialogsScrollableContent"
import { Button } from "../../ui/button"
import { BottomSheetProps } from "@/types/bottomSheet"


interface ModalRootProps extends BottomSheetProps {
  isOpen: boolean
  onClose: () => void

  dialogTitle: string
  dialogDescription?: string
  isActionButton?: boolean
  buttonTitle?: string
  onSubmit?: () => void
  isLoading?: boolean

  className?: string
  children: React.ReactNode
}

const ModalRoot = ({
  isOpen,
  onClose,
  children,

  dialogTitle,
  buttonTitle,
  onSubmit,

  maxHeight = "90vh",
  showHandle = true,
  closeOnBackdropClick = true,
  dragToClose = true,
  dragThreshold = 100,
  velocityThreshold = 500,
}: ModalRootProps) => {
  const isDesktop = useMediaQuery({ minWidth: 1024 })
  const isMobileOrTablet = useMediaQuery({ maxWidth: 1023 })

  if (!isOpen) return null

  /* ---------------- DESKTOP ---------------- */
  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogScrollableContent
          dialogTitle={dialogTitle}
          isActionButton={!!buttonTitle}
          buttonTitle={buttonTitle}
          onSubmit={onSubmit}
        >
          {children}
        </DialogScrollableContent>
      </Dialog>
    )
  }

  /* ---------------- MOBILE / TABLET ---------------- */
  if (isMobileOrTablet){
    return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      maxHeight={maxHeight}
      showHandle={showHandle}
      closeOnBackdropClick={closeOnBackdropClick}
      dragToClose={dragToClose}
      dragThreshold={dragThreshold}
      velocityThreshold={velocityThreshold}
    >
      <div className="px-6 pb-6">
        <h2 className="text-center sm:text-left text-xl font-bold">
          {dialogTitle}
        </h2>

        <div className="pt-4">{children}</div>

        {buttonTitle && (
          <div className="pt-6">
            <Button className="w-full bg-violet-600" onClick={onSubmit}>
              {buttonTitle}
            </Button>
          </div>
        )}
      </div>
    </BottomSheet>
  )
  }
}

export default ModalRoot
