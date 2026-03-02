"use client"

import React from "react"
import BoardsLayout from "@/components/layouts/boards/BoardsLayout"
import PageWrapper from "@/components/shared/wrapper/PageWrapper"
import { usePathname } from "next/navigation"

interface BoardsLayoutWrapperProps {
    children: React.ReactNode
}

const BoardsLayoutClient = ({ children }: BoardsLayoutWrapperProps) => {
    return (
        <>

            <BoardsLayout>
              
                {children}
             
            </BoardsLayout>

        </>
    )
}

export default BoardsLayoutClient