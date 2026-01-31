"use client"
import { PinItem } from "@/webClient/types/pin";
import { useState } from "react";


const usePinsHook = () => {
    //hovering state
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const hoveredItem = (index: null | number ) => {
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



    return {
        handleClick,
        
        //hovering state
        hoveredIndex,
        hoveredItem
    }
}

export default usePinsHook