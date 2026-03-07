import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Button } from "../../ui/button"

interface Props {
  dialogTitle: string;
  dialogDescription?: string;
  isActionButton?: boolean;
  buttonTitle?: React.ReactNode; // was string — now accepts <Loader2 /> etc.
  onSubmit?: () => void;
  isLoading?: boolean;
  isSubmitting?: boolean;       // alias used by CreateBoardModal
  children: React.ReactNode;
  className?: string;
}

export function DialogScrollableContent({
  dialogTitle,
  dialogDescription,
  isLoading,
  isSubmitting,
  onSubmit,
  isActionButton = false,
  buttonTitle,
  children,
  className,
}: Props) {
  const busy = isLoading || isSubmitting

  return (
    <DialogContent
      className={cn(
        "w-[95vw] sm:w-full",
        "max-w-2xl",
        "rounded-3xl p-6",
        className
      )}
    >
      <DialogHeader className="pb-2">
        <DialogTitle className="text-center sm:text-left text-xl lg:text-2xl font-bold">
          {dialogTitle}
        </DialogTitle>
        {dialogDescription && (
          <DialogDescription className="text-center sm:text-left">
            {dialogDescription}
          </DialogDescription>
        )}
      </DialogHeader>

      <div className="no-scrollbar -mx-6 max-h-[60vh] lg:max-h-[75vh] overflow-y-auto px-6">
        {children}
      </div>

      {isActionButton === true && (
        <DialogFooter>
          <DialogClose>
            <Button asChild variant="outline" className="w-full" disabled={busy}>
              Close
            </Button>
          </DialogClose>
          <Button
            className="bg-violet-600 hover:bg-violet-700 min-w-[120px]"
            onClick={onSubmit}
            disabled={busy}
          >
            {buttonTitle}
          </Button>
        </DialogFooter>
      )}
    </DialogContent>
  )
}