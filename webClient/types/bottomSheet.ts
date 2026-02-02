import { ReactNode } from "react";

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxHeight?: string;
  showHandle?: boolean;
  closeOnBackdropClick?: boolean;
  dragToClose?: boolean;
  dragThreshold?: number;
  velocityThreshold?: number;
}
