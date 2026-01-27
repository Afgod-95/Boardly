"use client"

import React from "react"
import BoardsLayout from "@/components/layouts/boards/BoardsLayout"
import PageWrapper from "@/components/wrapper/PageWrapper"

interface BoardsLayoutWrapperProps {
    children: React.ReactNode
}

const BoardsPageLayout = ({ children }: BoardsLayoutWrapperProps) => {
    return (
            <BoardsLayout>
                <PageWrapper>
                    {children}
                </PageWrapper>
                
            </BoardsLayout>
    )
}

export default BoardsPageLayout
