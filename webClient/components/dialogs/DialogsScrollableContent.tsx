import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button";



interface Props {
  dialogTitle: string;
  dialogDescription?: string;
  isActionButton?: boolean;
  buttonTitle?: string;
  onSubmit?: () => void;
  isLoading?: boolean
  children: React.ReactNode;
  className?: string // Added to allow specific overrides if needed
}

export function DialogScrollableContent({
  dialogTitle, dialogDescription,
  isLoading,
  onSubmit, isActionButton = false,
  buttonTitle,
  children, className
}: Props) {
  return (
    <DialogContent
      className={cn(
        // Default mobile width
        "w-[95vw] sm:w-full",
        // Scalable desktop widths
        "sm:max-w-137.5 md:max-w-162.5 lg:max-w-212.5",
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

      {/* Increased max-h on desktop (lg:max-h-[75vh]) 
          to make use of the larger screen real estate 
      */}
      <div className="no-scrollbar -mx-6 max-h-[60vh] lg:max-h-[75vh] overflow-y-auto px-6">
        {children}
      </div>
      {isActionButton === true && (
        <DialogFooter>
          <DialogClose>
            <Button variant="outline" className="w-full">Close</Button>
          </DialogClose>
          <Button className="bg-violet-600" onClick={onSubmit}>{buttonTitle}</Button>
        </DialogFooter>

      )}

    </DialogContent>
  )
}