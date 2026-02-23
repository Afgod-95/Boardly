import { cn } from "@/lib/utils"

const PageWrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn("px-4 sm:px-5", className)}>
      {children}
    </div>
  )
}

export default PageWrapper
