import React from 'react'
import CollageSearchBar from '../card/CollageSearchBar'
import SmartPinsGrid from '@/components/shared/grid/SmartPinsGrid'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

const RightPanel = () => {
  const { pins } = useSelector((state: RootState) => state.pins)
  return (
    <div className='h-full flex-col items-center justify-center p-6'>

      <div className='space-y-4'>
       <CollageSearchBar />
       <div className='overflow-y-scroll h-[calc(100vh-200px)] px-1'>
        <SmartPinsGrid items={pins} variant='collage' showPlusButton = {true} />
       </div>
      
      </div>
    </div>
  )
}

export default RightPanel