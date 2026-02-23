"use client"
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

interface HeaderStyleProps {
    headerRight?: React.ReactNode,
    title?: string,
    headerLeft?: React.ReactNode,
}
const MobileHeaderStyle = ({ headerRight, title, headerLeft }: HeaderStyleProps) => {
  const router = useRouter();
  return (
    <div className='md:hidden bg-background flex items-center justify-between pt-4'>
        {headerLeft || (
          <div className = 'flex items-center justify-center'
            onClick={() => router.back()}
          >
            <ChevronLeft  size={24}/>
          </div>
        )}
        <div className='text-xl font-bold'>{title}</div>
        {headerRight || <div />}
    </div>
  )
}

export default MobileHeaderStyle
