'use client'

import React from 'react'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { pressedButtons } from '@/lib/animations/pressedButtons'

interface CustomButtonProps {
  icon?: React.ReactNode   
  text?: string  
  disabled?: boolean  
  onClick?: () => void         
  className?: string         
  size?: 'sm' | 'md' | 'lg'  
  style?: React.CSSProperties
}

const sizeStyles = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-14 h-14',
}

const CustomButton = ({
  icon,
  onClick,
  disabled,
  className = clsx(
    'flex items-center justify-center cursor-pointer',
    'hover:bg-muted rounded-2xl transition-colors',
    sizeStyles
  ),
  style,
  text,
  size = 'md'
}: CustomButtonProps) => {

  return (
    <motion.button
      disabled={!!disabled}
      onClick={onClick}
      className={clsx(
        'flex items-center justify-center p-4',
        'cursor-pointer rounded-2xl transition-colors',
        [size],
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      transition={{ ...pressedButtons.transition }}
    >
      {icon} 
      {text && <span style={style} className="text-xs font-medium ml-1">{text}</span>}
    </motion.button>
  )
}

export default CustomButton