"use client"
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import CustomButton from '../buttons/CustomButton'

interface HeaderStyleProps {
    headerRight?: React.ReactNode,
    title?: string,
    headerLeft?: React.ReactNode,
}
const MobileHeaderStyle = ({ headerRight, title, headerLeft }: HeaderStyleProps) => {
  const router = useRouter();
  return (
    <div className='sm:flex md:hidden sticky top-0 z-20 bg-background p-2 flex items-center justify-between'>
        {headerLeft || (
          <CustomButton 
            icon = {<ChevronLeft />}
            className='p-0'
            onClick={() => router.back()}
          />
        )}
        <div className='text-xl font-bold'>{title}</div>
        {headerRight || <div />}
    </div>
  )
}

export default MobileHeaderStyle
