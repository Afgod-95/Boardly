import BoardsLayoutClient from '@/components/layouts/boards/BoardsLayoutClient'
import React from 'react'

const BoardsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <BoardsLayoutClient>{children}</BoardsLayoutClient>
  )
}

export default BoardsLayout