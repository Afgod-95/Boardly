'use client'

import React from 'react'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { pressedButtons } from '@/lib/animations/pressedButtons'

interface CustomButtonProps {
  icon: React.ReactNode       
  onClick?: () => void         
  className?: string         
  size?: 'sm' | 'md' | 'lg'  
}

const sizeStyles = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-14 h-14',
}

const CustomButton = ({
  icon,
  onClick,
  className,
  size = 'md'
}: CustomButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      className={clsx(
        'flex items-center justify-center',
        'cursor-pointer hover:bg-muted rounded-2xl transition-colors',
        sizeStyles[size],
        className
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ ...pressedButtons.transition }}
    >
      {icon}
    </motion.button>
  )
}

export default CustomButton