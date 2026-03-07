import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { PopoverType, SideProp, AlignContentProp, SaveMode } from './types/pinoverlay.types'
import { LucideIcon } from 'lucide-react'
import { PinsLayout } from '@/components/boards/MoreActions'

export const iconBtnClass =
        "bg-white/90 p-2 sm:p-2.5 rounded-xl shadow-sm flex items-center justify-center active:scale-95 transition-transform touch-manipulation min-w-[36px] min-h-[36px]";


interface PopoverProps {
    children: React.ReactNode
    buttonContent?: React.ReactNode
    saveMode?: SaveMode
    iconCont?: boolean
    popoverType: PopoverType
    layout?: PinsLayout
    side?: SideProp
    alignContent?: AlignContentProp,
    icon: LucideIcon
    value?: string
}



const PopoverWrapper = ({
    children, popoverType,
    iconCont = true,
    layout, icon: Icon, ...props
}: PopoverProps) => {
    const [openPopover, setOpenPopover] = useState<PopoverType>(null);


    const handlePopoverOpenChange = (type: PopoverType, open: boolean) => {
        setOpenPopover(open ? type : null);
    };

    const shouldPreventInteractOutside = (target: HTMLElement): boolean => {
        return (
            !!target.closest('[role="dialog"]') ||
            !!target.closest('[data-radix-popper-content-wrapper]') ||
            target.hasAttribute('data-radix-portal')
        );
    };

    const handleInteractOutside = (e: Event) => {
        const target = e.target as HTMLElement;
        if (shouldPreventInteractOutside(target)) {
            e.preventDefault();
        }
    };

    // Responsive Popover base styles
    const popoverStyles = cn(
        "z-50 rounded-3xl bg-white p-4 shadow-xl border-none",
        "w-[calc(100vw-2rem)] sm:w-auto sm:min-w-[280px] md:min-w-[320px] max-w-[95vw]",
        "max-h-[80vh] overflow-y-auto no-scrollbar"
    );

    // Shared icon button style for bottom actions
    

    return (
        <Popover
            open={openPopover === popoverType}
            onOpenChange={(o) => handlePopoverOpenChange(popoverType, o)}
            modal={true}
        >
            <PopoverTrigger asChild>
                {iconCont === true ? (
                    <motion.button
                        onClick={(e) => e.stopPropagation()}
                        whileTap={{ scale: 0.95 }}
                        className={cn(iconBtnClass, "gap-1.5")}
                    >
                        <Icon size={16} className="sm:w-4.5 sm:h-4.5" />
                    </motion.button>
                ) : (
                    <motion.button
                        onClick={(e) => e.stopPropagation()}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-white/10 text-white backdrop-blur-sm"
                    >
                        <span className="text-sm font-semibold truncate hidden sm:inline">{props.value}</span>
                        <Icon size={16} />
                    </motion.button>
                )}
            </PopoverTrigger>
            <PopoverContent
                side={props.side}
                align={props.alignContent}
                sideOffset={12}
                className={popoverStyles}
                onClick={(e) => e.stopPropagation()}
                onInteractOutside={handleInteractOutside}
            >
                {children}
            </PopoverContent>
        </Popover>
    )
}

export default PopoverWrapper