"use client"

import React from "react"
import BoardsLayout from "@/components/layouts/boards/BoardsLayout"
import PageWrapper from "@/components/wrapper/PageWrapper"

interface BoardsLayoutWrapperProps {
    children: React.ReactNode
}

const BoardsPageLayout = ({ children }: BoardsLayoutWrapperProps) => {
    return (
        <PageWrapper>
            <BoardsLayout>
                {children}
            </BoardsLayout>
        </PageWrapper>

    )
}

export default BoardsPageLayout
